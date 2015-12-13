'use strict';

define([], function() {
    function Leaf(x,y,idx) {
        this.x = x;
        this.y = y;
        this.idx = idx;
    }
    Leaf.prototype.constructor = Leaf;

    return Leaf;
});
