'use strict';

define(['phaser', 'helper', 'objects/tree_evaluator', 'quests/quest'], 
    function(Phaser,Helper,TreeEvaluator,Quest) {
        
    function MasterOfSky(game, gui, treeEvaluator, tier) {
        Quest.call(this, game, gui, treeEvaluator, tier);
        this.title = tier+".Master Of Sky";
        this.secondsToWin = 10;
        this.max_tier = 100;
        this.difficulty = this.tier/this.max_tier;
        this.size = 1-0.9*this.difficulty;
        this.condition = {
            sum_lower: Helper.lerp(15,20,this.difficulty),
            sum_upper: Helper.lerp(15,20,this.difficulty)
        };
        this.description = "Grow a tree, with only the upper half of the screen filled with leafs.";
        this.description += "\nYou can have at most " + Math.floor(this.condition.sum_upper) + " leaves in the lower part";
        this.description += "\nYou need at least " + Math.ceil(this.condition.sum_lower) + " leaves in the upper part";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "With your will to rise upwards you mastered the Sky. I shall now call you Master Of Sky.";
    }
    MasterOfSky.prototype = Object.create(Quest.prototype);
    MasterOfSky.prototype.constructor = MasterOfSky;
    MasterOfSky.prototype.evaluate = function() {
        this.evaluation = this.treeEvaluator.leafsInUpperHalf(this.size,this.condition);
        this.success = this.evaluation.success;
        return this.evaluation.success;
    };
    MasterOfSky.prototype.progressMsg = function() {
        var msg = "";
        msg += Math.ceil(this.evaluation.sum_lower) + " / " + Math.ceil(this.condition.sum_lower) + " in lower part\n";
        msg += Math.floor(this.evaluation.sum_upper) + " / " + Math.floor(this.condition.sum_upper) + " in upper part";
        return msg;
    };
    return MasterOfSky;
});