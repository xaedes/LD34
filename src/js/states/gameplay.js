'use strict';

define(['phaser', 'objects/tree', 'objects/leaf_sprites'],
    function(Phaser, Tree, LeafSprites) {

    function GameplayState() {}

    GameplayState.prototype = {
        create: function() {
            this.tree = new Tree(this.game);
            this.leafs = new LeafSprites(this.game);
            this.game.world.add(this.leafs);
        },

        update: function() {
        }
    };

    return GameplayState;
});
