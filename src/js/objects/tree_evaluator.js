'use strict';

define(['phaser'], function(Phaser) {

    function TreeEvaluator(game) {
        this.game = game;
    }

    TreeEvaluator.prototype.constructor = TreeEvaluator;

    TreeEvaluator.prototype.leafsInUpperHalf = function(tree) {
        var w = tree.leafDensity.width;
        var h = tree.leafDensity.height;
        var h2 = Math.ceil(h/2);
        var sum_upper = tree.leafDensity.getAreaSummedLocal(0,0,w,h2);
        var sum_lower = tree.leafDensity.getAreaSummedLocal(0,h2,w,h2);

        return ((sum_lower < 5) && (sum_upper > 15));
    };

    return TreeEvaluator;
});