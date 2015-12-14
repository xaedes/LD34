'use strict';

define(['phaser', 'helper'], function (Phaser, Helper) {
    function LeafSprites(game, tree) {
        this.game = game;
        this.tree = tree;
        this.genome = this.tree.genome.leaf;
        // used to generate leaf points
        this.leaf_width = this.genome.width;
        this.leaf_height = this.genome.height;

        // as we want to draw more than one leaf per frame, we need a little bit more space
        // specify here how much
        this.padding = this.genome.padding;

        // size of actual drawing area 
        this.frame_width = this.leaf_width + this.padding * 2;
        this.frame_height = this.leaf_height + this.padding * 2;

        // factors to multiply normal(0,1) random variable with to get properly scaled random leaf displacement
        this.leaf_displacement_x = this.leaf_width * this.genome.displacement_x;
        this.leaf_displacement_y = this.leaf_height * this.genome.displacement_y;

        // how many leafs per frame?
        this.leafs_per_frame = this.genome.leafs_per_frame;

        this.leaf_alpha = this.genome.alpha;

        // how many frames
        this.num_frames = this.genome.num_frames;

        // this holds our frames
        var bm = this.game.add.bitmapData(this.frame_width * this.leafs_per_frame, this.frame_height * this.num_frames);

        // this is used to draw one frame
        var graphics = this.game.add.graphics(0, 0);

        // load colormap for color picking
        this.colormap = Helper.BitmapDataFromImage(this.game, this.genome.colormap);

        // prepare frame data
        var atlasData = {frames: []};

        // generate multiple leaf spriteframes for later drawing
        for (var frame_idx = 0; frame_idx < this.num_frames; ++frame_idx) {

            // clear graphics
            graphics.clear();

            // fill frame with black
            graphics.lineStyle(0, 0, 1);
            graphics.beginFill(0, 0);
            graphics.drawRect(0, 0, this.frame_width, this.frame_height);

            // generate a bunch of leaves
            for(var k = 0; k < this.leafs_per_frame; ++k) {
                var rx = Helper.randomNormal(0, 1) * this.leaf_displacement_x;
                var ry = Helper.randomNormal(0, 1) * this.leaf_displacement_y;

                var leaf = this.generateLeaf(this.leaf_width, this.leaf_height, 0.25, this.padding + rx, this.padding + ry);

                var color = this.pickColor();

                graphics.beginFill(color, this.leaf_alpha);
                graphics.drawPolygon(leaf);
                graphics.endFill();

                // flush operations
                graphics.update();

                // generate image from last drawn frame
                var tex = graphics.generateTexture();
                var img = new Phaser.Image(this.game, 0, 0, tex);

                // copy frame into bitmapdata buffer
                var x = k * this.frame_width;
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
        this.game.cache.addTextureAtlas(this.genome.name, '', bm.canvas, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        
        // create Sprite with generated spritesheet
        this.leaf = new Phaser.Sprite(game, 0, 0, this.genome.name);
        this.leaf.anchor.set(0.5);

        // should be kept here for reference
        // inspired from 
        // http://laxvikinggames.blogspot.de/2015/01/build-dynamic-texture-atlas-in-phaser.html
    }

    LeafSprites.prototype.constructor = LeafSprites;

    LeafSprites.prototype.pickColor = function () {
        // pick a color from a random pixel in colormap
        var x = this.game.rnd.integerInRange(0, this.colormap.width);
        var y = this.game.rnd.integerInRange(0, this.colormap.height);
        var color = this.colormap.getPixelRGB(x, y);

        // swap byte order
        color = color.r * 0x010000 + color.g * 0x000100 + color.b * 0x000001; // + color.a;

        return color;
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