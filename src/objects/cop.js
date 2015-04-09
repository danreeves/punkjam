// cop.js
var DEADZONE_WIDTH = 400,
    MAX_SPEED = 250,
    ACCELERATION = 1000,
    DRAG = 1000,
    GRAVITY = 2000,
    WORLD_OVERFLOW;

module.exports = function (camera) {
    WORLD_OVERFLOW = 32*2;
    var cop;
    var spawnLocations = [];

    spawnLocations.push(
        Math.min(
            camera.view.left - 32,
            -WORLD_OVERFLOW
        )
    );
    spawnLocations.push(
        Math.min(
            camera.view.right + 32,
            this.game.world.width+WORLD_OVERFLOW
        )
    );

    cop = this.add.sprite(spawnLocations[Math.floor(Math.random()*2)], this.world.height - 200, 'cop');
    // cop.scale.setTo(2);
    cop.anchor.setTo(0.5,0.5);
    cop.smoothed = false;

    //  We need to enable physics on the cop
    this.physics.arcade.enable(cop);

    //  cop physics properties. Give the little guy a slight bounce.
    // cop.body.bounce.y = 0.2;
    cop.body.gravity.y = GRAVITY;
    // cop.body.collideWorldBounds = true;

    cop.maxSpeed = Math.min(MAX_SPEED * (parseFloat((Math.random() * 1).toFixed(2), 10) + 0.5), 345);
    cop.body.maxVelocity.setTo(cop.maxSpeed, cop.maxSpeed * 10);
    cop.body.drag.setTo(DRAG, 0);

    //  Our two animations, walking left and right.
    cop.animations.add('run', [0, 1], 6, true);
    cop.animations.add('jump', [2], 1, true);
    cop.animations.add('idle', [3, 3, 4], 2, true);
    cop.animations.play('idle');


    return cop;
};
