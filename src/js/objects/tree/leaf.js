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
        leafs.setFrame(this.idx % leafs.num_frames, this.numLeaves);
        leafsImage.tex.renderRawXY(
            leafs.sprite,
            this.branch.line.end.x + this.x,
            this.branch.line.end.y + this.y);
    };

    Leaf.prototype.update = function (dimish) {
        this.age+=dimish;

        if (this.age >= this.branch.game.rnd.integerInRange(1000, 3000)) {
            this.killed = true;
        }
    };

    return Leaf;
});
