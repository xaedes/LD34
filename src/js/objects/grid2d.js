'use strict';

define(['phaser'], function(Phaser) {
    function Grid2d(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;

        this.grid = new Array(width);
        for (var i = 0; i < width; i++) {
            this.grid[i] = new Array(height);
            for (var j = 0; j < height; j++) {
                this.grid[i][j] = 0;
            }
        }

        this.sum = 0;
    }
    Grid2d.prototype.constructor = Grid2d;

    Grid2d.prototype.clear = function (x, y) {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j] = 0;
            }
        }
        this.sum = 0;
    };

    Grid2d.prototype.add = function (x, y) {
        var pos = this._toLocal(x, y);
        this.grid[pos[0]][pos[1]]++;
        this.sum++;
    };

    Grid2d.prototype.addLine = function (line) {
        var start = this._toLocal(line.start.x, line.start.y );
        var end = this._toLocal(line.end.x, line.end.y);

        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var i,x,y;

        if (dx === 0 && dy === 0) {
            this.grid[start[0]][start[0]]++;
            this.sum++;
        } else if (Math.abs(dx) > Math.abs(dy)) {
            x = start[0];
            y = start[1];
            for(i=0; i <= Math.abs(dx); ++i) {
                this.grid[Math.round(x)][Math.round(y)]++;
                x += (dx / Math.abs(dx));
                y += (dy / Math.abs(dx));
            }
            this.sum += Math.abs(dx) + 1;
        } else {
            x = start[0];
            y = start[1];
            for(i=0; i <= Math.abs(dy); ++i) {
                this.grid[Math.round(x)][Math.round(y)]++;
                x += (dx / Math.abs(dy));
                y += (dy / Math.abs(dy));
            }
            this.sum += Math.abs(dy) + 1;
        }
    };

    Grid2d.prototype.get = function (x, y) {
        var pos = this._toLocal(x, y);
        return this.grid[pos[0]][pos[1]];
    };

    Grid2d.prototype.getLine = function (line) {
        var start = this._toLocal(line.start.x, line.start.y );
        var end = this._toLocal(line.end.x, line.end.y);

        var dx = end[0] - start[0];
        var dy = end[1] - start[1];

        var average = 0;
        var i,x,y;
        if (dx === 0 && dy === 0) {
            average = this.grid[start[0]][start[0]];
        } else if (Math.abs(dx) > Math.abs(dy)) {
            x = start[0];
            y = start[1];
            for(i=0; i <= Math.abs(dx); ++i) {
                average += this.grid[Math.round(x)][Math.round(y)];
                x += (dx / Math.abs(dx));
                y += (dy / Math.abs(dx));
            }
            average /= Math.abs(dx) + 1;
        } else {
            x = start[0];
            y = start[1];
            for(i=0; i <= Math.abs(dy); ++i) {
                average += this.grid[Math.round(x)][Math.round(y)];
                x += (dx / Math.abs(dy));
                y += (dy / Math.abs(dy));
            }
            average /= Math.abs(dy) + 1;
        }

        return average;
    };
    Grid2d.prototype.getAreaSummed = function (x,y,w,h) {
        var start = this._toLocal(x,y);
        var end = this._toLocal(x+w,y+h);
        return this.getAreaSummedLocal(start[0],start[1],end[0]-start[0],end[1]-start[1]);
    };
    Grid2d.prototype.getAreaSummedLocal = function (x,y,w,h) {
        var sum=0;
        for(var i=x;i<x+w;i++){
            for(var j=y;j<y+h;j++){
                if((i>=0)&&(i<this.width)&&(j>=0)&&(j<this.height)){
                    sum += this.grid[i][j];
                }
            }
        }
        return sum;
    };

    Grid2d.prototype._toLocal = function (x, y) {
        x = Math.floor((x * this.width) / this.game.width);
        y = Math.floor((y * this.height) / this.game.height);

        x = Math.min(Math.max(x, 0), this.width-1);
        y = Math.min(Math.max(y, 0), this.height-1);

        return [x, y];
    };

    return Grid2d;
});