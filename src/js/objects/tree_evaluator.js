'use strict';

define(['phaser'], function(Phaser) {

    function TreeEvaluator(tree) {
        this.tree = tree;
    }

    TreeEvaluator.prototype.constructor = TreeEvaluator;

    TreeEvaluator.prototype.leafsInLowerHalf = function() {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var h2 = Math.ceil(h/2);
        var sum_upper = this.tree.leafDensity.getAreaSummedLocal(0,0,w,h2);
        var sum_lower = this.tree.leafDensity.getAreaSummedLocal(0,h2,w,h2);

        var success = ((sum_upper < 5) && (sum_lower > 1));
        return success;
    };
    TreeEvaluator.prototype.leafsInUpperHalf = function() {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var h2 = Math.ceil(h/2);
        var sum_upper = this.tree.leafDensity.getAreaSummedLocal(0,0,w,h2);
        var sum_lower = this.tree.leafDensity.getAreaSummedLocal(0,h2,w,h2);

        var success = ((sum_lower < 5) && (sum_upper > 15));
        return success;
    };
    TreeEvaluator.prototype.leafsHoleInTheMiddle = function() {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var w4 = Math.ceil(w/4);
        var h4 = Math.ceil(h/4);
        var sum_middle = this.tree.leafDensity.getAreaSummedLocal(w4,h4,w-w4,h-h4);
        var sum = this.tree.leafDensity.sum;
        var condition = {
            sum: 5,
            sum_middle: 1
        };
        var success = ((sum > condition.sum) && (sum_middle < condition.sum_middle));
        return success;
    };

    return TreeEvaluator;
});