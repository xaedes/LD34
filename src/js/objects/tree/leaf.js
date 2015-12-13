'use strict';

define([], function() {
    function Leaf(branch, x, y, idx) {
        this.branch = branch;
        this.x = x;
        this.y = y;
        this.idx = idx;
    }
    Leaf.prototype.constructor = Leaf;

    Leaf.prototype.draw = function (leafs) {
        leafs.leaf.frame = this.idx % leafs.num_frames;
        leafs.drawingTexture.renderRawXY(
            leafs.leaf,
            this.branch.x + this.x * leafs.leaf_displacement_x,
            this.branch.y + this.y * leafs.leaf_displacement_y);
    };

    return Leaf;
});
