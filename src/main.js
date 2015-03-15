console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');
