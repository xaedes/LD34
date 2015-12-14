'use strict';

define(['phaser', 'helper', 'objects/tree_evaluator', 'quests/quest'], 
    function(Phaser,Helper,TreeEvaluator,Quest) {

    function MasterOfZero(game, treeEvaluator, tier) {
        Quest.call(this, game, treeEvaluator, tier);
        this.title = tier+".Master Of Zero";
        this.secondsToWin = 10;
        this.max_tier = 100;
        this.difficulty = this.tier/this.max_tier;
        this.size = 0.5*this.difficulty;
        this.condition = {
            sum: Helper.lerp(15,20,this.difficulty),
            sum_middle: Helper.lerp(10,0,this.difficulty)
        };
        this.description = "Grow a tree, with leafs but leaf a hole in the middle.";
        this.description += "\nYou can have at most " + Math.floor(this.condition.sum_middle) + " leaves in the middle";
        this.description += "\nYou need at least " + Math.ceil(this.condition.sum) + " leaves on the tree.";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "I am amazed by your lately growth. I shall now call you Master Of Zero.";
    }
    MasterOfZero.prototype = Object.create(Quest.prototype);
    MasterOfZero.prototype.constructor = MasterOfZero;
    MasterOfZero.prototype.evaluate = function() {
        this.evaluation = this.treeEvaluator.leafsHoleInTheMiddle(this.size,this.condition);
        return this.evaluation.success;
    };
    MasterOfZero.prototype.progressMsg = function() {
        var msg = "";
        msg += Math.ceil(this.evaluation.sum_middle) + " / " + Math.ceil(this.condition.sum_middle) + " in the middle\n";
        msg += Math.floor(this.evaluation.sum) + " / " + Math.floor(this.condition.sum) + " on the tree";
        return msg;
    };
    return MasterOfZero;
});