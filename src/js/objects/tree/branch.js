'use strict';

define(['phaser', 'objects/tree', 'helper'], function(Phaser, Tree, Helper) {
    function Branch(game, parent, config) {
        // suprer constructor
        Phaser.Group.call(this, game, parent, 'branch', true, true, Phaser.Physics.ARCADE);

        this.parent = parent;
        this.children = [];
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
        //console.log( this.pheromone[2])
            var config = {
                depth: this.config.depth + 1,
                angle: this.config.angle + this.game.rnd.integerInRange(-branch_config.radius, branch_config.radius),
                length: this.game.rnd.realInRange(5, 20),
                strength: this.game.rnd.realInRange(1, 4)
            };

            var branch = new Branch(this.game, this, config);
            this.children.push(branch);

        return branch;
    };

    Branch.prototype.grow = function () {
        this.config.length = this.config.length * (1 + Math.abs(Helper.randomNormal(this.game.rnd, this.pheromone[0], 0.1))); //* this.game.rnd.realInRange(1.0, 1.0 + .1 * Math.ceil(this.config.depth/3));
        this.config.strength = this.config.strength * this.pheromone[1]; //* this.game.rnd.realInRange(1.01, 1.1);

        this._update();
        this.children.forEach(function (child) {
            child.grow();
        });

        // add child branches, if branch is strength enough
        if ( this.pheromone[2] >= this.game.rnd.realInRange(0, 1)) {
            this.generateChildren({
                radius: 50
            });
        }

        return this;
    };

    Branch.prototype.draw = function () {
        var graphics = window.tree_graphics;

        // set a fill and line style
        graphics.beginFill(0xFF3300);
        graphics.lineStyle(this.config.strength, 0xffd900, 1);

        // draw a shape
        graphics.moveTo(this.line.start.x, this.line.start.y);
        graphics.lineTo(this.line.end.x, this.line.end.y);
        graphics.endFill();

        this.children.forEach(function (child) {
            child.draw();
        });

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

            grow *= 0.02;
            strength *= 1.001;
            branch *= 0.9;

            this.pheromone = [grow, strength, branch];
        }

        return this.pheromone;
    };


    ////
    // Private methods
    ////
    Branch.prototype._update = function() {
        this.line.fromAngle(this.parent.x, this.parent.y, (this.config.angle) * (Math.PI/180), this.config.length);
        this.x = this.line.end.x;
        this.y = this.line.end.y;
    };

    Branch.prototype._addBranch = function (parent) {
        var branch = new Branch(this.game, parent);


        return branch;
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