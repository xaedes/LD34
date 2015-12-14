'use strict';

define(['phaser', 'objects/tree_evaluator'], function(Phaser,TreeEvaluator) {
    function QuestGui(game) {
        this.game = game;
        this.questText = this.game.add.text(
            this.game.world.centerX,0, "", 
            {font: "20px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.questText.fixedToCamer = false;
        this.questText.anchor.setTo(0.5, 0.0);

        this.questText = this.game.add.text(
            this.game.world.centerX,0, "", 
            {font: "20px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.questText.fixedToCamer = false;
        this.questText.anchor.setTo(0.5, 0.0);

        this.progressText = this.game.add.text(
            this.game.world.centerX,this.game.world.height - 50, "", 
            {font: "20px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.progressText.fixedToCamer = false;
        this.progressText.anchor.setTo(0.5, 1.0);

        this.popupText = this.game.add.text(
            this.game.world.centerX,80, "", 
            {font: "50px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.popupText.fixedToCamer = false;
        this.popupText.anchor.setTo(0.5, 0.0);
        this.popupText.original_y = this.popupText.y;

        this.graphics = this.game.add.graphics(0,0);
        this._fading = false;
        
    }
    QuestGui.prototype.constructor = QuestGui;

    QuestGui.prototype.reset = function(callback,callback_this) {
        this.questText.scale.set(1);
        this.progressText.scale.set(1);
        this.popupText.scale.set(1);
        this.questText.alpha = 1;
        this.progressText.alpha = 1;
        this.popupText.alpha = 1;
    };
    QuestGui.prototype.fadeIn = function(callback,callback_this) {
        if(this._fading)return;
        var time = 1000;
        this._fading = true;
        var scaleInQuestGui = this.game.add.tween(this.questText.scale)
                            .to({x: 1 ,y:1},time,"Elastic.easeOut")
                            .start();
        var scaleInProgress = this.game.add.tween(this.progressText.scale)
                            .to({x: 1 ,y:1},time,"Elastic.easeOut")
                            .start();
        var scaleInPopup = this.game.add.tween(this.popupText.scale)
                            .to({x: 1 ,y:1},time,"Elastic.easeOut")
                            .start();
        var alphaInQuestGui = this.game.add.tween(this.questText)
                            .to({alpha:1},time,"Elastic.easeOut")
                            .start();
        var alphaInProgress = this.game.add.tween(this.progressText)
                            .to({alpha:1},time,"Elastic.easeOut")
                            .start();
        var alphaInPopup = this.game.add.tween(this.popupText)
                            .to({alpha:1},time,"Elastic.easeOut");
        var intervalID = setTimeout(function() {
            if(callback != undefined){
                callback.call(callback_this);
            }
            scaleInQuestGui.stop();
            scaleInProgress.stop();
            scaleInPopup.stop();
            alphaInQuestGui.stop();
            alphaInProgress.stop();
            alphaInPopup.stop();
            scaleInQuestGui.destroy();
            scaleInProgress.destroy();
            scaleInPopup.destroy();
            alphaInQuestGui.destroy();
            alphaInProgress.destroy();
            alphaInPopup.destroy();
        }, time);        
        alphaInPopup.start();
    };
    QuestGui.prototype.fadeOut = function(callback,callback_this) {
        if(this._fading)return;
        var time = 1000;
        this._fading = true;
        var scaleOutQuestGui = this.game.add.tween(this.questText.scale)
                            .to({x: 0 ,y:0},time,"Elastic.easeOut")
                            .start();
        var scaleOutProgress = this.game.add.tween(this.progressText.scale)
                            .to({x: 0 ,y:0},time,"Elastic.easeOut")
                            .start();
        var scaleOutPopup = this.game.add.tween(this.popupText.scale)
                            .to({x: 0 ,y:0},time,"Elastic.easeOut")
                            .start();
        var alphaOutQuestGui = this.game.add.tween(this.questText)
                            .to({alpha:0},time,"Elastic.easeOut")
                            .start();
        var alphaOutProgress = this.game.add.tween(this.progressText)
                            .to({alpha:0},time,"Elastic.easeOut")
                            .start();
        var alphaOutPopup = this.game.add.tween(this.popupText)
                            .to({alpha:0},time,"Elastic.easeOut");
        var intervalID = setTimeout(function() {
            callback.call(callback_this);
            scaleOutQuestGui.stop();
            scaleOutProgress.stop();
            scaleOutPopup.stop();
            alphaOutQuestGui.stop();
            alphaOutProgress.stop();
            alphaOutPopup.stop();
            scaleOutQuestGui.destroy();
            scaleOutProgress.destroy();
            scaleOutPopup.destroy();
            alphaOutQuestGui.destroy();
            alphaOutProgress.destroy();
            alphaOutPopup.destroy();
        }, time);        
        alphaOutPopup.start();
    };
    QuestGui.prototype.popIn = function() {
        this.popupText.popup = true;
        this.popupText.x = this.game.world.centerX;
        this.popupText.y = this.popupText.original_y;
        this.popupText.scale.set(0.5, 0.5);
        var time = 1500;
        var alpha_time = time * 0.5;
        var popup_distance = 50;
        if(this.popupText.transitionTween != null){
            this.popupText.transitionTween.stop();
            this.popupText.scaleTween.stop();
        }
        this.popupText.transitionTween = this.game.add.tween(this.popupText)
                            .to({x: this.game.world.centerX ,y:this.popupText.original_y + popup_distance},time,"Elastic.easeOut");
        this.popupText.scaleTween = this.game.add.tween(this.popupText.scale)
                            .to({x:1, y:1},time,"Elastic.easeOut");
        // var alphaTween = this.game.add.tween(this.popupText)
        //                     .to({alpha:1.0},alpha_time,"Elastic.easeOut");

        this.popupText.transitionTween.start();
        this.popupText.scaleTween.start();
        // alphaTween.start();
    };
    QuestGui.prototype.popOut = function() {
        var time = 15000;
        this.popupText.transitionTween.stop();
        this.popupText.scaleTween.stop();

        // this.popupText.transitionTween.start();
        // this.popupText.transitionTween.reverse = true;
        // this.popupText.scaleTween.start();
        // this.popupText.scaleTween.reverse = true;
        
        this.popupText.transitionTweenBack = this.game.add.tween(this.popupText)
                                .to({x: this.game.world.centerX ,y:this.popupText.original_y},time,"Elastic.easeOut")

        this.popupText.transitionTweenBack.onComplete.addOnce(function(){
            this.popupText.setText("");
            this.popupText.popup = false;
            this.popupText.transitionTween.stop();
            this.popupText.scaleTween.stop();
        },this);
                                
        this.popupText.scaleTweenBack = this.game.add.tween(this.popupText.scale)
                            .to({x:0.5, y:0.5},time,"Elastic.easeOut");
        // var alphaTween = this.game.add.tween(this.popupText)
                            // .to({alpha:0.5},time,"Elastic.easeOut");

        this.popupText.transitionTweenBack.start();
        this.popupText.scaleTweenBack.start();
        // alphaTween.start();
        this.popupText.popup = false;
    };
    QuestGui.prototype.cleanUp = function() {
        this.questText.destroy();
        this.progressText.destroy();
        this.popupText.destroy();
    };

    return QuestGui;
});

