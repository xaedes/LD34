'use strict';

define(['phaser', 'objects/tree'],
    function(Phaser, Tree) {
    function GameplayState() {}

    GameplayState.prototype = {
        create: function() {
            this.tree = new Tree(this.game);
        },

        update: function() {

        }
    };

    return GameplayState;
});
