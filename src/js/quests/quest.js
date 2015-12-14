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
        
        this.tier = tier;
        this.max_tier = 0;
    }
    Quest.prototype.constructor = Quest;

    Quest.prototype.createText = function() {
        this.questText = this.game.add.text(
            this.game.world.centerX,0, "", 
            {font: "20px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        this.questText.fixedToCamer = false;
        this.questText.anchor.setTo(0.5, 0.0);

        this.progressText = this.game.add.text(
            this.game.world.centerX,50, "", 
            {font: "50px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
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

            if(this.success && this.secondsSuccess > 1){
                var tooFew = Math.round(10*(this.secondsToWin-this.secondsSuccess))/10;
                this.progressText.setText(this.on_the_way_msg + " Hold on with this for " + tooFew + " more seconds.");
                if(!this.progressText.popup){
                    this.progressText.popup = true;
                    this.progressText.x = this.game.world.centerX;
                    this.progressText.y = 50;
                    this.progressText.scale.set(0.5, 0.5);
                    var time = 1500;
                    var alpha_time = time * 0.5;
                    var popup_distance = 50;
                    if(this.progressText.transitionTween != null){
                        this.progressText.transitionTween.stop();
                        this.progressText.scaleTween.stop();
                    }
                    this.progressText.transitionTween = this.game.add.tween(this.progressText)
                                        .to({x: this.game.world.centerX ,y:50 + popup_distance},time,"Elastic.easeOut");
                    this.progressText.scaleTween = this.game.add.tween(this.progressText.scale)
                                        .to({x:1, y:1},time,"Elastic.easeOut");
                    // var alphaTween = this.game.add.tween(this.progressText)
                    //                     .to({alpha:1.0},alpha_time,"Elastic.easeOut");

                    this.progressText.transitionTween.start();
                    this.progressText.scaleTween.start();
                    // alphaTween.start();
                }
            } else {
                var time = 15000;
                if(this.progressText.popup){
                    this.progressText.transitionTween.stop();
                    this.progressText.scaleTween.stop();

                    // this.progressText.transitionTween.start();
                    // this.progressText.transitionTween.reverse = true;
                    // this.progressText.scaleTween.start();
                    // this.progressText.scaleTween.reverse = true;
                    ;
                    this.progressText.transitionTweenBack = this.game.add.tween(this.progressText)
                                            .to({x: this.game.world.centerX ,y:50},time,"Elastic.easeOut")

                    this.progressText.transitionTweenBack.onComplete.addOnce(function(){
                        this.progressText.setText("");
                        this.progressText.popup = false;
                        this.progressText.transitionTween.stop();
                        this.progressText.scaleTween.stop();
                    },this);
                                            
                    this.progressText.scaleTweenBack = this.game.add.tween(this.progressText.scale)
                                        .to({x:0.5, y:0.5},time,"Elastic.easeOut");
                    // var alphaTween = this.game.add.tween(this.progressText)
                                        // .to({alpha:0.5},time,"Elastic.easeOut");

                    this.progressText.transitionTweenBack.start();
                    this.progressText.scaleTweenBack.start();
                    // alphaTween.start();
                    this.progressText.popup = false;
                } else {
                    this.progressText.setText("");
                    this.progressText.popup = false;
                }
            }
            this.questText.setText(this.title + ":" + this.description);
        }
        this.lastSuccess = success;
        this.lastTime = this.game.time.time;
    };

    return Quest;
});

