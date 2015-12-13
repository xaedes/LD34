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
                angle: -90,
                length: 15,
                strength: 5
            }
        );
        this.root.generateChildren({
            branches: [2, 6],
            radius: 50
        });

        this.gKey = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        this.gKey.onDown.add(function() {
            console.log("Grow!");
            this.grow();
            this.draw();
        }, this);

        this.onGrow = new Phaser.Signal();
        this.onCut = new Phaser.Signal();

        this.draw();
    }

    Tree.prototype = Object.create(Phaser.Group.prototype);
    Tree.prototype.constructor = Tree;

    ////
    // Public methods
    ////
    Tree.prototype.grow = function () {
        this.root.grow();
        this.root.updatePheromoneLevel();

        this.onGrow.dispatch();

        return this;
    };

    Tree.prototype.draw = function () {
        window.tree_graphics.clear();
        this.root.draw();

        return this;
    };

    Tree.prototype.cut = function(cutLine) {
        this.root.cut(cutLine);
        this.draw();
        
        this.onCut.dispatch();
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