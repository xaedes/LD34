'use strict';

define(['phaser', 'helper'], function (Phaser, Helper) {
    function LeafSprites(game, tree) {
        this.game = game;
        this.tree = tree;
        
        var width = 32;
        var height = 32;
        this.num_different_leafs = 100;

        var graphics = this.game.add.graphics(0, 0);
        var bm = this.game.add.bitmapData(width, height * this.num_different_leafs);

        this.colormap = Helper.BitmapDataFromImage(this.game, "colormap");

        var atlasData = {frames: []};
        for (var i = 0; i < this.num_different_leafs; ++i) {
            var leaf = this.generateLeaf(width, height, 0.25);
            var color = this.pickColor();
            // var x = Math.floor(i/10)*width;
            // var y = (i%10)*height;
            var x = 0;
            var y = i * height;

            graphics.clear();
            graphics.lineStyle(0, color, 1);

            graphics.beginFill(0, 0);
            graphics.drawRect(0, 0, width, height);

            graphics.beginFill(color, 0.6);
            graphics.drawPolygon(leaf);

            graphics.endFill();
            graphics.update();

            var tex = graphics.generateTexture();
            var img = new Phaser.Image(this.game, 0, 0, tex);

            bm.copy(img, 0, 0, width, height, x, y);

            atlasData.frames.push({frame: {x: x, y: y, w: width, h: height}});
        }
        bm.update();
        this.game.cache.addTextureAtlas("leafs", '', bm.canvas, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        graphics.destroy();

        // inspired from 
        // http://laxvikinggames.blogspot.de/2015/01/build-dynamic-texture-atlas-in-phaser.html

        // var texture = bm.generateTexture();
        // call super constructor with our generated Texture
        this.target_tex = this.game.add.renderTexture(this.game.width, this.game.height);
        Phaser.Image.call(this, game, 0, 0, this.target_tex);

        this.leaf = new Phaser.Sprite(game, 0, 0, "leafs");
        this.leaf.animations.add("animation", null, 60, true);
        // this.leaf.animations.play("animation");
    }

    LeafSprites.prototype = Object.create(Phaser.Image.prototype);


    LeafSprites.prototype.pickColor = function (width, height) {
        var x = this.game.rnd.integerInRange(0, this.colormap.width);
        var y = this.game.rnd.integerInRange(0, this.colormap.height);
        var color = this.colormap.getPixel32(x, y);
        return color;
    };

    LeafSprites.prototype.generateLeaf = function (width, height, minArea) {
        var leaf = null;
        do {
            // generate polygon for leaf
            var x1 = this.game.rnd.integerInRange(0, width / 2);
            var y1 = this.game.rnd.integerInRange(0, height / 2);

            var x2 = this.game.rnd.integerInRange(0, width / 2);
            var y2 = this.game.rnd.integerInRange(height / 2, height);

            var x3 = this.game.rnd.integerInRange(width / 2, width);
            var y3 = this.game.rnd.integerInRange(0, height);

            // return new Phaser.Polygon([ new Phaser.Point(x1,y1), new Phaser.Point(x2,y2), new Phaser.Point(x3,y3) ]);

            leaf = new Phaser.Polygon([x1, y1, x2, y2, x3, y3]);
        } while (Math.abs(leaf.area) < minArea * width * height);
        return leaf;
    };

    return LeafSprites;
});