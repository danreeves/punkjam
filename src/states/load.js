'use strict';

module.exports = {
    preload: function () {
        var loading = this.game.add.sprite(this.game.width/2, 0, 'loading');
        loading.anchor.x = Math.round(loading.width * 0.5) / loading.width;
        this.game.load.setPreloadSprite(loading);

        this.load.spritesheet('p1', 'assets/img/punk1.png', 61.8, 86);
        this.load.spritesheet('p2', 'assets/img/punk2.png', 61.8, 86);
        this.load.spritesheet('p3', 'assets/img/punk3.png', 61.8, 86);
        this.load.spritesheet('p4', 'assets/img/punk4.png', 61.8, 86);

        this.load.spritesheet('cop1', 'assets/img/cop1.png', 61.8, 86);
        this.load.spritesheet('cop2', 'assets/img/cop2.png', 61.8, 86);
        this.load.spritesheet('cop3', 'assets/img/cop3.png', 61.8, 86);
        this.load.spritesheet('cop4', 'assets/img/cop4.png', 61.8, 86);

        this.load.image('coin', 'assets/img/anarchycoin.png');
        this.load.image('wanted', 'assets/img/wanted.png');

        this.load.image('bg', 'assets/img/bg-new.png');
        this.load.image('sp', 'assets/img/spacer.gif');
        this.load.image('bl', 'assets/img/blood.gif');

        this.load.image('sign', 'assets/img/sign.png');
        this.load.image('ramp', 'assets/img/ramp.png');
        this.load.image('bin', 'assets/img/bin.png');

        this.load.audio('punkLoop', 'assets/sound/punkloop.mp3');
        this.load.audio('pickup', 'assets/sound/alright.mp3');
        this.load.audio('grunt1', 'assets/sound/grunt1.mp3');
        this.load.audio('grunt2', 'assets/sound/grunt2.mp3');

        this.load.image('numbers', 'assets/img/numbers.png');
        this.load.image('font', 'assets/img/font.png');
    },
    create: function () {
        var game = this;
        setTimeout(function () {
            game.game.state.start('game');
        }, 1000);
    }
};
