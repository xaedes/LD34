'use strict';

define(['phaser'], function(Phaser) {
    function GraphicsWrapper(game, x, y, parent) {

        if (parent === undefined) {
            parent = game.world;
        }

        this.game = game;

        this.group = game.add.group(parent);
        this.drawingTexture = this.game.add.renderTexture(this.game.width, this.game.height);
        this.image = this.game.add.image(game, 0, 0, this.drawingTexture);
        this._x = x;
        this._y = y;

        this._movePosition = new Phaser.Point(0, 0);

        this.graphics = [];
        this.unused = [];
    }

    GraphicsWrapper.prototype.flush = function () {
        // flush operations
        this.group.update();

        // generate image from last drawn frame
        var tex = this.group.generateTexture();
        var img = new Phaser.Image(this.game, 0, 0, tex);
        // and copy it into our drawingTexture
        this.drawingTexture.renderRawXY(img,0,0);

        // now remove all graphics
        while(this.graphics.length>0){
            var g = this.graphics.pop();
            g.clear();
            this.unused.push(g);
        }
    };
    GraphicsWrapper.prototype.clear = function () {
        this.drawingTexture.clear();
        while(this.graphics.length) {
            var g = this.graphics.pop();
            g.clear();
            this.unused.push(g);
        }
    };

    GraphicsWrapper.prototype.moveTo = function (x, y) {
        if (y === undefined) {
            this._movePosition = x;
            this._getLast().moveTo(x.x, x.y);
        } else {
            this._movePosition.set(x, y);
            this._getLast().moveTo(x, y);
        }
    };

    GraphicsWrapper.prototype.lineTo = function (x, y) {
        if (y === undefined) {
            this._getLast().lineTo(x.x, x.y);
        } else {
            this._getLast().lineTo(x, y);
        }
    };

    GraphicsWrapper.prototype.drawCircle = function (x, y, radius, fillStyle) {
        this._getLast().drawCircle(x, y, radius, fillStyle);
    };

    GraphicsWrapper.prototype.lineStyle = function (lineWidth, color, alpha) {
        this.graphics.forEach( function(g) {
            g.lineStyle(lineWidth, color, alpha);
        });
    };

    GraphicsWrapper.prototype.beginFill = function (color, alpha) {
        this._getLast(false).beginFill(color, alpha)
    };

    GraphicsWrapper.prototype.endFill = function () {
        this._getLast(true).endFill()
    };

    ////
    // Private methods
    ////
    GraphicsWrapper.prototype._getLast = function (skipBoundCheck) {
        var last = this.graphics[this.graphics.length-1];

        if (skipBoundCheck) {
            return last;
        }

        if (this.graphics.length == 0 || last.graphicsData.length >= 500) {
            // this.flush();
            var newG;
            if (this.unused.length) {
                newG = this.unused.pop();
            } else {
                newG = new Phaser.Graphics(this.game, this._x, this._y);
            }
            if (last) { // inherit style from last graphics object
                newG.lineStyle(last.lineWidth, last.color, last.alpha);
                newG.moveTo(this._movePosition.x, this._movePosition.y);
                if (last.filling) {
                    newG.beginFill(last.fillColor, last.fillAlpha);
                }
            }
            this.group.add(newG);
            this.graphics.push(newG);


            return newG;
        }

        return last;
    };

    ////
    // Properties
    ////
    Object.defineProperty(GraphicsWrapper.prototype, "lineWidth", {
        get: function () {
            var last = this._getLast(true);
            if(last){
                return last.lineWidth;
            } else {
                return undefined;
            }
        },
        set: function (value) {
            var last = this._getLast(true);
            if(last){
                last.lineWidth = value;
            }
        }
    });

    return GraphicsWrapper;
});