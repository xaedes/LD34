'use strict';

define(['phaser', 'objects/tree/genome', 'objects/tree/branch', 'utils/graphics_wrapper', 'objects/leaf_sprites', 'objects/grid2d',
        'objects/render_texture_image'],
    function(Phaser, Genome, Branch, GraphicsWrapper, LeafSprites, Grid2d, RenderTextureImage) {

    function Tree(game, x, y) {
        // super constructor
        Phaser.Group.call(this, game, game.world, 'tree', true, true, Phaser.Physics.ARCADE);
        this.genome = new Genome(game);
        this._x = game.width / 2;
        this._y = game.height;
        window.tree_graphics = new GraphicsWrapper(game, 0, 0);
        window.tree = this;
        this.tree = this;

        // Heatmap for leaves
        this.leafDensity = new Grid2d(this.game, 
            Math.floor(game.width / this.genome.leaf_density_resolution),
            Math.floor(game.height / this.genome.leaf_density_resolution));
        this.branchDensity = new Grid2d(this.game, 
            Math.floor(game.width / this.genome.branch_density_resolution),
            Math.floor(game.height / this.genome.branch_density_resolution));

        // Signals
        this.onGrow = new Phaser.Signal();
        this.onCut = new Phaser.Signal();

        // Intialize leaf rendering
        this.leafs = new LeafSprites(this.game, this);
        this.leafsImage = new RenderTextureImage(this.game);
        this.game.world.add(this.leafsImage);

        this.root = new Branch(
            game,
            this,
            {
                level: 0,
                angle: this.genome.branch.start_config.angle,
                original_angle: this.genome.branch.start_config.angle,
                length: this.genome.branch.start_config.length,
                strength: this.genome.branch.start_config.strength,
                year: this.genome.branch.start_config.year,
                angle_rate: 0
            },
            this
        );
        this.root.generateChildren({
            radius: this.genome.branch.start_config.radius
        });

        this.growModus = 0;


        //// Leaf emitter
        var leafFrames = [];
        for (var i = 0; i < this.leafs.num_different_leafs; i++) {
            leafFrames.push(i);
        }

        function add_emitter(genome) {
            var emitter = this.game.add.emitter(0, 0, genome.particles_max);
            emitter.makeParticles(this.genome.leaf.name, leafFrames);
            emitter.maxParticleScale = genome.scale_max;
            emitter.minParticleScale = genome.scale_min;
            emitter.setYSpeed(genome.y_speed_min, genome.y_speed_max);
            emitter.setXSpeed(genome.x_speed_min, genome.x_speed_max);
            emitter.setAlpha(genome.alpha_min, genome.alpha_max, genome.alpha_rate);
            emitter.gravity = genome.gravity;
            emitter.minRotation = genome.rotation_min;
            emitter.maxRotation = genome.rotation_max;
            emitter.angularDrag = genome.angular_drag;
            return emitter;
        }
        this.leafEmitter = add_emitter.call(this, this.genome.leaf.emitter);
        this.leafWindEmitter = add_emitter.call(this, this.genome.leaf.wind_emitter);
        this.leafWindEmitter.height = game.world.height/2;
        this.leafWindEmitter.emitX = game.world.width/2;
        this.leafWindEmitter.emitY = game.world.height/2;

        this.leafWindEmitter.start(
            this.genome.leaf.wind_emitter.start_explode, 
            this.genome.leaf.wind_emitter.start_lifespan, 
            this.genome.leaf.wind_emitter.start_frequency);

        // Initial draw call
        this.draw();
    }


    Tree.prototype = Object.create(Phaser.Group.prototype);
    Tree.prototype.constructor = Tree;

    ////
    // Public methods
    ////
    Tree.prototype.grow = function (dimish) {
        this.root.grow(dimish);
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

            graphics.lineStyle(current.config.strength, this.genome.trunk_color, 1);
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
        graphics.beginFill(this.genome.trunk_color, 1);
        graphics.moveTo(this.root.line.start.x, this.root.line.start.y);
        this.traverseBranches(function(branch){
            graphics.drawCircle(
                branch.line.end.x,
                branch.line.end.y,
                branch.config.strength * this.genome.trunk_joint_size);
        }, this);
        graphics.endFill();

        // draw leaves
        this.leafDensity.clear();
        this.leafsImage.tex.clear();
        this.traverseBranches(function(branch) {
            branch.leafs.forEach(function(leaf) {
                leaf.draw(this.leafs, this.leafsImage);

                // update leafDensity
                this.leafDensity.add(branch.line.end.x + leaf.x, branch.line.end.y + leaf.y);
            }, this);
        }, this);

        // update wind leave emitter
        this.leafWindEmitter.height = this._treeHeight * this.genome.leaf.wind_emitter.tree_relative_height;
        this.leafWindEmitter.emitY = (game.world.height - this._treeHeight * this.genome.leaf.wind_emitter.tree_relative_emit_y);

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