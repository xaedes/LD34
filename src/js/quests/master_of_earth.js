'use strict';

define(['phaser', 'objects/tree_evaluator', 'quests/quest'], function(Phaser,TreeEvaluator,Quest) {
    function MasterOfEarth(game, treeEvaluator) {
        Quest.call(this, game, treeEvaluator);
        this.title = "Master Of Earth";
        this.secondsToWin = 10;
        this.description = "Grow a tree, with only the lower half of the screen filled with leafs.";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "You did well. I shall now call you Master Of Earth.";
    }
    MasterOfEarth.prototype = Object.create(Quest.prototype);
    MasterOfEarth.prototype.constructor = MasterOfEarth;
    MasterOfEarth.prototype.evaluate = function() {
        this.success = this.treeEvaluator.leafsInLowerHalf();
        return this.success;
    };
    return MasterOfEarth;
});

