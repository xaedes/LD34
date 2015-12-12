define([
        'phaser',
        'socketio',
        'states/boot',
        'states/preload',
        'states/main_intro',
        'states/main_menu',
        'states/level_master',
        'states/gameplay'],
    function(Phaser,
             io,
             BootState,
             PreloadState,
             MainIntroState,
             MainMenuState,
             LevelMasterState,
             GameplayState) {
        function Game() {}

    Game.prototype = {
        start: function() {
            // static general configuration
            var config = {
                width: 1280,
                height: 720,
                renderer: Phaser.AUTO,
                parent: 'game-area',
                transparent: null,
                antialias: false,
                forceSetTimeOut: false
            };
            var game = new Phaser.Game(config);
            window.game = game;

            // load all game states
            game.state.add('boot', BootState);
            game.state.add('preload', PreloadState);
            game.state.add('main-intro', MainIntroState);
            game.state.add('main-menu', MainMenuState);
            game.state.add('level-master', LevelMasterState);
            game.state.add('gameplay', GameplayState);

            // initialize environment
            game.state.start('boot');
        }
    };

    // For the time now
    // http://stackoverflow.com/a/10211214/798588
    Date.prototype.timeNow = function () {
         return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    };

    return Game;
});
