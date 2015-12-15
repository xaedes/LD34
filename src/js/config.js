'use strict';

require.config({
    paths: {
        // JavaScript folders.
        app: 'app',

        // Libraries
        phaser: 'lib/phaser.debug',
        helper: 'utils/helper'
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        phaser: {
            exports: 'Phaser'
        },
        socketio: {
            exports: 'io'
        },
        helper: {
            exports: 'helper'
        }
    }
});

// Initialize the application with the main application file.
require(['phaser', 'app'], function (Phaser, App) {
    var app = new App();
    app.start();
});
