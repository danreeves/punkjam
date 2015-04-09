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

},{"./states/game":12}],4:[function(require,module,exports){
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
var DAMAGE = 10, KNOCKBACK = 1000, KNOCKUP = 250;

module.exports = function copAttack (cop, player, emitter) {

    var hit = false;

    if (player.body.x < cop.body.x) {
        // player is to the left
        if (Math.abs(Math.floor(cop.body.x) - Math.floor(player.body.x) < 10)
            && Math.floor(cop.body.y) === Math.floor(player.body.y)) {
            player.body.velocity.y = -KNOCKUP;
            player.body.velocity.x = -KNOCKBACK;
            player.health = player.health - DAMAGE;
            hit = true;
        }
    }
    else if (player.body.x > cop.body.x) {
        // player is to the right
        if (Math.abs(Math.floor(player.body.x) - Math.floor(cop.body.x) < 10)
            && Math.floor(cop.body.y) === Math.floor(player.body.y)) {
            player.body.velocity.y = -KNOCKUP;
            player.body.velocity.x = KNOCKBACK;
            player.health = player.health - DAMAGE;
            hit = true;
        }
    }

    return hit;

};

},{}],6:[function(require,module,exports){
// copMovement.js
var RUN_SPEED = 3500,
    MAX_SPEED = 250,
    JUMP_V = 1000,
    AIR_DECEL = 0.33,
    AIR_DRAG = 0,
    FLOOR_DRAG = 5000*2;

module.exports = function (cop, player) {

    if (!player.body.touching.down) cop.body.maxVelocity.setTo(cop.maxSpeed/3, cop.maxSpeed * 10);
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
        Math.max(
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

    spriteName = 'cop' + (Math.floor(Math.random() * 4) + 1).toString();
    cop = this.add.sprite(spawnLocations[Math.floor(Math.random()*2)], this.world.height - 200, spriteName);
    // cop.scale.setTo(2);
    cop.anchor.setTo(0.5,0.5);
    cop.smoothed = false;

    //  We need to enable physics on the cop
    this.physics.arcade.enable(cop);

    //  cop physics properties. Give the little guy a slight bounce.
    // cop.body.bounce.y = 0.2;
    cop.body.gravity.y = GRAVITY;
    // cop.body.collideWorldBounds = true;
    // (parseFloat((Math.random() * 1).toFixed(2), 10)
    var speeds = [50, 100, 150, 200, 250];
    cop.maxSpeed = Math.min(MAX_SPEED + speeds[Math.floor((Math.random() * 5))], 345);
    cop.body.maxVelocity.setTo(cop.maxSpeed, cop.maxSpeed * 10);
    cop.body.drag.setTo(DRAG, 0);

    //  Our two animations, walking left and right.
    cop.animations.add('run', [0, 1], Math.floor(Math.random() * 7) + 3, true);
    cop.animations.add('jump', [2], 1, true);
    cop.animations.add('idle', [3, 3, 4], 2, true);
    cop.animations.play('idle');


    return cop;
};

},{}],10:[function(require,module,exports){
// floor.js
var WORLD_OVERFLOW;

module.exports = function () {
    WORLD_OVERFLOW = this.cache.getImage('p1').width*2;
    var floor;

    floor = this.add.sprite(-WORLD_OVERFLOW, this.world.height-50, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width + WORLD_OVERFLOW;

    return floor;
};

},{}],11:[function(require,module,exports){
// player.js
var DEADZONE_WIDTH = 400,
    MAX_SPEED = 350,
    ACCELERATION = 1000,
    DRAG = 1000,
    GRAVITY = 2000;

module.exports = function () {

    // The player and its settings
    var player;
    spriteName = 'p' + (Math.floor(Math.random() * 4) + 1).toString();
    player = this.add.sprite(32, this.world.height - 200, spriteName);
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
    player.health = 100;

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

},{}],12:[function(require,module,exports){
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
    copAttack = require('../modules/copAttack'),
    wantedLevel = require('../modules/wantedLevel'),
    canSpawnCopz = require('../modules/canSpawnCopz');

// Globals

var player, floor, cursors, copz,
    LAST_SPAWN = 0, MAX_COPZ = 200, LAST_HIT = 0;

function particleBurst(emitter, player) {

    //  Position the emitter where the mouse/touch event was
    emitter.x = player.body.x + player.body.width/2;
    emitter.y = player.body.y + player.body.height/2;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    emitter.start(true, 500, null, 20);

}

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
    this.load.image('bl', 'assets/img/blood.gif');
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

    // emitter
    emitter = this.add.emitter(0, 0, 200);
    emitter.makeParticles('bl');
    emitter.gravity = 900;

    // add player
    player = createPlayer.bind(this)();

    // controls
    cursors = this.input.keyboard.createCursorKeys();

    // copz
    copz = this.add.group();

    // text
    wantedText = this.add.text(16, 16, 'Wanted Level: 0', { fontSize: '32px', fill: 'transparent' });
    wantedText.fixedToCamera = true;

    hpText = this.add.text(this.game.width - 100, 16, player.health, { fontSize: '32px', fill: '#f00' });
    hpText.fixedToCamera = true;
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
        if ( (this.time.now - LAST_SPAWN) > 333 ) {
            copz.add(createCop.bind(this)(this.camera));
            LAST_SPAWN = this.time.now;
        }
    }
    var game = this;
    copz.forEach(function (cop) {
        copMovement(cop, player);
        if ( (game.time.now - LAST_HIT) > 1000 ) {
            var hit = copAttack(cop, player, emitter);
            if (hit) {
                particleBurst(emitter, player);
                LAST_HIT = game.time.now;
            }
        }
    });

    if (player.jumps > 0) {
        wantedText.fill = '#fff';
        wantedText.text = 'Wanted level: ' + wlvl;
        hpText.text = player.health;
    }

    copz.forEach(function (cop) {
        if (cop.body.x < game.camera.view.left - 200 || cop.body.x > game.camera.view.right + 200 ) cop.destroy();
    });

    if (player.health < 1) this.state.start('game');


}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{"../modules/canSpawnCopz":4,"../modules/copAttack":5,"../modules/copMovement":6,"../modules/playerMovement":7,"../modules/wantedLevel":8,"../objects/cop":9,"../objects/floor":10,"../objects/player":11,"debounce":1}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb3BBdHRhY2suanMiLCJzcmMvbW9kdWxlcy9jb3BNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3BsYXllck1vdmVtZW50LmpzIiwic3JjL21vZHVsZXMvd2FudGVkTGV2ZWwuanMiLCJzcmMvb2JqZWN0cy9jb3AuanMiLCJzcmMvb2JqZWN0cy9mbG9vci5qcyIsInNyYy9vYmplY3RzL3BsYXllci5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBub3cgPSByZXF1aXJlKCdkYXRlLW5vdycpO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAqIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAqIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICogbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAqXG4gKiBAc291cmNlIHVuZGVyc2NvcmUuanNcbiAqIEBzZWUgaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIHRvIHdyYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGluIG1zIChgMTAwYClcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hldGhlciB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgKGBmYWxzZWApXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKXtcbiAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuICBpZiAobnVsbCA9PSB3YWl0KSB3YWl0ID0gMTAwO1xuXG4gIGZ1bmN0aW9uIGxhdGVyKCkge1xuICAgIHZhciBsYXN0ID0gbm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgY29udGV4dCA9IHRoaXM7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lc3RhbXAgPSBub3coKTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykge1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gRGF0ZS5ub3cgfHwgbm93XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbn1cbiIsImNvbnNvbGUubG9nKCcjcHVua2phbScpO1xuXG4vLyBHYW1lXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg5NjAsIDU0MCwgUGhhc2VyLkFVVE8sICdnYW1lJyk7XG5cbi8vIFN0YXRlc1xuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCByZXF1aXJlKCcuL3N0YXRlcy9nYW1lJykpO1xuXG4vLyBTdGFydFxuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuIiwiLy8gY2FuU3Bhd25Db3B6LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcHosIHdhbnRlZExldmVsKSB7XG4gICAgaWYgKHdhbnRlZExldmVsID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgbWF4Q29weiA9ICh3YW50ZWRMZXZlbCA9PT0gMSkgP1xuICAgICAgICAgICAgICAgICAgICA1IDogKHdhbnRlZExldmVsID09PSAyKSA/XG4gICAgICAgICAgICAgICAgICAgIDEwIDogKHdhbnRlZExldmVsID09PSAzKSA/XG4gICAgICAgICAgICAgICAgICAgIDE1IDogKHdhbnRlZExldmVsID09PSA0KSA/XG4gICAgICAgICAgICAgICAgICAgIDI1IDogKHdhbnRlZExldmVsID09PSA1KSA/XG4gICAgICAgICAgICAgICAgICAgIDUwIDogKHdhbnRlZExldmVsID09PSA2KSA/XG4gICAgICAgICAgICAgICAgICAgIDEwMCA6IDA7XG5cbiAgICBpZiAoY29wei5sZW5ndGggPj0gbWF4Q29weikgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuIiwidmFyIERBTUFHRSA9IDEwLCBLTk9DS0JBQ0sgPSAxMDAwLCBLTk9DS1VQID0gMjUwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvcEF0dGFjayAoY29wLCBwbGF5ZXIsIGVtaXR0ZXIpIHtcblxuICAgIHZhciBoaXQgPSBmYWxzZTtcblxuICAgIGlmIChwbGF5ZXIuYm9keS54IDwgY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIGxlZnRcbiAgICAgICAgaWYgKE1hdGguYWJzKE1hdGguZmxvb3IoY29wLmJvZHkueCkgLSBNYXRoLmZsb29yKHBsYXllci5ib2R5LngpIDwgMTApXG4gICAgICAgICAgICAmJiBNYXRoLmZsb29yKGNvcC5ib2R5LnkpID09PSBNYXRoLmZsb29yKHBsYXllci5ib2R5LnkpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLUtOT0NLVVA7XG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gLUtOT0NLQkFDSztcbiAgICAgICAgICAgIHBsYXllci5oZWFsdGggPSBwbGF5ZXIuaGVhbHRoIC0gREFNQUdFO1xuICAgICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChwbGF5ZXIuYm9keS54ID4gY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIHJpZ2h0XG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKHBsYXllci5ib2R5LngpIC0gTWF0aC5mbG9vcihjb3AuYm9keS54KSA8IDEwKVxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcihjb3AuYm9keS55KSA9PT0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS55KSkge1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1LTk9DS1VQO1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IEtOT0NLQkFDSztcbiAgICAgICAgICAgIHBsYXllci5oZWFsdGggPSBwbGF5ZXIuaGVhbHRoIC0gREFNQUdFO1xuICAgICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoaXQ7XG5cbn07XG4iLCIvLyBjb3BNb3ZlbWVudC5qc1xudmFyIFJVTl9TUEVFRCA9IDM1MDAsXG4gICAgTUFYX1NQRUVEID0gMjUwLFxuICAgIEpVTVBfViA9IDEwMDAsXG4gICAgQUlSX0RFQ0VMID0gMC4zMyxcbiAgICBBSVJfRFJBRyA9IDAsXG4gICAgRkxPT1JfRFJBRyA9IDUwMDAqMjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29wLCBwbGF5ZXIpIHtcblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLzMsIGNvcC5tYXhTcGVlZCAqIDEwKTtcbiAgICBlbHNlIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZCwgY29wLm1heFNwZWVkICogMTApO1xuXG4gICAgaWYgKHBsYXllci5ib2R5LnggPCBjb3AuYm9keS54KSB7XG4gICAgICAgIC8vIHBsYXllciBpcyB0byB0aGUgbGVmdFxuICAgICAgICBjb3AuYm9keS5hY2NlbGVyYXRpb24ueCA9IC1NYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBjb3Auc2NhbGUueCA9IC1NYXRoLmFicyhjb3Auc2NhbGUueCk7XG4gICAgICAgIGNvcC5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwbGF5ZXIuYm9keS54ID4gY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIHJpZ2h0XG4gICAgICAgIGNvcC5ib2R5LmFjY2VsZXJhdGlvbi54ID0gTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgY29wLnNjYWxlLnggPSBNYXRoLmFicyhjb3Auc2NhbGUueCk7XG4gICAgICAgIGNvcC5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gIFN0YW5kIHN0aWxsXG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAwO1xuICAgIH1cblxuXG59O1xuIiwidmFyIFJVTl9TUEVFRCA9IDM1MDAsXG4gICAgSlVNUF9WID0gMTAwMCxcbiAgICBBSVJfREVDRUwgPSAwLjMzLFxuICAgIEFJUl9EUkFHID0gMCxcbiAgICBGTE9PUl9EUkFHID0gNTAwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVyLCBjdXJzb3JzKSB7XG5cbiAgICBpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSBsZWZ0XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gLU1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIHBsYXllci5zY2FsZS54ID0gLU1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIHJpZ2h0XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSBNYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAvLyAgU3RhbmQgc3RpbGxcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IDA7XG5cbiAgICB9XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIHtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnanVtcCcpO1xuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ICogQUlSX0RFQ0VMO1xuICAgICAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKEFJUl9EUkFHLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKEZMT09SX0RSQUcsIDApO1xuICAgIH1cblxuICAgIC8vICBBbGxvdyB0aGUgcGxheWVyIHRvIGp1bXAgaWYgdGhleSBhcmUgdG91Y2hpbmcgdGhlIGdyb3VuZC5cbiAgICBpZiAoY3Vyc29ycy51cC5pc0Rvd24gJiYgcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bilcbiAgICB7XG4gICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtTWF0aC5hYnMoSlVNUF9WKTtcbiAgICAgICAgcGxheWVyLmp1bXBzKys7XG4gICAgICAgIGlmIChwbGF5ZXIuZmlyc3RKdW1wID09IG51bGwpIHtcbiAgICAgICAgICAgIHBsYXllci5maXJzdEp1bXAgPSB0aGlzLnRpbWUubm93O1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuIiwiLy8gd2FudGVkTGV2ZWwuanNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVyKSB7XG5cbiAgICB2YXIgd2FudGVkTGV2ZWwgPSAwLFxuICAgIHRpbWVTaW5jZUZpcnN0SnVtcCA9IChwbGF5ZXIuZmlyc3RKdW1wID09IG51bGwpID8gMCA6IE1hdGguZmxvb3IoKHRoaXMudGltZS5ub3cgLSBwbGF5ZXIuZmlyc3RKdW1wKS8xMDAwKSxcbiAgICB0b3RhbEp1bXBzID0gcGxheWVyLmp1bXBzO1xuXG4gICAgaWYgKHRvdGFsSnVtcHMgPiAwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMTtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiA1IHx8IHRpbWVTaW5jZUZpcnN0SnVtcCA+IDUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAyO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDE1IHx8IHRpbWVTaW5jZUZpcnN0SnVtcCA+IDE1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMztcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAzMCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiAzMCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDQ7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gNDAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gNDUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA1O1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDEwMCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiA2MCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdhbnRlZExldmVsO1xufTtcbiIsIi8vIGNvcC5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwLFxuICAgIFdPUkxEX09WRVJGTE9XO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjYW1lcmEpIHtcbiAgICBXT1JMRF9PVkVSRkxPVyA9IDMyKjI7XG4gICAgdmFyIGNvcDtcbiAgICB2YXIgc3Bhd25Mb2NhdGlvbnMgPSBbXTtcblxuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWF4KFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcubGVmdCAtIDMyLFxuICAgICAgICAgICAgLVdPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcucmlnaHQgKyAzMixcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC53aWR0aCtXT1JMRF9PVkVSRkxPV1xuICAgICAgICApXG4gICAgKTtcblxuICAgIHNwcml0ZU5hbWUgPSAnY29wJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpLnRvU3RyaW5nKCk7XG4gICAgY29wID0gdGhpcy5hZGQuc3ByaXRlKHNwYXduTG9jYXRpb25zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyKV0sIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCBzcHJpdGVOYW1lKTtcbiAgICAvLyBjb3Auc2NhbGUuc2V0VG8oMik7XG4gICAgY29wLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBjb3Auc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBjb3BcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShjb3ApO1xuXG4gICAgLy8gIGNvcCBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIGNvcC5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIGNvcC5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgLy8gY29wLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICAvLyAocGFyc2VGbG9hdCgoTWF0aC5yYW5kb20oKSAqIDEpLnRvRml4ZWQoMiksIDEwKVxuICAgIHZhciBzcGVlZHMgPSBbNTAsIDEwMCwgMTUwLCAyMDAsIDI1MF07XG4gICAgY29wLm1heFNwZWVkID0gTWF0aC5taW4oTUFYX1NQRUVEICsgc3BlZWRzW01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA1KSldLCAzNDUpO1xuICAgIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZCwgY29wLm1heFNwZWVkICogMTApO1xuICAgIGNvcC5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIGNvcC5hbmltYXRpb25zLmFkZCgncnVuJywgWzAsIDFdLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA3KSArIDMsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cblxuICAgIHJldHVybiBjb3A7XG59O1xuIiwiLy8gZmxvb3IuanNcbnZhciBXT1JMRF9PVkVSRkxPVztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgV09STERfT1ZFUkZMT1cgPSB0aGlzLmNhY2hlLmdldEltYWdlKCdwMScpLndpZHRoKjI7XG4gICAgdmFyIGZsb29yO1xuXG4gICAgZmxvb3IgPSB0aGlzLmFkZC5zcHJpdGUoLVdPUkxEX09WRVJGTE9XLCB0aGlzLndvcmxkLmhlaWdodC01MCwgJ3NwJyk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoZmxvb3IpO1xuICAgIGZsb29yLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbiAgICBmbG9vci5ib2R5LmFsbG93R3Jhdml0eSA9IGZhbHNlO1xuICAgIGZsb29yLndpZHRoID0gdGhpcy53b3JsZC53aWR0aCArIFdPUkxEX09WRVJGTE9XO1xuXG4gICAgcmV0dXJuIGZsb29yO1xufTtcbiIsIi8vIHBsYXllci5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHZhciBwbGF5ZXI7XG4gICAgc3ByaXRlTmFtZSA9ICdwJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpLnRvU3RyaW5nKCk7XG4gICAgcGxheWVyID0gdGhpcy5hZGQuc3ByaXRlKDMyLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgc3ByaXRlTmFtZSk7XG4gICAgLy8gcGxheWVyLnNjYWxlLnNldFRvKDIpO1xuICAgIHBsYXllci5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgcGxheWVyLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgcGxheWVyXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUocGxheWVyKTtcblxuICAgIC8vICBQbGF5ZXIgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICAvLyBwbGF5ZXIuYm9keS5ib3VuY2UueSA9IDAuMjtcbiAgICBwbGF5ZXIuYm9keS5ncmF2aXR5LnkgPSBHUkFWSVRZO1xuICAgIHBsYXllci5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG5cbiAgICBwbGF5ZXIuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhNQVhfU1BFRUQsIE1BWF9TUEVFRCAqIDEwKTtcbiAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKERSQUcsIDApO1xuXG4gICAgLy8gIE91ciB0d28gYW5pbWF0aW9ucywgd2Fsa2luZyBsZWZ0IGFuZCByaWdodC5cbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ3J1bicsIFswLCAxXSwgNiwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzJdLCAxLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnLCBbMywgMywgNF0sIDIsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcblxuICAgIC8vIG1pc2NcbiAgICBwbGF5ZXIuZmlyc3RKdW1wID0gbnVsbDtcbiAgICBwbGF5ZXIuanVtcHMgPSAwO1xuICAgIHBsYXllci5oZWFsdGggPSAxMDA7XG5cbiAgICAvLyBjYW1lcmFcbiAgICB0aGlzLmNhbWVyYS5mb2xsb3cocGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04pO1xuICAgIHRoaXMuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUoXG4gICAgICAgIHRoaXMuZ2FtZS53aWR0aC8yIC0gREVBRFpPTkVfV0lEVEgvMixcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodCxcbiAgICAgICAgREVBRFpPTkVfV0lEVEgsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHRcbiAgICApO1xuXG4gICAgcmV0dXJuIHBsYXllcjtcbn07XG4iLCIvLyBnYW1lLmpzXG5cbi8vIEV4dGVybmFsXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG4vLyBDcmVhdGVcbnZhciBjcmVhdGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL3BsYXllcicpLFxuICAgIGNyZWF0ZUNvcCAgID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb3AnKSxcbiAgICBjcmVhdGVGbG9vciA9IHJlcXVpcmUoJy4uL29iamVjdHMvZmxvb3InKTtcblxuLy8gVXBkYXRlXG52YXIgcGxheWVyTW92ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3BsYXllck1vdmVtZW50JyksXG4gICAgY29wTW92ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcE1vdmVtZW50JyksXG4gICAgY29wQXR0YWNrID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3BBdHRhY2snKSxcbiAgICB3YW50ZWRMZXZlbCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvd2FudGVkTGV2ZWwnKSxcbiAgICBjYW5TcGF3bkNvcHogPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NhblNwYXduQ29weicpO1xuXG4vLyBHbG9iYWxzXG5cbnZhciBwbGF5ZXIsIGZsb29yLCBjdXJzb3JzLCBjb3B6LFxuICAgIExBU1RfU1BBV04gPSAwLCBNQVhfQ09QWiA9IDIwMCwgTEFTVF9ISVQgPSAwO1xuXG5mdW5jdGlvbiBwYXJ0aWNsZUJ1cnN0KGVtaXR0ZXIsIHBsYXllcikge1xuXG4gICAgLy8gIFBvc2l0aW9uIHRoZSBlbWl0dGVyIHdoZXJlIHRoZSBtb3VzZS90b3VjaCBldmVudCB3YXNcbiAgICBlbWl0dGVyLnggPSBwbGF5ZXIuYm9keS54ICsgcGxheWVyLmJvZHkud2lkdGgvMjtcbiAgICBlbWl0dGVyLnkgPSBwbGF5ZXIuYm9keS55ICsgcGxheWVyLmJvZHkuaGVpZ2h0LzI7XG5cbiAgICAvLyAgVGhlIGZpcnN0IHBhcmFtZXRlciBzZXRzIHRoZSBlZmZlY3QgdG8gXCJleHBsb2RlXCIgd2hpY2ggbWVhbnMgYWxsIHBhcnRpY2xlcyBhcmUgZW1pdHRlZCBhdCBvbmNlXG4gICAgLy8gIFRoZSBzZWNvbmQgZ2l2ZXMgZWFjaCBwYXJ0aWNsZSBhIDIwMDBtcyBsaWZlc3BhblxuICAgIC8vICBUaGUgdGhpcmQgaXMgaWdub3JlZCB3aGVuIHVzaW5nIGJ1cnN0L2V4cGxvZGUgbW9kZVxuICAgIC8vICBUaGUgZmluYWwgcGFyYW1ldGVyICgxMCkgaXMgaG93IG1hbnkgcGFydGljbGVzIHdpbGwgYmUgZW1pdHRlZCBpbiB0aGlzIHNpbmdsZSBidXJzdFxuICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAyMCk7XG5cbn1cblxuZnVuY3Rpb24gZ2FtZVByZWxvYWQgKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDEnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgcHVuayAxLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AyJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IHB1bmsgMi5wbmcnLCA2MS44LCA4Nik7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdwMycsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBwdW5rIDMucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDQnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgcHVuayA0LnBuZycsIDYxLjgsIDg2KTtcblxuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMScsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBjb3AgMS5wbmcnLCA2MS44LCA4Nik7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AyJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IGNvcCAyLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDMnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgY29wIDMucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wNCcsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBjb3AgNC5wbmcnLCA2MS44LCA4Nik7XG5cbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vQ2l0eSBiYWNrZHJvcCBjeWNsZSBjb3B5LnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnYmdiZycsICdhc3NldHMvaW1nL1B1bmsgamFtL0NpdHkgQmFja2Ryb3Agc2lsaG91ZXR0ZSBjb3B5LnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnc3AnLCAnYXNzZXRzL2ltZy9zcGFjZXIuZ2lmJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdibCcsICdhc3NldHMvaW1nL2Jsb29kLmdpZicpO1xufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcblxuICAgIC8vIGVuYWJsZSBwaHlzaWNzXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICAvLyB3b3JsZCBib3VuZHNcbiAgICB0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICAvLyB0aGlzLmFkZC50aWxlU3ByaXRlKDAsIC05MCwgdGhpcy5nYW1lLndpZHRoLCA1NDAsICdiZ2JnJykuc2NhbGUuc2V0VG8oMik7XG4gICAgdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtOTAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgqMiwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS5oZWlnaHQsICdiZycpO1xuXG4gICAgLy8gYWRkIGZsb29yXG4gICAgZmxvb3IgPSBjcmVhdGVGbG9vci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBlbWl0dGVyXG4gICAgZW1pdHRlciA9IHRoaXMuYWRkLmVtaXR0ZXIoMCwgMCwgMjAwKTtcbiAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ2JsJyk7XG4gICAgZW1pdHRlci5ncmF2aXR5ID0gOTAwO1xuXG4gICAgLy8gYWRkIHBsYXllclxuICAgIHBsYXllciA9IGNyZWF0ZVBsYXllci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBjb250cm9sc1xuICAgIGN1cnNvcnMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcblxuICAgIC8vIGNvcHpcbiAgICBjb3B6ID0gdGhpcy5hZGQuZ3JvdXAoKTtcblxuICAgIC8vIHRleHRcbiAgICB3YW50ZWRUZXh0ID0gdGhpcy5hZGQudGV4dCgxNiwgMTYsICdXYW50ZWQgTGV2ZWw6IDAnLCB7IGZvbnRTaXplOiAnMzJweCcsIGZpbGw6ICd0cmFuc3BhcmVudCcgfSk7XG4gICAgd2FudGVkVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIGhwVGV4dCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoIC0gMTAwLCAxNiwgcGxheWVyLmhlYWx0aCwgeyBmb250U2l6ZTogJzMycHgnLCBmaWxsOiAnI2YwMCcgfSk7XG4gICAgaHBUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBnYW1lVXBkYXRlICh0ZXN0KSB7XG5cbiAgICAvLyBDb2xsaXNpb25zXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShjb3B6LCBmbG9vcik7XG5cbiAgICAvLyBQbGF5ZXJcbiAgICBwbGF5ZXJNb3ZlbWVudC5iaW5kKHRoaXMpKHBsYXllciwgY3Vyc29ycyk7XG5cbiAgICAvLyBDb3B6XG4gICAgdmFyIHdsdmwgPSB3YW50ZWRMZXZlbC5iaW5kKHRoaXMpKHBsYXllcik7XG4gICAgaWYgKGNhblNwYXduQ29wei5iaW5kKHRoaXMpKGNvcHosIHdsdmwpKSB7XG4gICAgICAgIGlmICggKHRoaXMudGltZS5ub3cgLSBMQVNUX1NQQVdOKSA+IDMzMyApIHtcbiAgICAgICAgICAgIGNvcHouYWRkKGNyZWF0ZUNvcC5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgICAgICAgICBMQVNUX1NQQVdOID0gdGhpcy50aW1lLm5vdztcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgZ2FtZSA9IHRoaXM7XG4gICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgY29wTW92ZW1lbnQoY29wLCBwbGF5ZXIpO1xuICAgICAgICBpZiAoIChnYW1lLnRpbWUubm93IC0gTEFTVF9ISVQpID4gMTAwMCApIHtcbiAgICAgICAgICAgIHZhciBoaXQgPSBjb3BBdHRhY2soY29wLCBwbGF5ZXIsIGVtaXR0ZXIpO1xuICAgICAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlQnVyc3QoZW1pdHRlciwgcGxheWVyKTtcbiAgICAgICAgICAgICAgICBMQVNUX0hJVCA9IGdhbWUudGltZS5ub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuanVtcHMgPiAwKSB7XG4gICAgICAgIHdhbnRlZFRleHQuZmlsbCA9ICcjZmZmJztcbiAgICAgICAgd2FudGVkVGV4dC50ZXh0ID0gJ1dhbnRlZCBsZXZlbDogJyArIHdsdmw7XG4gICAgICAgIGhwVGV4dC50ZXh0ID0gcGxheWVyLmhlYWx0aDtcbiAgICB9XG5cbiAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICBpZiAoY29wLmJvZHkueCA8IGdhbWUuY2FtZXJhLnZpZXcubGVmdCAtIDIwMCB8fCBjb3AuYm9keS54ID4gZ2FtZS5jYW1lcmEudmlldy5yaWdodCArIDIwMCApIGNvcC5kZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICBpZiAocGxheWVyLmhlYWx0aCA8IDEpIHRoaXMuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcblxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlbG9hZDogZ2FtZVByZWxvYWQsXG4gICAgY3JlYXRlOiAgZ2FtZUNyZWF0ZSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIl19
