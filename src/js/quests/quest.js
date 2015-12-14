'use strict';

define(['phaser', 'objects/tree_evaluator'], function(Phaser,TreeEvaluator) {
    function Quest(game,treeEvaluator,tier) {
        this.treeEvaluator = treeEvaluator;
        this.game = game;
        this.questText = null;
        this.title = null;
        this.description = null;
        this.secondsToWin = 0;
        this.lastSuccess = false;
        this.lastTime = null;
        this.secondsSuccess = 0;
        this._fading = false;
        
        this.tier = tier;
        this.max_tier = 0;
    }
    Quest.prototype.constructor = Quest;

    Quest.prototype.fadeOut = function(callback,callback_this) {
        if(this._fading)return;
        var time = 1000;
        this._fading = true;
        var scaleOutQuest = this.game.add.tween(this.questText.scale)
                            .to({x: 0 ,y:0},time,"Elastic.easeOut")
                            .start();
        var scaleOutProgress = this.game.add.tween(this.progressText.scale)
                            .to({x: 0 ,y:0},time,"Elastic.easeOut")
                            .start();
        var scaleOutPopup = this.game.add.tween(this.popupText.scale)
                            .to({x: 0 ,y:0},time,"Elastic.easeOut")
                            .start();
        var alphaOutQuest = this.game.add.tween(this.questText)
                            .to({alpha:0},time,"Elastic.easeOut")
                            .start();
        var alphaOutProgress = this.game.add.tween(this.progressText)
                            .to({alpha:0},time,"Elastic.easeOut")
                            .start();
        var alphaOutPopup = this.game.add.tween(this.popupText)
                            .to({alpha:0},time,"Elastic.easeOut");
        var intervalID = setTimeout(function() {
            callback.call(callback_this);
        }, time);        
        alphaOutPopup.start();
    };
    Quest.prototype.cleanUp = function() {
        this.questText.destroy();
        this.progressText.destroy();
        this.popupText.destroy();
    };
    Quest.prototype.createText = function() {
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
        this.progressText.setText(this.progressMsg());
        if(success && this.lastSuccess){
            var dt = this.game.time.time - this.lastTime;
            this.secondsSuccess += dt / 1000;
        } else {
            this.secondsSuccess = 0;
            

        }

        if(this.won || (this.secondsSuccess >= this.secondsToWin)){
            this.won = true;
            this.questText.setText(this.success_msg);
            this.popupText.setText("");
        } else {

            if(this.success && this.secondsSuccess > 1){
                var tooFew = Math.round(10*(this.secondsToWin-this.secondsSuccess))/10;
                this.popupText.setText(this.on_the_way_msg + " Hold on with this for " + tooFew + " more seconds.");
                if(!this.popupText.popup){
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
                }
            } else {
                var time = 15000;
                if(this.popupText.popup){
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
                } else {
                    this.popupText.setText("");
                    this.popupText.popup = false;
                }
            }
            this.questText.setText(this.title + ": " + this.description);
        }
        this.lastSuccess = success;
        this.lastTime = this.game.time.time;
    };

    return Quest;
});

