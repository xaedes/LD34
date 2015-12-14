'use strict';

define(['phaser', 'objects/tree/genome', 'objects/tree/branch', 'utils/graphics_wrapper', 'objects/leaf_sprites', 'objects/grid2d'],
    function(Phaser, Genome, Branch, GraphicsWrapper, LeafSprites, Grid2d) {

    function Tree(game, x, y) {
        // super constructor
        Phaser.Group.call(this, game, game.world, 'tree', true, true, Phaser.Physics.ARCADE);
        this.genome = new Genome();
        this._x = game.width / 2;
        this._y = game.height;
        window.tree_graphics = new GraphicsWrapper(game, 0, 0);
        window.tree = this;
        this.tree = this;

        // Heatmap for leaves
        this.leafDensity = new Grid2d(this.game, 
            Math.floor(game.width / this.genome.leafDensityResolution),
            Math.floor(game.height / this.genome.leafDensityResolution));
        this.branchDensity = new Grid2d(this.game, 
            Math.floor(game.width / this.genome.branchDensityResolution),
            Math.floor(game.height / this.genome.branchDensityResolution));

        // Signals
        this.onGrow = new Phaser.Signal();
        this.onCut = new Phaser.Signal();

        // Intialize leaf rendering
        this.leafs = new LeafSprites(this.game, this);
        this.game.world.add(this.leafs);

        this.root = new Branch(
            game,
            this,
            {
                level: 0,
                angle: this.genome.startBranchConfig.angle,
                original_angle: this.genome.startBranchConfig.angle,
                length: this.genome.startBranchConfig.length,
                strength: this.genome.startBranchConfig.strength,
                year: this.genome.startBranchConfig.year,
                angle_rate: 0
            },
            this
        );
        this.root.generateChildren({
            radius: this.genome.startBranchConfig.radius
        });

        this.growModus = 0;

        this.gKey = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        var self = this;
        // ToDo: move into gameplay
        this.gKey.onDown.add(function() {
            if (!this.growModus) {
                this.growModus = 1;
                var intervalID = setInterval(function() {
                    self.grow();
                    self.draw();

                    if (++self.growModus === self.genome.growCount) {
                        self.growModus = 0;
                        window.clearInterval(intervalID);
                    }
                }, this.genome.growRate);
            }

        }, this);

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

        this.leafWindEmitter = this.game.add.emitter(0, 0, 500);
        this.leafWindEmitter.makeParticles('leafs', leafFrames);
        this.leafWindEmitter.maxParticleScale = 1.6;
        this.leafWindEmitter.minParticleScale = 0.9;
        this.leafWindEmitter.setYSpeed(-15, 20);
        this.leafWindEmitter.setXSpeed(0, 80);
        this.leafWindEmitter.gravity = 5;
        this.leafWindEmitter.minRotation = 0;
        this.leafWindEmitter.maxRotation = 40;
        this.leafWindEmitter.angularDrag = 10;
        this.leafWindEmitter.setAlpha(1, 0.2, 10000);
        this.leafWindEmitter.height = game.world.height/2;
        this.leafWindEmitter.emitX = game.world.width/2;
        this.leafWindEmitter.emitY = game.world.height/2;

        this.leafWindEmitter.start(false, 10000, 1000);

        // Initial draw call
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

        this._treeHeight = 0;

        // draw branches
        this.branchDensity.clear();
        var stack = [this.root];
        graphics.moveTo(this.root.line.start.x, this.root.line.start.y);
        while(stack.length > 0) {
            var current = stack.pop();
            current.children.forEach( function(child) {
                stack.push(child);
            });

            if (this.game.world.height - current.x >  this._treeHeight) {
                this._treeHeight = this.game.world.height - current.x
            }

            graphics.lineStyle(current.config.strength, 0x37220f, 1);
            graphics.lineTo(current.x, current.y);

            if (current.children.length == 0 && stack.length > 0) {
                graphics.moveTo(
                    stack[stack.length-1].parent.line.start.x, stack[stack.length-1].parent.line.start.y);
            }

            this.branchDensity.addLine(current.line);
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
        this.leafDensity.clear();
        this.leafs.drawingTexture.clear();
        this.traverseBranches(function(branch) {
            branch.leafs.forEach(function(leaf) {
                leaf.draw(this.leafs);

                // update leafDensity
                this.leafDensity.add(branch.line.end.x + leaf.x, branch.line.end.y + leaf.y);
            }, this);
        }, this);

        // update wind leave emitter
        this.leafWindEmitter.height = this._treeHeight * 0.75;
        this.leafWindEmitter.emitY = (game.world.height - this._treeHeight/2);

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