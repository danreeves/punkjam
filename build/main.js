(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/danr/Dropbox/htdocs/punkjam/src/main.js":[function(require,module,exports){
console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');

},{"./states/game":"/Users/danr/Dropbox/htdocs/punkjam/src/states/game.js"}],"/Users/danr/Dropbox/htdocs/punkjam/src/modules/playerMovement.js":[function(require,module,exports){
var RUN_SPEED = 3500,
    JUMP_V = 1000,
    AIR_DECEL = 0.33,
    AIR_DRAG = 0,
    FLOOR_DRAG = 5000;

module.exports = function (player, cursors) {

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.acceleration.x = -Math.abs(RUN_SPEED);
        player.scale.x = -Math.abs(player.scale.x);
        player.animations.play('run');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.acceleration.x = Math.abs(RUN_SPEED);
        player.scale.x = Math.abs(player.scale.x);
        player.animations.play('run');
    }
    else
    {
        //  Stand still
        player.animations.play('idle');
        player.body.acceleration.x = 0;

    }

    if (!player.body.touching.down) {
        player.animations.play('jump');
        player.body.acceleration.x = player.body.acceleration.x * AIR_DECEL;
        player.body.drag.setTo(AIR_DRAG, 0);
    } else {
        player.body.drag.setTo(FLOOR_DRAG, 0);
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -Math.abs(JUMP_V);
    }

};

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/objects/cop.js":[function(require,module,exports){
// cop.js
var DEADZONE_WIDTH = 400,
    MAX_SPEED = 350,
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

    cop = this.add.sprite(spawnLocations[Math.floor(Math.random()*2)], this.world.height - 200, 'dude');
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

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/objects/floor.js":[function(require,module,exports){
// floor.js
var WORLD_OVERFLOW;

module.exports = function () {
    WORLD_OVERFLOW = this.cache.getImage('dude').width*2;
    var floor;

    floor = this.add.sprite(-WORLD_OVERFLOW, this.world.height-90, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width + WORLD_OVERFLOW;

    return floor;
};

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/objects/player.js":[function(require,module,exports){
// player.js
var DEADZONE_WIDTH = 400,
    MAX_SPEED = 350,
    ACCELERATION = 1000,
    DRAG = 1000,
    GRAVITY = 2000;

module.exports = function () {

    // The player and its settings
    var player;
    player = this.add.sprite(32, this.world.height - 200, 'dude');
    player.scale.setTo(2);
    player.anchor.setTo(0.5,0.5);
    player.smoothed = false;

    //  We need to enable physics on the player
    this.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    player.body.gravity.y = GRAVITY;
    player.body.collideWorldBounds = true;

    player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED * 10);
    player.body.drag.setTo(DRAG, 0);

    //  Our two animations, walking left and right.
    player.animations.add('run', [37, 38], 6, true);
    player.animations.add('jump', [39], 1, true);
    player.animations.add('idle', [3], 1, true);
    player.animations.play('idle');

    // camera
    this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
    this.camera.deadzone = new Phaser.Rectangle(
        this.game.width/2 - DEADZONE_WIDTH/2,
        this.game.height,
        DEADZONE_WIDTH,
        this.game.height
    );

    return player;
};

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/states/game.js":[function(require,module,exports){
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

},{"../modules/playerMovement":"/Users/danr/Dropbox/htdocs/punkjam/src/modules/playerMovement.js","../objects/cop":"/Users/danr/Dropbox/htdocs/punkjam/src/objects/cop.js","../objects/floor":"/Users/danr/Dropbox/htdocs/punkjam/src/objects/floor.js","../objects/player":"/Users/danr/Dropbox/htdocs/punkjam/src/objects/player.js"}]},{},["/Users/danr/Dropbox/htdocs/punkjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tb2R1bGVzL3BsYXllck1vdmVtZW50LmpzIiwic3JjL29iamVjdHMvY29wLmpzIiwic3JjL29iamVjdHMvZmxvb3IuanMiLCJzcmMvb2JqZWN0cy9wbGF5ZXIuanMiLCJzcmMvc3RhdGVzL2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc29sZS5sb2coJyNwdW5ramFtJyk7XG5cbi8vIEdhbWVcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDk2MCwgNTQwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuLy8gU3RhdGVzXG5nYW1lLnN0YXRlLmFkZCgnZ2FtZScsIHJlcXVpcmUoJy4vc3RhdGVzL2dhbWUnKSk7XG5cbi8vIFN0YXJ0XG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4iLCJ2YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIsIGN1cnNvcnMpIHtcblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIGxlZnRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSAtTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcblxuICAgIH1cblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikge1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggKiBBSVJfREVDRUw7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oQUlSX0RSQUcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRkxPT1JfRFJBRywgMCk7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1NYXRoLmFicyhKVU1QX1YpO1xuICAgIH1cblxufTtcbiIsIi8vIGNvcC5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwLFxuICAgIFdPUkxEX09WRVJGTE9XO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjYW1lcmEpIHtcbiAgICBXT1JMRF9PVkVSRkxPVyA9IDMyKjI7XG4gICAgdmFyIGNvcDtcbiAgICB2YXIgc3Bhd25Mb2NhdGlvbnMgPSBbXTtcblxuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcubGVmdCAtIDMyLFxuICAgICAgICAgICAgLVdPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcucmlnaHQgKyAzMixcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC53aWR0aCtXT1JMRF9PVkVSRkxPV1xuICAgICAgICApXG4gICAgKTtcblxuICAgIGNvcCA9IHRoaXMuYWRkLnNwcml0ZShzcGF3bkxvY2F0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMildLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgJ2R1ZGUnKTtcbiAgICBjb3Auc2NhbGUuc2V0VG8oMik7XG4gICAgY29wLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBjb3Auc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBjb3BcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShjb3ApO1xuXG4gICAgLy8gIGNvcCBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIGNvcC5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIGNvcC5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgLy8gY29wLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKE1BWF9TUEVFRCwgTUFYX1NQRUVEICogMTApO1xuICAgIGNvcC5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIGNvcC5hbmltYXRpb25zLmFkZCgncnVuJywgWzM3LCAzOF0sIDYsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnanVtcCcsIFszOV0sIDEsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszXSwgMSwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG5cbiAgICByZXR1cm4gY29wO1xufTtcbiIsIi8vIGZsb29yLmpzXG52YXIgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gdGhpcy5jYWNoZS5nZXRJbWFnZSgnZHVkZScpLndpZHRoKjI7XG4gICAgdmFyIGZsb29yO1xuXG4gICAgZmxvb3IgPSB0aGlzLmFkZC5zcHJpdGUoLVdPUkxEX09WRVJGTE9XLCB0aGlzLndvcmxkLmhlaWdodC05MCwgJ3NwJyk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoZmxvb3IpO1xuICAgIGZsb29yLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbiAgICBmbG9vci5ib2R5LmFsbG93R3Jhdml0eSA9IGZhbHNlO1xuICAgIGZsb29yLndpZHRoID0gdGhpcy53b3JsZC53aWR0aCArIFdPUkxEX09WRVJGTE9XO1xuXG4gICAgcmV0dXJuIGZsb29yO1xufTtcbiIsIi8vIHBsYXllci5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHZhciBwbGF5ZXI7XG4gICAgcGxheWVyID0gdGhpcy5hZGQuc3ByaXRlKDMyLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgJ2R1ZGUnKTtcbiAgICBwbGF5ZXIuc2NhbGUuc2V0VG8oMik7XG4gICAgcGxheWVyLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBwbGF5ZXIuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBwbGF5ZXJcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwbGF5ZXIpO1xuXG4gICAgLy8gIFBsYXllciBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIHBsYXllci5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHBsYXllci5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKE1BWF9TUEVFRCwgTUFYX1NQRUVEICogMTApO1xuICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgncnVuJywgWzM3LCAzOF0sIDYsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnanVtcCcsIFszOV0sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszXSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgLy8gY2FtZXJhXG4gICAgdGhpcy5jYW1lcmEuZm9sbG93KHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OKTtcbiAgICB0aGlzLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKFxuICAgICAgICB0aGlzLmdhbWUud2lkdGgvMiAtIERFQURaT05FX1dJRFRILzIsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHQsXG4gICAgICAgIERFQURaT05FX1dJRFRILFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0XG4gICAgKTtcblxuICAgIHJldHVybiBwbGF5ZXI7XG59O1xuIiwiLy8gZ2FtZS5qc1xuXG4vLyBDcmVhdGVcbnZhciBjcmVhdGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL3BsYXllcicpLFxuICAgIGNyZWF0ZUNvcCAgID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb3AnKSxcbiAgICBjcmVhdGVGbG9vciA9IHJlcXVpcmUoJy4uL29iamVjdHMvZmxvb3InKTtcblxuLy8gVXBkYXRlXG52YXIgcGxheWVyTW92ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3BsYXllck1vdmVtZW50Jyk7XG5cbi8vIEdsb2JhbHNcblxudmFyIHBsYXllciwgZmxvb3IsIGN1cnNvcnMsIGNvcHosXG4gICAgTUFYX0NPUFogPSAyMDA7XG5cbmZ1bmN0aW9uIGdhbWVQcmVsb2FkICgpIHtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2R1ZGUnLCAnYXNzZXRzL2ltZy9kdWRlLnBuZycsIDM2LCAzNik7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdiZycsICdhc3NldHMvaW1nL2xvbmdzdHJlZXQuZ2lmJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdzcCcsICdhc3NldHMvaW1nL3NwYWNlci5naWYnKTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NpdHlfc2hlZXQnLCAnYXNzZXRzL2ltZy9jaXR5X3NoZWV0LmdpZicpO1xufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcblxuICAgIC8vIGVuYWJsZSBwaHlzaWNzXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICAvLyB3b3JsZCBib3VuZHNcbiAgICB0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICB0aGlzLmFkZC50aWxlU3ByaXRlKDAsIDAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKS5zY2FsZS5zZXRUbygyLDIpO1xuXG4gICAgLy8gYWRkIGZsb29yXG4gICAgZmxvb3IgPSBjcmVhdGVGbG9vci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBhZGQgcGxheWVyXG4gICAgcGxheWVyID0gY3JlYXRlUGxheWVyLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGNvbnRyb2xzXG4gICAgY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG4gICAgLy8gY29welxuICAgIGNvcHogPSB0aGlzLmFkZC5ncm91cCgpO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKHRlc3QpIHtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBmbG9vcik7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGNvcHosIGZsb29yKTtcblxuICAgIHBsYXllck1vdmVtZW50KHBsYXllciwgY3Vyc29ycyk7XG5cblxuICAgIC8vIFRoaW5rIHVwIGFsZ29yaXRobSBmb3Igd2FudGVkIGxldmVsXG4gICAgLy8gaW52b2x2ZXMgdGltZSBhbmQgYW1vdW50IG9mIGp1bXBzXG4gICAgLy8gbm90IHVzaW5nIHRpbWUubm93IGJlY2F1c2UgaXQgY2F0Y2hlcyB1cCBhZnRlciBwYXVzZSBhbmQgc3Bhd25zIGxvYWRzXG4gICAgaWYgKGNvcHoubGVuZ3RoIDwgTWF0aC5mbG9vcih0aGlzLnRpbWUubm93LzEwMDApIC8gMiAmJiBjb3B6Lmxlbmd0aCA8IE1BWF9DT1BaKSB7XG4gICAgICAgIGNvcHouYWRkKGNyZWF0ZUNvcC5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgfVxuICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICB2LmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgICAgIHYuYm9keS52ZWxvY2l0eS54ID0gMTAwO1xuICAgIH0pO1xuICAgIC8vIGxvbFxuICAgIHBsYXllci50aW50ID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWxvYWQ6IGdhbWVQcmVsb2FkLFxuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgdXBkYXRlOiAgZ2FtZVVwZGF0ZVxufTtcbiJdfQ==
