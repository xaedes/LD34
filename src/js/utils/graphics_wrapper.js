'use strict';

define(['phaser'], function(Phaser) {
    function GraphicsWrapper(game, x, y, parent) {

        if (parent === undefined) {
            parent = game.world;
        }

        this.group = game.add.group(parent);

        this.game = game;
        this.x = x;
        this.y = y;

        this.graphics = [];
        this.graphicsStack = [];
    }

    //GraphicsWrapper.prototype = Object.create(Phaser.Group.prototype);
    //GraphicsWrapper.prototype.constructor = GraphicsWrapper;

    GraphicsWrapper.prototype.clear = function () {
        this.graphics.forEach( function(g) {
            g.clear();
        });

        while (this.graphics.length) {
            var g = this.graphics.pop();
            this.graphicsStack.push(g);
        }
    };

    GraphicsWrapper.prototype.moveTo = function (x, y) {
        if (y === undefined) {
            this._getLast().moveTo(x.x, x.y);
        } else {
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

    ////
    // Private methods
    ////
    GraphicsWrapper.prototype._getLast = function () {
        if (this.graphics.length == 0 || this.graphics[this.graphics.length-1].graphicsData.length >= 800) {
            var newG = this.graphicsStack.pop();
            if (newG) {
                this.graphics.push(newG)
            } else {
                newG = new Phaser.Graphics(this.game, this.x, this.y);
                this.group.add(newG);

                this.graphics.push(newG)
            }

            return newG;
        }

        return this.graphics[this.graphics.length-1];
    };

    return GraphicsWrapper;
});