// game.js

// Create
var createPlayer = require('../objects/player'),
    createCop   = require('../objects/cop'),
    createFloor = require('../objects/floor');

// Update
var playerMovement = require('../modules/playerMovement');

// Globals

var player, floor, cursors, copz,
    MAX_COPZ = 200;

function gamePreload () {
    this.load.spritesheet('dude', 'assets/img/dude.png', 36, 36);
    this.load.image('bg', 'assets/img/longstreet.gif');
    this.load.image('sp', 'assets/img/spacer.gif');
    this.load.spritesheet('city_sheet', 'assets/img/city_sheet.gif');
}

function gameCreate () {

    // enable physics
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // world bounds
    this.world.setBounds(0, 0, this.cache.getImage('bg').width*2, this.game.height);

    // dont smooth art
    this.stage.smoothed = false;

    //  background
    this.add.tileSprite(0, 0, this.cache.getImage('bg').width, this.cache.getImage('bg').height, 'bg').scale.setTo(2,2);

    // add floor
    floor = createFloor.bind(this)();

    // add player
    player = createPlayer.bind(this)();

    // controls
    cursors = this.input.keyboard.createCursorKeys();

    // copz
    copz = this.add.group();

}

function gameUpdate (test) {
    this.physics.arcade.collide(player, floor);
    this.physics.arcade.collide(copz, floor);

    playerMovement(player, cursors);


    // Think up algorithm for wanted level
    // involves time and amount of jumps
    // not using time.now because it catches up after pause and spawns loads
    if (copz.length < Math.floor(this.time.now/1000) / 2 && copz.length < MAX_COPZ) {
        copz.add(createCop.bind(this)(this.camera));
    }
    copz.forEach(function (v) {
        v.animations.play('run');
        v.body.velocity.x = 100;
    });
    // lol
    player.tint = Math.random() * 0xffffff;
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};
