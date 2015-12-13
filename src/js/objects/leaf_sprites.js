'use strict';

define(['phaser', 'helper'], function (Phaser, Helper) {
    function LeafSprites(game, tree) {
        this.game = game;
        this.tree = tree;

        // used to generate leaf points
        this.leaf_width = 16;
        this.leaf_height = 16;

        // as we want to draw more than one leaf per frame, we need a little bit more space
        // specify here how much
        this.padding = 32;

        // size of actual drawing area 
        this.frame_width = this.leaf_width + this.padding * 2;
        this.frame_height = this.leaf_height + this.padding * 2;

        // factors to multiply normal(0,1) random variable with to get properly scaled random leaf displacement
        this.leaf_displacement_x = this.leaf_width * 0.6;
        this.leaf_displacement_y = this.leaf_height * 0.6;

        // how many leafs per frame?
        this.leafs_per_frame_min = 6;
        this.leafs_per_frame_max = 12;

        // rustling leaves animation paramaters
        this.anim_len = 10;
        this.rustling = 10;
        this.color_rustling = 2;

        this.leaf_alpha = 0.3;

        // how many frames
        this.num_frames = 100;

        // this holds our frames
        var bm = this.game.add.bitmapData(this.frame_width, this.frame_height * this.num_frames);

        // this is used to draw one frame
        var graphics = this.game.add.graphics(0, 0);

        // load colormap for color picking
        this.colormap = Helper.BitmapDataFromImage(this.game, "colormap_green");

        // prepare frame data
        var atlasData = {frames: []};

        // generate multiple leaf spriteframes for later drawing
        for (var frame_idx = 0; frame_idx < this.num_frames; ++frame_idx) {
            // generate a bunch of leaves
            var leaves = [];
            var leafs_per_frame = this.game.rnd.integerInRange(this.leafs_per_frame_min,this.leafs_per_frame_max);
            for(var k = 0; k < leafs_per_frame; ++k) {
                var rx = Helper.randomNormal(0, 1) * this.leaf_displacement_x;
                var ry = Helper.randomNormal(0, 1) * this.leaf_displacement_y;

                var leaf = this.generateLeaf(this.leaf_width, this.leaf_height, 0.25, this.padding + rx, this.padding + ry);
                leaves.push(leaf);

                var color = this.pickColor();

                graphics.beginFill(color, 0.6);
                graphics.drawPolygon(leaf);
                graphics.endFill();
                graphics.update();
            }

            // draw each animation frame for rustling leaves
            for(var anim_idx = 0; anim_idx < this.anim_len; ++anim_idx) {

                // clear graphics
                graphics.clear();

                // fill frame with black
                graphics.lineStyle(0, color, 1);
                graphics.beginFill(0, 0);
                graphics.drawRect(0, 0, this.frame_width, this.frame_height);

                // draw a bunch of leafs to the frame
                for(var k = 0; k < leaves.length; ++k) {
                    var leaf,color;
                    if (anim_idx == 0) {
                        leaf = leaves[k].leaf;
                        color = leaves[k].color;
                    } else {
                        // rustle leaf
                        leaf = this.rustleLeaf(leaves[k].leaf);
                        color = this.pickColor(
                            leaves[k].cx+Helper.randomNormal(this.game.rnd,0,this.color_rustling),
                            leaves[k].cy+Helper.randomNormal(this.game.rnd,0,this.color_rustling));
                    }

                    graphics.beginFill(color, this.leaf_alpha);
                    graphics.drawPolygon(leaf);
                    graphics.endFill();
                }

                // flush operations
                graphics.update();

                // generate image from last drawn frame
                var tex = graphics.generateTexture();
                var img = new Phaser.Image(this.game, 0, 0, tex);

                // copy frame into bitmapdata buffer
                var x = anim_idx * this.frame_width;
                var y = frame_idx * this.frame_height;
                bm.copy(img, 0, 0, this.frame_width, this.frame_height, x, y);

                // save data for this frame in atlas
                atlasData.frames.push({frame: {x: x, y: y, w: this.frame_width, h: this.frame_height}});
            }
        }

        // flush operations (i don't think this is necessary)
        bm.update();
        graphics.destroy();

        // publish generated spritesheet (image data from bm.canvas, frame information from atlasData)
        this.game.cache.addTextureAtlas("leafs", '', bm.canvas, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        
        // create Sprite with generated spritesheet
        this.leaf = new Phaser.Sprite(game, 0, 0, "leafs");
        this.leaf.anchor.set(0.5);
        // add animation for each frame 
        var frames;
        for (var frame_idx = 0; frame_idx < this.num_frames; ++frame_idx) {
            frames = Phaser.ArrayUtils.numberArray(frame_idx*this.anim_len,(1+frame_idx)*this.anim_len-1);
            this.leaf.animations.add("rustling-"+frame_idx, frames, 60, true);
        }

        // should be kept here for reference
        // inspired from 
        // http://laxvikinggames.blogspot.de/2015/01/build-dynamic-texture-atlas-in-phaser.html


        // generate texture that fills complete screen, that we draw to
        this.drawingTexture = this.game.add.renderTexture(this.game.width * this.anim_len, this.game.height);

        frames = Phaser.ArrayUtils.numberArray(0,this.anim_len-1);
        atlasData = {frames: []};
        frames.forEach(function(anim_idx){
            atlasData.frames.push({frame: {x: anim_idx * this.game.width, y: 0, w: this.game.width, h: this.game.height}});
        },this);
        // publish generated spritesheet (image data from bm.canvas, frame information from atlasData)
        // this.game.cache.addTextureAtlas("leafs-complete", '', this.drawingTexture, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        // call super constructor with our generated Texture
        Phaser.Sprite.call(this, game, 0, 0, this.drawingTexture);
        this.animations.loadFrameData(atlasData)
        this.animations.add("rustling",null,10,true);
        // this.animations.play("rustling");
        this.frame = 0;
    }

    LeafSprites.prototype = Object.create(Phaser.Sprite.prototype);

    LeafSprites.prototype.pickColor = function () {
        // pick a color from a random pixel in colormap
        var x = this.game.rnd.integerInRange(0, this.colormap.width);
        var y = this.game.rnd.integerInRange(0, this.colormap.height);
        var color = this.colormap.getPixelRGB(x, y);

        color = color.r * 0x010000 + color.g * 0x000100 + color.b * 0x000001; // + color.a;

        return color;
    };

    LeafSprites.prototype.rustleLeaf = function (leaf) {
        var newPoints=[];
        leaf.points.forEach(function(point){
            var newPoint = {
                x: point.x + Helper.randomNormal(this.game.rnd, 0, this.rustling),
                y: point.y + Helper.randomNormal(this.game.rnd, 0, this.rustling)
            };
            newPoints.push(newPoint);
        },this);
        return new Phaser.Polygon(newPoints);
    };


    LeafSprites.prototype.generateLeaf = function (width, height, minArea, x, y) {
        var leaf = null;
        do {
            // generate polygon for leaf

            // divide rect width*height into four quadrants:
            // +--+--+
            // |Q2|Q1|
            // +--+--+
            // |Q3|Q4|
            // +--+--+
            
            // picked from Q2
            var x1 = this.game.rnd.integerInRange(0, width / 2);
            var y1 = this.game.rnd.integerInRange(0, height / 2);

            // picked from Q3
            var x2 = this.game.rnd.integerInRange(0, width / 2);
            var y2 = this.game.rnd.integerInRange(height / 2, height);

            // picked from Q1 & Q4
            var x3 = this.game.rnd.integerInRange(width / 2, width);
            var y3 = this.game.rnd.integerInRange(0, height);

            // polygon translated by x,y
            leaf = new Phaser.Polygon([x1+x, y1+y, x2+x, y2+y, x3+x, y3+y]);

            // we don't want tiny leafs, so repeat until we find a good one
            // the expected area is 0.25 * width * height
        } while (Math.abs(leaf.area) < minArea * width * height);
        return leaf;
    };

    return LeafSprites;
});