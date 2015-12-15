'use strict';

define(['phaser', 'objects/tree_evaluator'], function(Phaser,TreeEvaluator) {
    function Quest(game,gui,treeEvaluator,tier) {
        this.treeEvaluator = treeEvaluator;
        this.game = game;
        this.gui = gui;
        this.title = null;
        this.description = null;
        this.secondsToWin = 0;
        this.lastSuccess = false;
        this.lastTime = null;
        this.secondsSuccess = 0;
        
        this.tier = tier;
        this.max_tier = 0;

    }
    Quest.prototype.constructor = Quest;

    Quest.prototype.fadeOut = function(callback,callback_this) {
        this.gui.fadeOut(callback,callback_this);
    };

    Quest.prototype.activate = function() {
        this.gui.reset();
        this.draw();
    };

     Quest.prototype.deactivate = function() {
        this.gui.popupText.popup = false;
    };

    Quest.prototype.update = function() {
        var success = this.evaluate();
        this.updateProgress();
        if(success && this.lastSuccess){
            var dt = this.game.time.time - this.lastTime;
            this.secondsSuccess += dt / 1000;
        } else {
            this.secondsSuccess = 0;
        }

        if(this.won || (this.secondsSuccess >= this.secondsToWin)){
            this.won = true;
            this.gui.questText.setText(this.success_msg);
            this.gui.popupText.setText("");
        } else {

            if(this.success && this.secondsSuccess > 1){
                var tooFew = Math.round(10*(this.secondsToWin-this.secondsSuccess))/10;
                this.gui.popupText.setText(this.on_the_way_msg + " Hold on with this for " + tooFew + " more seconds.");
                if(!this.gui.popupText.popup){
                    this.gui.popIn();
                }
            } else {
                if(this.gui.popupText.popup){
                    this.gui.popOut();
                } else {
                    this.gui.popupText.setText("");
                    this.gui.popupText.popup = false;
                }
            }
            this.gui.questText.setText(this.title + ": " + this.description);
        }
        this.lastSuccess = success;
        this.lastTime = this.game.time.time;
    };

    return Quest;
});

