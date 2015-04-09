(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Module dependencies.
 */

var now = require('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

},{"date-now":2}],2:[function(require,module,exports){
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],3:[function(require,module,exports){
console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');

},{"./states/game":11}],4:[function(require,module,exports){
// canSpawnCopz.js

module.exports = function (copz, wantedLevel) {
    if (wantedLevel === 0) return false;

    var maxCopz = (wantedLevel === 1) ?
                    5 : (wantedLevel === 2) ?
                    10 : (wantedLevel === 3) ?
                    15 : (wantedLevel === 4) ?
                    25 : (wantedLevel === 5) ?
                    50 : (wantedLevel === 6) ?
                    100 : 0;

    if (copz.length >= maxCopz) return false;

    return true;
};

},{}],5:[function(require,module,exports){
// copMovement.js
var RUN_SPEED = 3500,
    MAX_SPEED = 250,
    JUMP_V = 1000,
    AIR_DECEL = 0.33,
    AIR_DRAG = 0,
    FLOOR_DRAG = 5000*2;

module.exports = function (cop, player) {

    if (!player.body.touching.down) cop.body.maxVelocity.setTo(cop.maxSpeed/2, cop.maxSpeed * 10);
    else cop.body.maxVelocity.setTo(cop.maxSpeed, cop.maxSpeed * 10);

    if (player.body.x < cop.body.x) {
        // player is to the left
        cop.body.acceleration.x = -Math.abs(RUN_SPEED);
        cop.scale.x = -Math.abs(cop.scale.x);
        cop.animations.play('run');
    }
    else if (player.body.x > cop.body.x) {
        // player is to the right
        cop.body.acceleration.x = Math.abs(RUN_SPEED);
        cop.scale.x = Math.abs(cop.scale.x);
        cop.animations.play('run');

    } else {
        //  Stand still
        player.animations.play('idle');
        player.body.acceleration.x = 0;
    }


};

},{}],6:[function(require,module,exports){
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
        player.jumps++;
        if (player.firstJump == null) {
            player.firstJump = this.time.now;
        }
    }

};

},{}],7:[function(require,module,exports){
// wantedLevel.js

module.exports = function (player) {

    var wantedLevel = 0,
    timeSinceFirstJump = (player.firstJump == null) ? 0 : Math.floor((this.time.now - player.firstJump)/1000),
    totalJumps = player.jumps;

    if (totalJumps > 0) {
        wantedLevel = 1;
    }
    if (totalJumps > 5 || timeSinceFirstJump > 5) {
        wantedLevel = 2;
    }
    if (totalJumps > 15 || timeSinceFirstJump > 15) {
        wantedLevel = 3;
    }
    if (totalJumps > 30 && timeSinceFirstJump > 30) {
        wantedLevel = 4;
    }
    if (totalJumps > 40 && timeSinceFirstJump > 45) {
        wantedLevel = 5;
    }
    if (totalJumps > 100 && timeSinceFirstJump > 60) {
        wantedLevel = 6;
    }

    return wantedLevel;
};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
    // player.scale.setTo(2);
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
    player.animations.add('run', [0, 1], 6, true);
    player.animations.add('jump', [2], 1, true);
    player.animations.add('idle', [3, 3, 4], 2, true);
    player.animations.play('idle');

    // misc
    player.firstJump = null;
    player.jumps = 0;

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

},{}],11:[function(require,module,exports){
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
    this.load.spritesheet('dude', 'assets/img/Punk jam/double size sprite sheet punk 1.png', 61.8, 86);
    this.load.spritesheet('cop', 'assets/img/Punk jam/double size sprite sheet cop 1.png', 61.8, 86);
    this.load.image('bg', 'assets/img/longstreet.gif');
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
    console.log(canSpawnCopz.bind(this)(copz, wlvl));


    // lol
    // player.tint = Math.random() * 0xffffff;
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{"../modules/canSpawnCopz":4,"../modules/copMovement":5,"../modules/playerMovement":6,"../modules/wantedLevel":7,"../objects/cop":8,"../objects/floor":9,"../objects/player":10,"debounce":1}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb3BNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3BsYXllck1vdmVtZW50LmpzIiwic3JjL21vZHVsZXMvd2FudGVkTGV2ZWwuanMiLCJzcmMvb2JqZWN0cy9jb3AuanMiLCJzcmMvb2JqZWN0cy9mbG9vci5qcyIsInNyYy9vYmplY3RzL3BsYXllci5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgbm93ID0gcmVxdWlyZSgnZGF0ZS1ub3cnKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAqIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gKlxuICogQHNvdXJjZSB1bmRlcnNjb3JlLmpzXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSl7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgaWYgKG51bGwgPT0gd2FpdCkgd2FpdCA9IDEwMDtcblxuICBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IG5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXN0YW1wID0gbm93KCk7XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IG5vd1xuXG5mdW5jdGlvbiBub3coKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG59XG4iLCJjb25zb2xlLmxvZygnI3B1bmtqYW0nKTtcblxuLy8gR2FtZVxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoOTYwLCA1NDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpO1xuXG4vLyBTdGF0ZXNcbmdhbWUuc3RhdGUuYWRkKCdnYW1lJywgcmVxdWlyZSgnLi9zdGF0ZXMvZ2FtZScpKTtcblxuLy8gU3RhcnRcbmdhbWUuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcbiIsIi8vIGNhblNwYXduQ29wei5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb3B6LCB3YW50ZWRMZXZlbCkge1xuICAgIGlmICh3YW50ZWRMZXZlbCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIG1heENvcHogPSAod2FudGVkTGV2ZWwgPT09IDEpID9cbiAgICAgICAgICAgICAgICAgICAgNSA6ICh3YW50ZWRMZXZlbCA9PT0gMikgP1xuICAgICAgICAgICAgICAgICAgICAxMCA6ICh3YW50ZWRMZXZlbCA9PT0gMykgP1xuICAgICAgICAgICAgICAgICAgICAxNSA6ICh3YW50ZWRMZXZlbCA9PT0gNCkgP1xuICAgICAgICAgICAgICAgICAgICAyNSA6ICh3YW50ZWRMZXZlbCA9PT0gNSkgP1xuICAgICAgICAgICAgICAgICAgICA1MCA6ICh3YW50ZWRMZXZlbCA9PT0gNikgP1xuICAgICAgICAgICAgICAgICAgICAxMDAgOiAwO1xuXG4gICAgaWYgKGNvcHoubGVuZ3RoID49IG1heENvcHopIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIGNvcE1vdmVtZW50LmpzXG52YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBNQVhfU1BFRUQgPSAyNTAsXG4gICAgSlVNUF9WID0gMTAwMCxcbiAgICBBSVJfREVDRUwgPSAwLjMzLFxuICAgIEFJUl9EUkFHID0gMCxcbiAgICBGTE9PUl9EUkFHID0gNTAwMCoyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb3AsIHBsYXllcikge1xuXG4gICAgaWYgKCFwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQvMiwgY29wLm1heFNwZWVkICogMTApO1xuICAgIGVsc2UgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLCBjb3AubWF4U3BlZWQgKiAxMCk7XG5cbiAgICBpZiAocGxheWVyLmJvZHkueCA8IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSBsZWZ0XG4gICAgICAgIGNvcC5ib2R5LmFjY2VsZXJhdGlvbi54ID0gLU1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIGNvcC5zY2FsZS54ID0gLU1hdGguYWJzKGNvcC5zY2FsZS54KTtcbiAgICAgICAgY29wLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBsYXllci5ib2R5LnggPiBjb3AuYm9keS54KSB7XG4gICAgICAgIC8vIHBsYXllciBpcyB0byB0aGUgcmlnaHRcbiAgICAgICAgY29wLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBjb3Auc2NhbGUueCA9IE1hdGguYWJzKGNvcC5zY2FsZS54KTtcbiAgICAgICAgY29wLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgU3RhbmQgc3RpbGxcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IDA7XG4gICAgfVxuXG5cbn07XG4iLCJ2YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIsIGN1cnNvcnMpIHtcblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIGxlZnRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSAtTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcblxuICAgIH1cblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikge1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggKiBBSVJfREVDRUw7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oQUlSX0RSQUcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRkxPT1JfRFJBRywgMCk7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1NYXRoLmFicyhKVU1QX1YpO1xuICAgICAgICBwbGF5ZXIuanVtcHMrKztcbiAgICAgICAgaWYgKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkge1xuICAgICAgICAgICAgcGxheWVyLmZpcnN0SnVtcCA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG4iLCIvLyB3YW50ZWRMZXZlbC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIpIHtcblxuICAgIHZhciB3YW50ZWRMZXZlbCA9IDAsXG4gICAgdGltZVNpbmNlRmlyc3RKdW1wID0gKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkgPyAwIDogTWF0aC5mbG9vcigodGhpcy50aW1lLm5vdyAtIHBsYXllci5maXJzdEp1bXApLzEwMDApLFxuICAgIHRvdGFsSnVtcHMgPSBwbGF5ZXIuanVtcHM7XG5cbiAgICBpZiAodG90YWxKdW1wcyA+IDApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAxO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDI7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gMTUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAzO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDMwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDMwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNDtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiA0MCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiA0NSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDU7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTAwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDYwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2FudGVkTGV2ZWw7XG59O1xuIiwiLy8gY29wLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMjUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDAsXG4gICAgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNhbWVyYSkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gMzIqMjtcbiAgICB2YXIgY29wO1xuICAgIHZhciBzcGF3bkxvY2F0aW9ucyA9IFtdO1xuXG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5sZWZ0IC0gMzIsXG4gICAgICAgICAgICAtV09STERfT1ZFUkZMT1dcbiAgICAgICAgKVxuICAgICk7XG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5yaWdodCArIDMyLFxuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLndpZHRoK1dPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgY29wID0gdGhpcy5hZGQuc3ByaXRlKHNwYXduTG9jYXRpb25zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyKV0sIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCAnY29wJyk7XG4gICAgLy8gY29wLnNjYWxlLnNldFRvKDIpO1xuICAgIGNvcC5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgY29wLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgY29wXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoY29wKTtcblxuICAgIC8vICBjb3AgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICAvLyBjb3AuYm9keS5ib3VuY2UueSA9IDAuMjtcbiAgICBjb3AuYm9keS5ncmF2aXR5LnkgPSBHUkFWSVRZO1xuICAgIC8vIGNvcC5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG5cbiAgICBjb3AubWF4U3BlZWQgPSBNYXRoLm1pbihNQVhfU1BFRUQgKiAocGFyc2VGbG9hdCgoTWF0aC5yYW5kb20oKSAqIDEpLnRvRml4ZWQoMiksIDEwKSArIDAuNSksIDM0NSk7XG4gICAgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgY29wLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMCwgMV0sIDYsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cblxuICAgIHJldHVybiBjb3A7XG59O1xuIiwiLy8gZmxvb3IuanNcbnZhciBXT1JMRF9PVkVSRkxPVztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgV09STERfT1ZFUkZMT1cgPSB0aGlzLmNhY2hlLmdldEltYWdlKCdkdWRlJykud2lkdGgqMjtcbiAgICB2YXIgZmxvb3I7XG5cbiAgICBmbG9vciA9IHRoaXMuYWRkLnNwcml0ZSgtV09STERfT1ZFUkZMT1csIHRoaXMud29ybGQuaGVpZ2h0LTkwLCAnc3AnKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShmbG9vcik7XG4gICAgZmxvb3IuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuICAgIGZsb29yLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgZmxvb3Iud2lkdGggPSB0aGlzLndvcmxkLndpZHRoICsgV09STERfT1ZFUkZMT1c7XG5cbiAgICByZXR1cm4gZmxvb3I7XG59O1xuIiwiLy8gcGxheWVyLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gVGhlIHBsYXllciBhbmQgaXRzIHNldHRpbmdzXG4gICAgdmFyIHBsYXllcjtcbiAgICBwbGF5ZXIgPSB0aGlzLmFkZC5zcHJpdGUoMzIsIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCAnZHVkZScpO1xuICAgIC8vIHBsYXllci5zY2FsZS5zZXRUbygyKTtcbiAgICBwbGF5ZXIuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIHBsYXllci5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG5cbiAgICAvLyAgUGxheWVyIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gcGxheWVyLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgcGxheWVyLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgcGxheWVyLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oTUFYX1NQRUVELCBNQVhfU1BFRUQgKiAxMCk7XG4gICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMCwgMV0sIDYsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cbiAgICAvLyBtaXNjXG4gICAgcGxheWVyLmZpcnN0SnVtcCA9IG51bGw7XG4gICAgcGxheWVyLmp1bXBzID0gMDtcblxuICAgIC8vIGNhbWVyYVxuICAgIHRoaXMuY2FtZXJhLmZvbGxvdyhwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTik7XG4gICAgdGhpcy5jYW1lcmEuZGVhZHpvbmUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShcbiAgICAgICAgdGhpcy5nYW1lLndpZHRoLzIgLSBERUFEWk9ORV9XSURUSC8yLFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0LFxuICAgICAgICBERUFEWk9ORV9XSURUSCxcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodFxuICAgICk7XG5cbiAgICByZXR1cm4gcGxheWVyO1xufTtcbiIsIi8vIGdhbWUuanNcblxuLy8gRXh0ZXJuYWxcbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2RlYm91bmNlJyk7XG5cbi8vIENyZWF0ZVxudmFyIGNyZWF0ZVBsYXllciA9IHJlcXVpcmUoJy4uL29iamVjdHMvcGxheWVyJyksXG4gICAgY3JlYXRlQ29wICAgPSByZXF1aXJlKCcuLi9vYmplY3RzL2NvcCcpLFxuICAgIGNyZWF0ZUZsb29yID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9mbG9vcicpO1xuXG4vLyBVcGRhdGVcbnZhciBwbGF5ZXJNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcGxheWVyTW92ZW1lbnQnKSxcbiAgICBjb3BNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29wTW92ZW1lbnQnKSxcbiAgICB3YW50ZWRMZXZlbCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvd2FudGVkTGV2ZWwnKSxcbiAgICBjYW5TcGF3bkNvcHogPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NhblNwYXduQ29weicpO1xuXG4vLyBHbG9iYWxzXG5cbnZhciBwbGF5ZXIsIGZsb29yLCBjdXJzb3JzLCBjb3B6LFxuICAgIExBU1RfU1BBV04gPSAwLCBNQVhfQ09QWiA9IDIwMDtcblxuZnVuY3Rpb24gZ2FtZVByZWxvYWQgKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZHVkZScsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBwdW5rIDEucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IGNvcCAxLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvbG9uZ3N0cmVldC5naWYnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NwJywgJ2Fzc2V0cy9pbWcvc3BhY2VyLmdpZicpO1xufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcblxuICAgIC8vIGVuYWJsZSBwaHlzaWNzXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICAvLyB3b3JsZCBib3VuZHNcbiAgICB0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICB0aGlzLmFkZC50aWxlU3ByaXRlKDAsIDAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKS5zY2FsZS5zZXRUbygyLDIpO1xuXG4gICAgLy8gYWRkIGZsb29yXG4gICAgZmxvb3IgPSBjcmVhdGVGbG9vci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBhZGQgcGxheWVyXG4gICAgcGxheWVyID0gY3JlYXRlUGxheWVyLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGNvbnRyb2xzXG4gICAgY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG4gICAgLy8gY29welxuICAgIGNvcHogPSB0aGlzLmFkZC5ncm91cCgpO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKHRlc3QpIHtcbiAgICAvLyBDb2xsaXNpb25zXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShjb3B6LCBmbG9vcik7XG5cbiAgICAvLyBQbGF5ZXJcbiAgICBwbGF5ZXJNb3ZlbWVudC5iaW5kKHRoaXMpKHBsYXllciwgY3Vyc29ycyk7XG5cbiAgICAvLyBDb3B6XG4gICAgdmFyIHdsdmwgPSB3YW50ZWRMZXZlbC5iaW5kKHRoaXMpKHBsYXllcik7XG4gICAgaWYgKGNhblNwYXduQ29wei5iaW5kKHRoaXMpKGNvcHosIHdsdmwpKSB7XG4gICAgICAgIGlmICggKHRoaXMudGltZS5ub3cgLSBMQVNUX1NQQVdOKSA+IDEwMDAgKSB7XG4gICAgICAgICAgICBjb3B6LmFkZChjcmVhdGVDb3AuYmluZCh0aGlzKSh0aGlzLmNhbWVyYSkpO1xuICAgICAgICAgICAgTEFTVF9TUEFXTiA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgY29wTW92ZW1lbnQoY29wLCBwbGF5ZXIpO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGNhblNwYXduQ29wei5iaW5kKHRoaXMpKGNvcHosIHdsdmwpKTtcblxuXG4gICAgLy8gbG9sXG4gICAgLy8gcGxheWVyLnRpbnQgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlbG9hZDogZ2FtZVByZWxvYWQsXG4gICAgY3JlYXRlOiAgZ2FtZUNyZWF0ZSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIl19
