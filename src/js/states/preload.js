'use strict';

define(['helper'], function(Helper) {
    function Preload() {}

    Preload.prototype = {
        preload: function() {
            // load all game assets
            // images, spritesheets, atlases, audio etc..
        },

        create: function() {
            // skip game play menu for debugging
            if( Helper.QueryString.skip_menu ) {
                game.state.start('gameplay');
            } else {
                game.state.start('main-menu');
            }
        }
    };

    return Preload;
});
