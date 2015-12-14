'use strict';

define(['phaser', 'helper', 'objects/tree_evaluator', 'quests/quest'], 
    function(Phaser,Helper,TreeEvaluator,Quest) {

    function MasterOfEarth(game, treeEvaluator, tier) {
        Quest.call(this, game, treeEvaluator, tier);
        this.title = tier+".Master Of Earth";
        this.secondsToWin = 10;
        this.max_tier = 100;
        this.difficulty = this.tier/this.max_tier;
        this.size = 1-0.9*this.difficulty;
        this.condition = {
            sum_upper: Helper.lerp(1,4,this.difficulty),
            sum_lower: Helper.lerp(1,20,this.difficulty)
        };
        this.description = "Grow a tree, with only the lower part of the screen filled with leafs.";
        this.description += "\nYou can have at most " + Math.floor(this.condition.sum_upper) + " leaves in the upper part";
        this.description += "\nYou need at least " + Math.ceil(this.condition.sum_lower) + " leaves in the lower part";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "You did well. I shall now call you Master Of Earth.";
    }
    MasterOfEarth.prototype = Object.create(Quest.prototype);
    MasterOfEarth.prototype.constructor = MasterOfEarth;
    MasterOfEarth.prototype.evaluate = function() {
        this.evaluation = this.treeEvaluator.leafsInLowerHalf(this.size,this.condition);
        this.success = this.evaluation.success;
        return this.success;
    };
    MasterOfEarth.prototype.progressMsg = function() {
        var msg = "";
        msg += Math.floor(this.evaluation.sum_upper) + " / " + Math.floor(this.condition.sum_upper) + " in upper part\n";
        msg += Math.ceil(this.evaluation.sum_lower) + " / " + Math.ceil(this.condition.sum_lower) + " in lower part";
        return msg;
    };

    return MasterOfEarth;
});

