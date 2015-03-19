// cop.js
var DEADZONE_WIDTH = 400,
    MAX_SPEED = 350,
    ACCELERATION = 1000,
    DRAG = 1000,
    GRAVITY = 2000,
    WORLD_OVERFLOW;

module.exports = function (player) {
    WORLD_OVERFLOW = this.cache.getImage('dude').width*2;
    var cop;
    var spawnLocations = [];

    spawnLocations.push(
        Math.min(
            player.x - this.game.width/2 - this.cache.getImage('dude').width,
            -WORLD_OVERFLOW
        )
    );
    spawnLocations.push(
        Math.min(
            player.x + this.game.width + this.cache.getImage('dude').width,
            this.game.width+WORLD_OVERFLOW
        )
    );
    console.log(this.camera);

    cop = this.add.sprite(spawnLocations[1], this.world.height - 200, 'dude');
    cop.scale.setTo(2);
    cop.anchor.setTo(0.5,0.5);
    cop.smoothed = false;

    //  We need to enable physics on the cop
    this.physics.arcade.enable(cop);

    //  cop physics properties. Give the little guy a slight bounce.
    // cop.body.bounce.y = 0.2;
    cop.body.gravity.y = GRAVITY;
    // cop.body.collideWorldBounds = true;

    cop.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED * 10);
    cop.body.drag.setTo(DRAG, 0);

    //  Our two animations, walking left and right.
    cop.animations.add('run', [37, 38], 6, true);
    cop.animations.add('jump', [39], 1, true);
    cop.animations.add('idle', [3], 1, true);
    cop.animations.play('idle');


    return cop;
};
