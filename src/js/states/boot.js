'use strict';

define([], function() {
    function Boot() {}

    Boot.prototype = {
        preload: function() {
            // load preloader assets
        },

        create: function() {
            // setup game environment
            // scale, input etc..
            game.state.start('preload');
        }
    };

    return Boot;
});
