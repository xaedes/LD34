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
                strength: 20
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
        var graphics = window.tree_graphics;
        graphics.clear();

        //this.root.draw();

        var stack = [this.root];
        window.tree_graphics.moveTo(this.root.line.start.x, this.root.line.start.y);

        while(stack.length > 0) {
            var current = stack.pop();
            current.children.forEach( function(child) {
                stack.push(child);
            });

            window.tree_graphics.lineStyle(current.config.strength, 0x37220f, 1);
            window.tree_graphics.lineTo(current.x, current.y);

            if (current.children.length == 0 && stack.length > 0) {
                window.tree_graphics.moveTo(
                    stack[stack.length-1].parent.line.start.x, stack[stack.length-1].parent.line.start.y);
            }
        }

        stack = [this.root];
        window.tree_graphics.moveTo(this.root.line.start.x, this.root.line.start.y);

        while(stack.length > 0) {
            current = stack.pop();
            current.children.forEach( function(child) {
                stack.push(child);
            });

            graphics.lineWidth = 0;
            graphics.beginFill(0x37220f, 1);
            graphics.drawCircle(current.line.end.x, current.line.end.y, current.config.strength * 0.5);
            graphics.endFill();
        }

        // draw a shape
        //graphics.moveTo(this.line.start.x, this.line.start.y);
        //graphics.lineTo(this.line.end.x, this.line.end.y);

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