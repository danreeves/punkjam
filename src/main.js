console.log('#punkjam');

var game = require('./states/game');

var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

game.state.add('game', game);
game.state.start('game');
