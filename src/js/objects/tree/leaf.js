'use strict';

define([], function() {
    function Leaf(branch, x, y, idx, numLeaves) {
        this.branch = branch;
        this.x = x;
        this.y = y;
        this.idx = idx;
        this.age = 0;
        this.numLeaves = numLeaves;

        this.killed = false;
    }

    Leaf.prototype.constructor = Leaf;

    Leaf.prototype.draw = function (leafs, leafsImage) {
        leafs.leaf.frame = (this.idx % leafs.num_frames) * leafs.leafs_per_frame + this.numLeaves - 1;
        leafsImage.tex.renderRawXY(
            leafs.leaf,
            this.branch.line.end.x + this.x,
            this.branch.line.end.y + this.y);
    };

    Leaf.prototype.update = function () {
        this.age++;

        if (this.age >= this.branch.game.rnd.integerInRange(100, 300)) {
            this.killed = true;
        }
    };

    return Leaf;
});
