'use strict';

define(['phaser', 'objects/tree/branch', 'utils/graphics_wrapper', 'objects/leaf_sprites'], function(Phaser, Branch, GraphicsWrapper, LeafSprites) {
    function Tree(game, x, y) {
        // super constructor
        Phaser.Group.call(this, game, game.world, 'tree', true, true, Phaser.Physics.ARCADE);

        this._x = game.width / 2;
        this._y = game.height;
        window.tree_graphics = new GraphicsWrapper(game, 0, 0);
        window.tree = this;

        this.root = new Branch(
            game,
            this,
            {
                angle: -90,
                length: 15,
                strength: 20,
                year: 10
            }
        );
        this.root.generateChildren({
            branches: [2, 6],
            radius: 50
        });

        this.growModus = 0;

        this.gKey = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        var self = this;
        this.gKey.onDown.add(function() {
            if (!this.growModus) {
                this.growModus = 1;
                var intervalID = setInterval(function() {
                    self.grow();
                    self.draw();

                    if (++self.growModus === 15) {
                        self.growModus = 0;
                        window.clearInterval(intervalID);
                    }
                }, 25);
            }

        }, this);

        // Signals
        this.onGrow = new Phaser.Signal();
        this.onCut = new Phaser.Signal();

        // Intialize leaf rendering
        this.leafs = new LeafSprites(this.game, this);
        this.game.world.add(this.leafs);


        // Initial draw call
        this.draw();


        //// Leaf emitter
        var leafFrames = [];
        for (var i = 0; i < this.leafs.num_different_leafs; i++) {
            leafFrames.push(i);
        }

        this.leafEmitter = this.game.add.emitter(0, 0, 5000);
        this.leafEmitter.makeParticles('leafs', leafFrames);
        this.leafEmitter.maxParticleScale = 1.6;
        this.leafEmitter.minParticleScale = 0.9;
        this.leafEmitter.setYSpeed(-5, 20);
        this.leafEmitter.setXSpeed(-20, 20);
        this.leafEmitter.setAlpha(1, 0, 5000);
        this.leafEmitter.gravity = 30;
        this.leafEmitter.minRotation = 0;
        this.leafEmitter.maxRotation = 40;
    }

    Tree.prototype.particleBurst = function (pointer) {

        //  Position the emitter where the mouse/touch event was


    };

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

        // draw branches
        var stack = [this.root];
        while(stack.length > 0) {
            var current = stack.pop();
            current.children.forEach( function(child) {
                stack.push(child);
            });

            graphics.lineStyle(current.config.strength, 0x37220f, 1);
            graphics.lineTo(current.x, current.y);

            if (current.children.length == 0 && stack.length > 0) {
                graphics.moveTo(
                    stack[stack.length-1].parent.line.start.x, stack[stack.length-1].parent.line.start.y);
            }
        }

        // draw joins between branches
        stack = [this.root];
        graphics.lineWidth = 0;
        graphics.beginFill(0x37220f, 1);
        graphics.moveTo(this.root.line.start.x, this.root.line.start.y);
        this.traverseBranches(function(branch){
            graphics.drawCircle(
                branch.line.end.x, 
                branch.line.end.y, 
                branch.config.strength);
        }, this);
        graphics.endFill();

        // draw leaves
        this.leafs.drawingTexture.clear();
        this.traverseBranches(function(branch){
            branch.leafs.forEach(function(leaf) {
                leaf.draw(this.leafs);
            }, this);
        }, this);

        return this;
    };

    Tree.prototype.cut = function(cutLine) {
        this.root.cut(cutLine);
        this.draw();
        
        this.onCut.dispatch();
    };

    Tree.prototype.traverseBranches = function(callback,callbackThis) {
        var stack = [this.root];
        while(stack.length > 0){
            var current = stack.pop();
            current.children.forEach(function(child){
                stack.push(child);
            });
            callback.call(callbackThis, current);
        }
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