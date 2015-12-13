'use strict';

define([], function() {
    function Leaf(x,y,frame_idx,anim_idx) {
        this.x = x;
        this.y = y;
        this.frame_idx = frame_idx;
        this.anim_idx = anim_idx;
    }
    Leaf.prototype.constructor = Leaf;

    return Leaf;
});
