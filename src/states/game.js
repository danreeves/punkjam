// game.js

function gamePreload () {
    this.load.spritesheet('dude', 'assets/img/dude.png');
    this.load.image('bg', 'assets/img/longstreet.gif');
    this.load.spritesheet('city_sheet', 'assets/img/city_sheet.gif');
}

function gameCreate () {

    // enable physics
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.stage.smoothed = false;

    //  A simple background for our game
    bg = this.add.tileSprite(0, 0, this.cache.getImage('bg').width, 256, 'bg');
    bg.scale.y = bg.scale.x = 2;

}

function gameUpdate () {
    bg.tilePosition.x -= 0.5;
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};
