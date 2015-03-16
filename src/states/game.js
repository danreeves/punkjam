// game.js
var playerMovement = require('../modules/playerMovement'),
DEADZONE_WIDTH = 400;

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
    bg = this.add.tileSprite(0, 0, this.cache.getImage('bg').width, this.cache.getImage('bg').height, 'bg');
    bg.scale.setTo(2,2);

    // add floor
    floor = this.add.sprite(0, this.world.height-90, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width;

    // add player
    // The player and its settings
    player = this.add.sprite(32, this.world.height - 200, 'dude');
    player.tint = Math.random() * 0xffffff;
    player.scale.setTo(2);
    player.anchor.setTo(0.5,0.5);
    player.smoothed = false;

    //  We need to enable physics on the player
    this.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    player.body.gravity.y = 2000;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('run', [37, 38], 6, true);
    player.animations.add('jump', [39], 1, true);
    player.animations.add('idle', [3], 1, true);
    player.animations.play('idle');

    // controls
    cursors = this.input.keyboard.createCursorKeys();

    // camera
    this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
    this.camera.deadzone = new Phaser.Rectangle(
        this.game.width/2 - DEADZONE_WIDTH/2,
        this.game.height,
        DEADZONE_WIDTH,
        this.game.height
    );
    // this.camera.deadzone.fixedToCamera = true;

}

function gameUpdate () {
    this.physics.arcade.collide(player, floor);

    playerMovement(player, cursors);

}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};
