'use strict';

define(['phaser', 'helper','objects/tree/leaf'], function(Phaser, Helper, Leaf) {
    function Branch(game, parent, config) {
        this.game = game;
        this.parent = parent;
        this.tree = this.parent.tree;

        this.children = [];
        this.leafs = [];

        this.config = config;
        this.pheromone = Helper.clone(this.tree.genome.branch.pheromone);

        this.line = new Phaser.Line();

        this._update();

        this._addRandomLeaf();
    }

    // Branch.prototype = Object.create(Phaser.Group.prototype);
    Branch.prototype.constructor = Branch;


    ////
    // Public methods
    ////
    Branch.prototype.generateChildren = function (branch_config) {
        var angle = this.config.angle + this.game.rnd.integerInRange(-branch_config.radius, branch_config.radius);
        var config = {
            level: this.config.level + 1,
            angle: angle,
            length: this.tree.genome.branch.generateChildren.length(),
            strength: this.tree.genome.branch.generateChildren.strength(this.config),
            year: 0,
            angle_rate: 0,
            original_angle: angle,
            longterm_angle: this.config.angle + this.tree.genome.branch.jointDynamics.longtermTargetAngleDifference()
        };
        // check if enough space is free
        var line = new Phaser.Line();
        line.fromAngle(this.x, this.y, config.angle);
        if (this.tree.branchDensity.getLine(line) > this.tree.genome.branch.generateChildren.maxBranchDensity) {
            return undefined;
        }

        if (config.angle > this.tree.genome.branch.generateChildren.minAngle() &&
            config.angle < this.tree.genome.branch.generateChildren.maxAngle()) {

            var branch = new Branch(this.game, this, config);
            this.children.push(branch);

            this.tree.branchDensity.addLine(line);

            return branch;
        }

        return undefined;
    };

    Branch.prototype.jointDynamics = function (dimish) {
        var genome = this.tree.genome.branch.jointDynamics;
        // angular movement
        this.config.angle += dimish * this.config.angle_rate;

        // add random force to create angular movement
        this.config.angle_rate += dimish * genome.angle_rate_rate(this.config);

        // force angle back to its original_angle
        this.config.angle = Helper.gainFilter(this.config.angle,this.config.original_angle,Helper.lerp(1,genome.originalAngleGain,dimish));

        // force angle to its long term angle value
        this.config.angle = Helper.gainFilter(this.config.angle,this.config.longterm_angle,Helper.lerp(1,genome.longtermTargetAngleDifferenceGain,dimish));

        // let original_angle very slowly adapt
        this.config.original_angle = Helper.gainFilter(this.config.original_angle,this.config.angle,Helper.lerp(1,genome.originalAngleAdaptionGain,dimish));

        // force angle to targetAngle if is too different from it
        var targetAngle = genome.targetAngle;
        var targetAngleDeadZone = genome.targetAngleDeadZone;
        var targetAngleGain = genome.targetAngleGain;
        if (Math.abs(this.config.angle - (targetAngle))>targetAngleDeadZone){
            this.config.angle = Helper.gainFilter(this.config.angle,targetAngle,
                Helper.lerp(1,targetAngleGain,dimish));
        }

        // force angle_rate back to zero
        this.config.angle_rate = Helper.gainFilter(this.config.angle_rate,0,Helper.lerp(1,genome.angleRateZeroGain,dimish));

    };

    Branch.prototype.grow = function (dimish) {
        var genome = this.tree.genome.branch.grow;
        this.config.length += dimish * genome.length.multiplicator * (Math.abs(Helper.randomNormal(this.pheromone[genome.length.pheromoneIdx], genome.length.pheromoneStd))) / (genome.length.dividerMin+(this.config.year)/genome.length.yearDivider);
        this.config.strength += dimish * ((this.pheromone[genome.strength.pheromoneIdx] - genome.strength.subtract)  / (genome.strength.dividerMin+(this.config.year)/genome.strength.yearDivider));

        this.jointDynamics(dimish);

        // // console.log(this.config.angle);

        this._update();
        this.children.forEach(function (child) {
            child.grow(dimish);
        });

        // add child branches, if branch is strength enough
        if (dimish * this.pheromone[genome.childCondition.pheromoneIdx] >= this.game.rnd.realInRange(0, 1) &&
            dimish * genome.childCondition.numChildrenMultiplicator / this.children.length >= this.game.rnd.realInRange(0,1) &&
            this.config.year > genome.childCondition.minYear()
            && this._areParentsStrongEnough()
            && this.config.length / this.children.length > genome.childCondition.minLengthPerChild
            //&& (this.config.length * this.config.strength) / this.pheromone[3] < 0.9
            //&& this.pheromone[3] < (this.config.length * this.config.strength)
        ) {

            this.generateChildren({
                radius: genome.childCondition.radius
            });
        }

        if (this.config.length > genome.splitCondition.minLength && 
            dimish * genome.splitCondition.probability >= this.game.rnd.realInRange(0, 1)) {
            this._split();
        }

        // Update leaves
        var aliveLeafs = [];
        this.leafs.forEach(function(leaf) {
            leaf.update(dimish);
            if (!leaf.killed) {
                aliveLeafs.push(leaf);
            }

            if (dimish * genome.leafGrowProbability >= this.game.rnd.realInRange(0,1.0)) {
                leaf.numLeaves = Math.min(leaf.numLeaves+1, this.tree.leafs.leafs_per_frame);
            }
        }, this);
        this.leafs = aliveLeafs;


        // Generate new leaves
        if (dimish * (1-genome.newLeaf.probabilityMultiplicator * this.leafs.length / this.config.length) >= this.game.rnd.realInRange(0,1) &&
            this.config.strength < genome.newLeaf.maxStrength
        ) {
            this._addRandomLeaf();
        }

        this.config.year += dimish;

        return this;
    };

    /**
     * Updates the pheromone level of this specific branch
     *
     * @returns {number[]} Pheromone levels for this branch (grow, strength, branch, weight)
     */
    Branch.prototype.updatePheromoneLevel = function () {
        var genome = this.tree.genome.branch.updatePheromoneLevel;

        if (this.children.length == 0) {
            this.pheromone = Helper.clone(this.tree.genome.branch.pheromone);
            this.pheromone.push(this.config.length * this.config.strength);
        } else {
            var grow = 0, strength = 0, branch = 0, weight = 0;
            this.children.forEach(function (child) {
                var childPheromone = child.updatePheromoneLevel();
                grow += childPheromone[0];
                strength += childPheromone[1];
                branch += childPheromone[2];
                weight += childPheromone[3];
            });

            grow /= this.children.length;
            strength /= this.children.length;
            branch /= this.children.length;

            grow *= genome.grow;
            strength *= genome.strength;
            branch *= genome.branch;

            this.pheromone = [grow, strength, branch, weight];
        }

        return this.pheromone;
    };

    /**
     * Prunes the tree at the given cut line
     *
     * @param cutLine
     */
    Branch.prototype.cut = function(cutLine) {
        var intersect = this.line.intersects(cutLine);
        if (intersect) {
            this.children.forEach(function(child) {
                child.dropLeavesAnimation();
            }, this);

            this.children = [];
            var dx = intersect.x - this.line.start.x;
            var dy = intersect.y - this.line.start.y;
            this._split(true, Math.sqrt(dx*dx + dy*dy));
        } else {
            this.children.forEach(function(child) {
                child.cut(cutLine);
            });

        }
    };

    Branch.prototype.dropLeavesAnimation = function() {
        var p = this.line.random();
        window.tree.leafEmitter.x = p.x;
        window.tree.leafEmitter.y = p.y;
        window.tree.leafEmitter.start(
            this.tree.genome.leaf.emitter.start_explode, 
            this.tree.genome.leaf.emitter.start_lifespan(), 
            this.tree.genome.leaf.emitter.start_frequency, 
            this.tree.genome.leaf.emitter.start_quantity(this.config) 
            );

        this.children.forEach(function(child) {
            child.dropLeavesAnimation();
        }, this);
    };


    ////
    // Private methods
    ////

    /**
     * Updates position of current branch according to parent branch's position
     * @private
     */
    Branch.prototype._update = function() {
        this.line.fromAngle(this.parent.x, this.parent.y, (this.config.angle) * (Math.PI/180), this.config.length);
        this.x = this.line.end.x;
        this.y = this.line.end.y;
    };

    /**
     * Split a branch into to new branches.
     *
     * If not cut position defined, choose a random one.
     *
     * @param discardChildren if true, then discard all childrens
     * @param position (optional) as length one line
     *
     * @returns {Branch} self
     * @private
     */

    Branch.prototype._split = function(discardChildren, position) {
        var genome = this.tree.genome.branch.randomSplitPosition;
        var newConfig = Helper.clone(this.config);
        newConfig.length = position || this.game.rnd.realInRange(this.config.length * genome.minLength, this.config.length * genome.maxLength);

        var newBranch = new Branch(this.game, this.parent, newConfig);

        if (!discardChildren) {
            newBranch.children = [this];
        }

        this.config.length -= newConfig.length;
        if (this.parent) {
            if (this.parent.constructor.name == "Tree") {
                this.parent.root = newBranch;
            } else {
                var i = this.parent.children.indexOf(this);
                this.parent.children[i] = newBranch;
            }
        }
        this.parent = newBranch;


        newBranch._update();
        this._update();

        return this;
    };

    /**
     *
     * @returns {boolean}
     * @private
     */
    Branch.prototype._areParentsStrongEnough = function() {
        var genome = this.tree.genome.branch._areParentsStrongEnough;
        var myWeight = this.config.strength * this.config.length;
        var childWeight = this.pheromone[genome.pheromoneIdx];

        if (!this.parent.config) { // root branch
            return true;
        }

        if (myWeight * Helper.randomNormal(genome.myWeightRandomMean, genome.myWeightRandomStd) <= childWeight) {
            return false;
        } else {
            return this.parent._areParentsStrongEnough();
        }
    };

    Branch.prototype._addRandomLeaf = function() {
        var genome = this.tree.genome.branch._addRandomLeaf;
        var p = Helper.randomPointOnLine(this.line, genome.randomPointMin, genome.randomPointMax);
        p.x -= this.line.end.x;
        p.y -= this.line.end.y;

        p.x += Helper.randomNormal(0, 1) * this.tree.leafs.leaf_displacement_x;
        p.y += Helper.randomNormal(0, 1) * this.tree.leafs.leaf_displacement_y;

        if (this.tree.leafDensity.get(this.line.end.x + p.x, this.line.end.y + p.y) >= genome.maxLeafDensity) {
            return;
        }

        this.leafs.push(new Leaf(
            this,
            p.x,
            p.y,
            this.game.rnd.integer(),
            1
        ));
        this.tree.leafDensity.add(this.line.end.x + p.x, this.line.end.y + p.y);
    };

    ////
    // Properties
    ////
    Object.defineProperty(Branch.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        }
    });

    Object.defineProperty(Branch.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        }
    });

    return Branch;
});