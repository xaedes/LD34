'use strict';

define(['phaser', 'helper', 'objects/tree_evaluator', 'quests/quest'], 
    function(Phaser,Helper,TreeEvaluator,Quest) {
        
    function MasterOfSky(game, treeEvaluator, tier) {
        Quest.call(this, game, treeEvaluator, tier);
        this.title = "Master Of Sky";
        this.secondsToWin = 10;
        this.difficulty = this.tier/this.max_tier;
        this.size = 1-0.9*this.difficulty;
        this.condition = {
            sum_lower: Helper.lerp(15,20,this.difficulty),
            sum_upper: Helper.lerp(15,20,this.difficulty)
        };
        this.description = "Grow a tree, with only the upper half of the screen filled with leafs.";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "With your will to rise upwards you mastered the Sky. I shall now call you Master Of Sky.";
    }
    MasterOfSky.prototype = Object.create(Quest.prototype);
    MasterOfSky.prototype.constructor = MasterOfSky;
    MasterOfSky.prototype.evaluate = function() {
        this.success = this.treeEvaluator.leafsInUpperHalf(this.size,this.condition);
        return this.success;
    };
    return MasterOfSky;
});