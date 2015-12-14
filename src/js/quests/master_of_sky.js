'use strict';

define(['phaser', 'objects/tree_evaluator', 'quests/quest'], function(Phaser,TreeEvaluator,Quest) {
    function MasterOfSky(game, treeEvaluator) {
        Quest.call(this, game, treeEvaluator);
        this.title = "Master Of Sky";
        this.secondsToWin = 10;
        this.description = "Grow a tree, with only the upper half of the screen filled with leafs.";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "With your will to rise upwards you mastered the Sky. I shall now call you Master Of Sky.";
    }
    MasterOfSky.prototype = Object.create(Quest.prototype);
    MasterOfSky.prototype.constructor = MasterOfSky;
    MasterOfSky.prototype.evaluate = function() {
        this.success = this.treeEvaluator.leafsInUpperHalf();
        return this.success;
    };
    return MasterOfSky;
});