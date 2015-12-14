'use strict';

define(['phaser', 'objects/tree', 'objects/tree_evaluator'],
    function(Phaser, Tree, TreeEvaluator) {

    function GameplayState() {}

    GameplayState.prototype = {
        create: function() {
            this.tree = new Tree(this.game);
            this.treeEvaluator = new TreeEvaluator(this.tree);

            this.questText = this.game.add.text(
                this.game.world.centerX,0, "", 
                {font: "20px shmupfont", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
            this.questText.fixedToCamer = false;
            this.questText.anchor.setTo(0.5, 0.0);

            this.currentEvaluator = "leafsInLowerHalf";
            // title_text.wordWrap = true;
            // title_text.wordWrapWidth = (0.95 * this.game.world.width);
            // title_text.alpha = 0;
            // title_text.scale.x = 0;
            // title_text.scale.y = 0;


            this.graphics = game.add.graphics(0, 0);
            this.cutLine = undefined;

            this.game.stage.backgroundColor = "#89abd0";

        },

        setQuestText: function(evaluationResult) {
            if(evaluationResult.success){
                this.questText.setText(evaluationResult.success_msg);
            } else {
                this.questText.setText(evaluationResult.quest_title + ":" + evaluationResult.quest_msg);
            }
        },

        update: function() {
            this.graphics.clear(); 

            var result = this.treeEvaluator[this.currentEvaluator]();
            this.setQuestText(result);

            if (this.game.input.mousePointer.isDown) {
                if (this.cutLine) {
                    this.cutLine.end = this.game.input;
                } else {
                    this.cutLine = new Phaser.Line(this.game.input.x, this.game.input.y, this.game.input.x, this.game.input.y);
                }

                this.graphics.lineStyle(3, 0xff0909, 1);
                this.graphics.moveTo(this.cutLine.start.x, this.cutLine.start.y);
                this.graphics.lineTo(this.cutLine.end.x, this.cutLine.end.y);
            } else if (this.game.input.mousePointer.isUp) {
                if (this.cutLine) {
                    this.tree.cut(this.cutLine);
                    this.cutLine = undefined;
                }
            }
        }
    };

    return GameplayState;
});
