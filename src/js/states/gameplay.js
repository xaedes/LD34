'use strict';

define(['phaser', 'objects/tree', 'objects/leaf_sprites'],
    function(Phaser, Tree, LeafSprites) {

    function GameplayState() {}

    GameplayState.prototype = {
        create: function() {
            this.tree = new Tree(this.game);
            this.leafs = new LeafSprites(this.game, this.tree);
            this.game.world.add(this.leafs);

            this.graphics = game.add.graphics(0, 0);
            this.cutLine = undefined;

        },

        update: function() {
            this.graphics.clear();
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
