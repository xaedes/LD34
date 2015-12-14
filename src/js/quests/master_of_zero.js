'use strict';

define(['phaser', 'objects/tree_evaluator', 'quests/quest'], function(Phaser,TreeEvaluator,Quest) {
    function MasterOfZero(game, treeEvaluator) {
        Quest.call(this, game, treeEvaluator);
        this.title = "Master Of Zero";
        this.secondsToWin = 10;
        this.description = "Grow a tree, with leafs but leaf a hole in the middle.";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "I am amazed by your lately growth. I shall now call you Master Of Zero.";
    }
    MasterOfZero.prototype = Object.create(Quest.prototype);
    MasterOfZero.prototype.constructor = MasterOfZero;
    MasterOfZero.prototype.evaluate = function() {
        this.success = this.treeEvaluator.leafsHoleInTheMiddle();
        return this.success;
    };
    return MasterOfZero;
});