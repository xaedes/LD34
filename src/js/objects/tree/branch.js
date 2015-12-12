'use strict';

define(['phaser', 'objects/tree'], function(Phaser, Tree) {
    function Branch(game, parent, config) {
        // suprer constructor
        Phaser.Group.call(this, game, parent, 'branch', true, true, Phaser.Physics.ARCADE);

        this.parent = parent;
        this.children = [];
        this.config = config;

        //game.stage.backgroundColor = '#124184';
        this.line = new Phaser.Line();

        this._update();
        this.draw();
    }

    Branch.prototype = Object.create(Phaser.Group.prototype);
    Branch.prototype.constructor = Branch;


    ////
    // Public methods
    ////
    Branch.prototype.generateChildren = function (branch_config) {

        for( var i = randomIntFromInterval(1, 3); i >=0; i--) {
            var config = {
                depth: this.config.depth + 1,
                angle: this.config.angle + randomIntFromInterval(-branch_config.radius, branch_config.radius),
                length: this.config.length * randomFromInterval(0.6, 0.98),
                strength: this.config.strength * randomFromInterval(0.5, 0.8),
                branchFactor: branch_config.branchFactor + randomFromInterval(0.1, 0.3)
            };

            var branch = new Branch(this.game, this, config);

            if (this.config.depth <= 4) {
                branch.generateChildren(branch_config);
            }
        }

        return branch;
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

        return this;
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