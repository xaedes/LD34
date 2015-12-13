'use strict';

define(['phaser', 'helper','objects/tree/leaf'], function(Phaser, Helper, Leaf) {
    function Branch(game, parent, config) {
        this.game = game;
        this.parent = parent;
        this.children = [];
        this.leafs = [new Leaf(
            Helper.randomNormal(this.game.rnd, 0, 10),
            Helper.randomNormal(this.game.rnd, 0, 10),
            this.game.rnd.integer())];
        this.config = config;
        this.pheromone = [1, 1, 1];

        this.line = new Phaser.Line();

        this._update();
    }

    Branch.prototype = Object.create(Phaser.Group.prototype);
    Branch.prototype.constructor = Branch;


    ////
    // Public methods
    ////
    Branch.prototype.generateChildren = function (branch_config) {
        var config = {
            angle: this.config.angle + this.game.rnd.integerInRange(-branch_config.radius, branch_config.radius),
            length: this.game.rnd.realInRange(5, 20),
            strength: this.game.rnd.realInRange(4, this.config.strength)
        };

        var branch = new Branch(this.game, this, config);
        this.children.push(branch);

        return branch;
    };

    Branch.prototype.grow = function () {
        this.config.length = this.config.length + 10*(Math.abs(Helper.randomNormal(this.game.rnd, this.pheromone[0], 0.1)));
        this.config.strength = this.config.strength * this.pheromone[1];

        this._update();
        this.children.forEach(function (child) {
            child.grow();
        });

        // add child branches, if branch is strength enough
        if ( this.pheromone[2] >= this.game.rnd.realInRange(0, 1) && 0.7/this.children.length >= this.game.rnd.realInRange(0,1)) {
            this.generateChildren({
                radius: 50
            });
        }

        if (this.config.length > 60 && this.game.rnd.realInRange(0, 1) > 0.3) {
            this._split();
        }

        return this;
    };

    /**
     * Draw the current branch and then all children branches
     *
     * @returns {Branch}
     */
    Branch.prototype.draw = function () {
        var graphics = window.tree_graphics;

        // set a fill and line style
        graphics.lineStyle(this.config.strength, 0x37220f, 1);

        // draw a shape
        //graphics.moveTo(this.line.start.x, this.line.start.y);
        graphics.lineTo(this.line.end.x, this.line.end.y);

        graphics.lineWidth = 0;
        graphics.beginFill(0x37220f, 1);
        graphics.drawCircle(this.line.end.x, this.line.end.y, this.config.strength * 0.5);
        graphics.endFill();

        //this.children.forEach(function (child) {
        //    child.draw();
        //});

        return this;
    };

    /**
     * Updates the pheromone level of this specific branch
     *
     * @returns {number[]} Pheromone levels for this branch (grow, strength, branch)
     */
    Branch.prototype.updatePheromoneLevel = function () {
        if (this.children.length == 0) {
            this.pheromone = [1, 1, 1];
        } else {
            var grow = 0, strength = 0, branch = 0;
            this.children.forEach(function (child) {
                var childPheromone = child.updatePheromoneLevel();
                grow += childPheromone[0];
                strength += childPheromone[1];
                branch += childPheromone[2];
            });

            grow /= this.children.length;
            strength /= this.children.length;
            branch /= this.children.length;

            grow *= 0.2;
            strength *= 1.001;
            branch *= 0.5;

            this.pheromone = [grow, strength, branch];
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
        var newConfig = Helper.clone(this.config);
        newConfig.length = position || this.game.rnd.realInRange(this.config.length * 0.25, this.config.length * 0.75);

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