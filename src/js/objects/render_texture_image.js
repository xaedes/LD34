'use strict';

define(['phaser', 'helper'], function (Phaser, Helper) {
    function RenderTextureImage(game) {
        // generate texture that fills complete screen, that we draw to
        this.tex = game.add.renderTexture(game.width, game.height);
        // call super constructor with our generated Texture
        Phaser.Image.call(this, game, 0, 0, this.tex);
    }
    RenderTextureImage.prototype = Object.create(Phaser.Image.prototype);
    RenderTextureImage.prototype.constructor = RenderTextureImage;

    return RenderTextureImage;
});