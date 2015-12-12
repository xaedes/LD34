'use strict';

define(['phaser'], 
    function(Phaser) {
    function GameplayState() {}

    GameplayState.prototype = {
        create: function() {
            // add tank
            // control tank with wasd and with arrows
            // add mouse controlled bullseye
            // click causes tank to shoot
            // bullet flies in parable, height causes upscaling, simply use tween?
            // add explosions when bullets land
        },

        update: function() {

        }
    };

    return GameplayState;
});
