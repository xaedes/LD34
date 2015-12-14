'use strict';

define(['phaser', 'helper', 'objects/tree_evaluator', 'quests/quest'], 
    function(Phaser,Helper,TreeEvaluator,Quest) {

    function MasterOfZero(game, treeEvaluator, tier) {
        Quest.call(this, game, treeEvaluator, tier);
        this.title = "Master Of Zero";
        this.secondsToWin = 10;
        this.max_tier = 100;
        this.difficulty = this.tier/this.max_tier;
        this.size = 1-0.9*this.difficulty;
        this.condition = {
            sum: 5,
            sum_middle: Helper.lerp(1,0,this.difficulty)
        };
        this.description = "Grow a tree, with leafs but leaf a hole in the middle.";
        this.description += "\n" + this.condition.sum + ";" + this.condition.sum_middle;
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "I am amazed by your lately growth. I shall now call you Master Of Zero.";
    }
    MasterOfZero.prototype = Object.create(Quest.prototype);
    MasterOfZero.prototype.constructor = MasterOfZero;
    MasterOfZero.prototype.evaluate = function() {
        this.success = this.treeEvaluator.leafsHoleInTheMiddle(this.size,this.condition);
        return this.success;
    };

    return MasterOfZero;
});