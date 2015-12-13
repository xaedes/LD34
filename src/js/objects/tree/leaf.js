'use strict';

define([], function() {
    function Leaf(branch, x, y, idx) {
        this.branch = branch;
        this.x = x;
        this.y = y;
        this.idx = idx;
        this.age = 0;

        this.killed = false;
    }
    Leaf.prototype.constructor = Leaf;

    Leaf.prototype.draw = function (leafs) {
        leafs.leaf.frame = this.idx % leafs.num_frames;
        leafs.drawingTexture.renderRawXY(
            leafs.leaf,
            this.branch.line.end.x + this.x,
            this.branch.line.end.y + this.y);
    };

    Leaf.prototype.update = function () {
        this.age++;

        if (this.age >= this.branch.game.rnd.integerInRange(0, 3)) {
         //   this.killed = true;
        }
    };

    return Leaf;
});
