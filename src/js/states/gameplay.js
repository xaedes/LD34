'use strict';

define(['phaser', 'objects/tree', 'objects/tree_evaluator', 
    'quests/master_of_earth', 'quests/master_of_sky', 'quests/master_of_zero'],
    function(Phaser, Tree, TreeEvaluator, MasterOfEarth, MasterOfSky, MasterOfZero) {

    function GameplayState() {}

    GameplayState.prototype = {
        create: function() {
            this.tree = new Tree(this.game);
            this.treeEvaluator = new TreeEvaluator(this.tree);

            this.quests = [];
            for(var i=1;i<100;i++){
                this.quests.push(new MasterOfEarth(this.game, this.treeEvaluator, i));
                this.quests.push(new MasterOfSky(this.game, this.treeEvaluator, i));
                this.quests.push(new MasterOfZero(this.game, this.treeEvaluator, i));
            }
            this.quest_counter = 0;
            this.currentQuest = this.quests[this.quest_counter];

            this.graphics = game.add.graphics(0, 0);
            this.cutLine = undefined;

            this.game.stage.backgroundColor = "#89abd0";

            this.gKey = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
            
            var tree = this.tree;
            this.gKey.onDown.add(function() {
                if (!tree.growModus) {
                    tree.growModus = 1;
                    var intervalID = setInterval(function() {
                        tree.grow(1);
                        tree.draw();

                        if (++tree.growModus === tree.genome.grow_count) {
                            tree.growModus = 0;
                            window.clearInterval(intervalID);
                        }
                    }, tree.genome.grow_rate);
                }

            });

            this.slowGrowthIntervalID = setInterval(function() {
                tree.grow(tree.genome.slow_grow);
                tree.draw();
            }, tree.genome.slow_grow_rate);
        },

        update: function() {
            this.graphics.clear(); 

            this.currentQuest.update();
            if (this.currentQuest.won) {
                this.currentQuest.fadeOut(function(){
                    this.currentQuest.cleanUp();
                    this.quest_counter++;
                    this.currentQuest = this.quests[this.quest_counter];
                },this);
            }

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
