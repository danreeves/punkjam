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
    console.log(this.cache.getImage('bg').width)
    console.log(this.game.height)
    console.log(bg)

}

function gameUpdate () {
    bg.tilePosition.x -= 1;
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};
