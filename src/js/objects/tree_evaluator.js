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

        var success = ((sum_upper < 5) && (sum_lower > 15));
        return {
            success: success,
            quest_title: "Master of Earth",
            quest_msg: "Grow a tree, with only the lower half of the screen filled with leafs.",
            success_msg: "Congratulations."
        };
    };
    TreeEvaluator.prototype.leafsInUpperHalf = function() {
        var w = this.tree.leafDensity.width;
        var h = this.tree.leafDensity.height;
        var h2 = Math.ceil(h/2);
        var sum_upper = this.tree.leafDensity.getAreaSummedLocal(0,0,w,h2);
        var sum_lower = this.tree.leafDensity.getAreaSummedLocal(0,h2,w,h2);

        var success = ((sum_lower < 5) && (sum_upper > 15));
        return {
            success: success,
            quest_title: "Master of Sky",
            quest_msg: "Grow a tree, with only the upper half of the screen filled with leafs.",
            success_msg: "Congratulations."
        };
    };

    return TreeEvaluator;
});