'use strict';

define(['phaser', 'helper', 'objects/tree_evaluator', 'quests/quest'], 
    function(Phaser,Helper,TreeEvaluator,Quest) {

    function MasterOfZero(game, gui, treeEvaluator, tier) {
        Quest.call(this, game, gui, treeEvaluator, tier);
        this.title = tier+".Master Of Zero";
        this.secondsToWin = 10;
        this.max_tier = 20;
        this.difficulty = this.tier/this.max_tier;
        this.size = Helper.lerp(0.0,0.5,this.difficulty);
        this.condition = {
            sum_middle: Math.floor(Helper.lerp(10,0,this.difficulty)),
            sum:        Math.floor(Helper.lerp(15,30,this.difficulty))
        };
        this.description = "Grow a tree, with leafs but leaf a hole in the middle.";
        this.description += "\nYou can have at most " + this.condition.sum_middle + " leaves in the middle";
        this.description += "\nYou need at least " + this.condition.sum + " leaves on the tree.";
        this.on_the_way_msg = "This looks good!";
        this.success_msg = "I am amazed by your lately growth. I shall now call you Master Of Zero.";
    }
    MasterOfZero.prototype = Object.create(Quest.prototype);
    MasterOfZero.prototype.constructor = MasterOfZero;
    MasterOfZero.prototype.evaluate = function() {
        this.evaluation = this.treeEvaluator.leafsHoleInTheMiddle(this.size,this.condition);
        this.success = this.evaluation.success;
        return this.evaluation.success;
    };
    MasterOfZero.prototype.progressMsg = function() {
        var msg = "";
        msg += Math.floor(this.evaluation.sum_middle) + " / " + this.condition.sum_middle + " in the middle\n";
        msg += Math.floor(this.evaluation.sum) + " / " + this.condition.sum + " on the tree";
        return msg;
    };
    MasterOfZero.prototype.updateProgress = function() {
        var w = this.treeEvaluator.tree.leafDensity.width;
        var h = this.treeEvaluator.tree.leafDensity.height;
        var w2 = Math.ceil(w/2);
        var h2 = Math.ceil(h/2);
        var w2_hole = Math.ceil(w*this.size/2);
        var h2_hole = Math.ceil(h*this.size/2);
        var res = this.treeEvaluator.tree.genome.leaf_density_resolution;
        var x_min = res*(w2-w2_hole);
        var x_max = res*(w2-w2_hole+2*w2_hole);
        var y_min = res*(h2-h2_hole);
        var y_max = res*(h2-h2_hole+2*h2_hole);
        this.gui.progressText.setText(this.progressMsg());
        this.gui.progressText.y = y_max;
    };
    MasterOfZero.prototype.draw = function() {
        // graphics.lineStyle(2, 0xff0000, 1);
        // graphics.moveTo(0,);
        var graphics = this.gui.graphics;
        var w = this.treeEvaluator.tree.leafDensity.width;
        var h = this.treeEvaluator.tree.leafDensity.height;
        var w2 = Math.ceil(w/2);
        var h2 = Math.ceil(h/2);
        var w2_hole = Math.ceil(w*this.size/2);
        var h2_hole = Math.ceil(h*this.size/2);
        var res = this.treeEvaluator.tree.genome.leaf_density_resolution;
        var x_min = res*(w2-w2_hole);
        var x_max = res*(w2-w2_hole+2*w2_hole);
        var y_min = res*(h2-h2_hole);
        var y_max = res*(h2-h2_hole+2*h2_hole);

        graphics.clear();
        graphics.lineStyle(2, 0xaf0000, 1);
        graphics.moveTo(x_min,y_min);
        graphics.lineTo(x_max,y_min);
        graphics.lineTo(x_max,y_max);
        graphics.lineTo(x_min,y_max);
        graphics.lineTo(x_min,y_min);
    };
    return MasterOfZero;
});