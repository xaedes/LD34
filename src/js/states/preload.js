'use strict';

define(['helper'], function(Helper) {
    function Preload() {}

    Preload.prototype = {
        preload: function() {
            // load all game assets
            // images, spritesheets, atlases, audio etc..
            this.load.image('colormap', 'assets/colormap_1.png');

        },

        create: function() {
            // skip game play menu for debugging
            if( Helper.QueryString.skip_menu ) {
                this.game.state.start('gameplay');
            } else {
                this.game.state.start('main-menu');
            }
        }
    };

    return Preload;
});
