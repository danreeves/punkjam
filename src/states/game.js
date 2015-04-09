// game.js

// External
var debounce = require('debounce');

// Create
var createPlayer = require('../objects/player'),
    createCop   = require('../objects/cop'),
    createFloor = require('../objects/floor');

// Update
var playerMovement = require('../modules/playerMovement'),
    copMovement = require('../modules/copMovement'),
    wantedLevel = require('../modules/wantedLevel'),
    canSpawnCopz = require('../modules/canSpawnCopz');

// Globals

var player, floor, cursors, copz,
    LAST_SPAWN = 0, MAX_COPZ = 200;

function gamePreload () {
    this.load.spritesheet('p1', 'assets/img/Punk jam/double size sprite sheet punk 1.png', 61.8, 86);
    this.load.spritesheet('p2', 'assets/img/Punk jam/double size sprite sheet punk 2.png', 61.8, 86);
    this.load.spritesheet('p3', 'assets/img/Punk jam/double size sprite sheet punk 3.png', 61.8, 86);
    this.load.spritesheet('p4', 'assets/img/Punk jam/double size sprite sheet punk 4.png', 61.8, 86);

    this.load.spritesheet('cop1', 'assets/img/Punk jam/double size sprite sheet cop 1.png', 61.8, 86);
    this.load.spritesheet('cop2', 'assets/img/Punk jam/double size sprite sheet cop 2.png', 61.8, 86);
    this.load.spritesheet('cop3', 'assets/img/Punk jam/double size sprite sheet cop 3.png', 61.8, 86);
    this.load.spritesheet('cop4', 'assets/img/Punk jam/double size sprite sheet cop 4.png', 61.8, 86);

    this.load.image('bg', 'assets/img/Punk jam/City backdrop cycle copy.png');
    this.load.image('bgbg', 'assets/img/Punk jam/City Backdrop silhouette copy.png');
    this.load.image('sp', 'assets/img/spacer.gif');
}

function gameCreate () {

    // enable physics
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // world bounds
    this.world.setBounds(0, 0, this.cache.getImage('bg').width*2, this.game.height);

    // dont smooth art
    this.stage.smoothed = false;

    //  background
    // this.add.tileSprite(0, -90, this.game.width, 540, 'bgbg').scale.setTo(2);
    this.add.tileSprite(0, -90, this.cache.getImage('bg').width*2, this.cache.getImage('bg').height, 'bg');

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

    // Collisions
    this.physics.arcade.collide(player, floor);
    this.physics.arcade.collide(copz, floor);

    // Player
    playerMovement.bind(this)(player, cursors);

    // Copz
    var wlvl = wantedLevel.bind(this)(player);
    if (canSpawnCopz.bind(this)(copz, wlvl)) {
        if ( (this.time.now - LAST_SPAWN) > 1000 ) {
            copz.add(createCop.bind(this)(this.camera));
            LAST_SPAWN = this.time.now;
        }
    }
    copz.forEach(function (cop) {
        copMovement(cop, player);
    });

}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};
