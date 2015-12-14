'use strict';

define(['phaser', 'objects/tree_evaluator'], function(Phaser,TreeEvaluator) {
    function Quest(game,treeEvaluator) {
        this.treeEvaluator = treeEvaluator;
        this.game = game;
        this.questText = null;
        this.title = null;
        this.description = null;
        this.secondsToWin = 0;
        this.lastSuccess = false;
        this.lastTime = null;
        this.secondsSuccess = 0;
    }
    Quest.prototype.constructor = Quest;

    Quest.prototype.createText = function() {
        this.questText = this.game.add.text(
            this.game.world.centerX,0, "", 
            {font: "20px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.questText.fixedToCamer = false;
        this.questText.anchor.setTo(0.5, 0.0);

        this.progressText = this.game.add.text(
            this.game.world.centerX,20, "", 
            {font: "15px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.progressText.fixedToCamer = false;
        this.progressText.anchor.setTo(0.5, 0.0);
        // title_text.wordWrap = true;
        // title_text.wordWrapWidth = (0.95 * this.game.world.width);
        // title_text.alpha = 0;
        // title_text.scale.x = 0;
        // title_text.scale.y = 0;
    };
    Quest.prototype.update = function() {
        var success = this.evaluate();
        if(this.questText == null){
            this.createText();
        }
        if(success && this.lastSuccess){
            var dt = this.game.time.time - this.lastTime;
            this.secondsSuccess += dt / 1000;
        } else {
            this.secondsSuccess = 0;
        }

        if(this.won || (this.secondsSuccess >= this.secondsToWin)){
            this.won = true;
            this.questText.setText(this.success_msg);
            this.progressText.setText("");
        } else {
            if(this.success){
                var tooFew = Math.round(10*this.secondsToWin-this.secondsSuccess)/10;
                this.progressText.setText(this.on_the_way_msg + " Hold on with this for " + tooFew + " more seconds.");
            } else {
                this.progressText.setText("");
            }
            this.questText.setText(this.title + ":" + this.description);
        }
        this.lastSuccess = success;
        this.lastTime = this.game.time.time;
    };

    return Quest;
});

