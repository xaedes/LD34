'use strict';

define(['phaser', 'helper'], function(Phaser, Helper) {
    function LeafSprites(game) {
        this.game = game;

        var width = 32;
        var height = 32;
        var n = 100;

        var graphics = this.game.add.graphics(0,0);
        var bm = this.game.add.bitmapData(width * 10, height * 10);

        this.colormap = Helper.BitmapDataFromImage(this.game, "colormap");

        var atlasData = { frames: [] };
        for(var i=0;i<n;++i){
            var leaf = this.generateLeaf(width, height, 0.25);
            var color = this.pickColor();
            var x = Math.floor(i/10)*width;
            var y = (i%10)*height;
            
            graphics.clear()
            graphics.lineStyle(0, color, 1);
            graphics.beginFill(0, 1);
            // leaf = new Phaser.Polygon([ new Phaser.Point(20, 0), new Phaser.Point(31, 10), new Phaser.Point(31, 20), new Phaser.Point(15, 20) ]);
            graphics.drawRect(0,0,width,height);
            graphics.beginFill(color, 1);
            graphics.drawPolygon(leaf);
            // graphics.drawCircle(10,10,16);
            graphics.endFill();
            graphics.update();

            var tex = graphics.generateTexture();
            var img = new Phaser.Image(this.game,0,0,tex);

            bm.copy(img, 0, 0, width, height, x, y);

            atlasData.frames.push({ frame: { x: x, y: y, w: width, h: height }});
        }
        bm.update();
        var texture = bm.generateTexture();
        // call super constructor with our generated Texture
        Phaser.Image.call(this, game, 0, 0, texture);

        graphics.destroy();
    }

    LeafSprites.prototype = Object.create(Phaser.Image.prototype);

    LeafSprites.prototype.pickColor = function (width,height) {
        var x = this.game.rnd.integerInRange(0, this.colormap.width);
        var y = this.game.rnd.integerInRange(0, this.colormap.height);
        var color = this.colormap.getPixel32(x,y);
        return color;
    };

    LeafSprites.prototype.generateLeaf = function (width,height,minArea) {
        var leaf = null;
        do {
            // generate polygon for leaf
            var x1 = this.game.rnd.integerInRange(0,width/2);
            var y1 = this.game.rnd.integerInRange(0,height/2);

            var x2 = this.game.rnd.integerInRange(0,width/2);
            var y2 = this.game.rnd.integerInRange(height/2,height);

            var x3 = this.game.rnd.integerInRange(width/2,width);
            var y3 = this.game.rnd.integerInRange(0,height);

            // return new Phaser.Polygon([ new Phaser.Point(x1,y1), new Phaser.Point(x2,y2), new Phaser.Point(x3,y3) ]);

            leaf = new Phaser.Polygon([x1,y1,x2,y2,x3,y3]);
        } while(Math.abs(leaf.area) < minArea * width * height);
        return leaf;
    };

    return LeafSprites;
});