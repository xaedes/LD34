'use strict';

define(['phaser'], function(Phaser) {

    function TreeEvaluator(tree) {
        this.tree = tree;
    }

    TreeEvaluator.prototype.constructor = TreeEvaluator;

    TreeEvaluator.prototype.leafsInLowerHalf = function(size,condition) {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var h_lower = Math.ceil(h*size);
        var h_upper = h-h_lower;
        var sum_upper = this.tree.leafDensity.getAreaSummedLocal(0,0,w,h_upper);
        var sum_lower = this.tree.leafDensity.getAreaSummedLocal(0,h_upper,w,h-h_upper);

        var success = ((sum_upper < condition.sum_upper) && (sum_lower > condition.sum_lower));
        return {
            success: success,
            sum_upper: sum_upper,
            sum_lower: sum_lower
        };
    };
    TreeEvaluator.prototype.leafsInUpperHalf = function(size,condition) {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var h_upper = Math.ceil(h*size);
        var sum_upper = this.tree.leafDensity.getAreaSummedLocal(0,0,w,h_upper);
        var sum_lower = this.tree.leafDensity.getAreaSummedLocal(0,h_upper,w,h-h_upper);

        var success = ((sum_lower < condition.sum_lower) && (sum_upper > condition.sum_upper));
        return {
            success: success,
            sum_lower: sum_lower,
            sum_upper: sum_upper
        };
    };
    TreeEvaluator.prototype.leafsHoleInTheMiddle = function(size,condition) {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var w2 = Math.ceil(w/2);
        var h2 = Math.ceil(h/2);
        var w2_hole = Math.ceil(w*size/2);
        var h2_hole = Math.ceil(h*size/2);
        var sum_middle = this.tree.leafDensity.getAreaSummedLocal(w2-w2_hole,h2-h2_hole,2*w2_hole,2*h2_hole);
        var sum = this.tree.leafDensity.sum;

        var success = ((sum > condition.sum) && (sum_middle < condition.sum_middle));
        return {
            success: success,
            sum: sum,
            sum_middle: sum_middle
        };
    };

    return TreeEvaluator;
});