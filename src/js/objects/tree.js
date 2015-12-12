'use strict';

define(['phaser', 'objects/tree/branch'], function(Phaser, Branch) {
    function Tree(game, x, y) {
        // super constructor
        Phaser.Group.call(this, game, game.world, 'tree', true, true, Phaser.Physics.ARCADE);

        this._x = game.width / 2;
        this._y = game.height;

        var graphics = game.add.graphics(0, 0);
        window.tree_graphics = graphics;


        this.root = new Branch(
            game,
            this,
            {
                depth: 0,
                angle: -90,
                length: 100,
                strength: 20,
                branchFactor: 2
            }
        );
        this.root.generateChildren({
            branchPred: 0.5,
            radius: 50
        });

    }

    Tree.prototype = Object.create(Phaser.Group.prototype);
    Tree.prototype.constructor = Tree;

    ////
    // Public methods
    ////
    Tree.prototype.draw = function () {
        this.root.draw();

        return this;
    };


    ////
    // Properties
    ////
    Object.defineProperty(Tree.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        }
    });

    Object.defineProperty(Tree.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        }
    });


    return Tree;
});