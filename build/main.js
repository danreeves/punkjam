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

},{"./states/game":14}],4:[function(require,module,exports){
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
'use strict';

module.exports = function collect (player, coin) {
    this.sounds[1].play();
    player.score++;
    coin.destroy();
}

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function createCoin (camera,setx,sety) {

    var x = Math.floor( (Math.random() * camera.view.right - 150) + camera.view.left + 150 );
    var y = Math.floor( (Math.random() * 300) + 150 );
    var coin = this.add.sprite(setx || x, sety || y, 'coin');
    coin.scale.setTo(0.1);

    return coin;
}

},{}],11:[function(require,module,exports){
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
    cop.body.setSize(25,50,-2.5,6);

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

},{}],12:[function(require,module,exports){
// floor.js
var WORLD_OVERFLOW;

module.exports = function () {
    WORLD_OVERFLOW = this.cache.getImage('p1').width*2;
    var floor;

    floor = this.add.sprite(-WORLD_OVERFLOW, this.world.height-60, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width + WORLD_OVERFLOW;

    return floor;
};

},{}],13:[function(require,module,exports){
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
    player.body.setSize(25,50,-2.5,6);

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
    player.score = 0;

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

},{}],14:[function(require,module,exports){
// game.js

// External
var debounce = require('debounce');

// Create
var createPlayer = require('../objects/player'),
    createCop   = require('../objects/cop'),
    createCoin = require('../objects/coin'),
    createFloor = require('../objects/floor');

// Update
var playerMovement = require('../modules/playerMovement'),
    copMovement = require('../modules/copMovement'),
    copAttack = require('../modules/copAttack'),
    wantedLevel = require('../modules/wantedLevel'),
    collectCoin = require('../modules/collect'),
    canSpawnCopz = require('../modules/canSpawnCopz');

// Globals

var player, floor, cursors, copz,
    LAST_SPAWN = 0, MAX_COPZ = 200, LAST_HIT = 0
    MAX_COINZ = 1;

function particleBurst(emitter, player) {

    //  Position the emitter where the mouse/touch event was
    emitter.x = player.body.x + player.body.width/2;
    emitter.y = player.body.y + player.body.height/2;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    emitter.start(true, 50000000, null, 100);

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

    this.load.image('coin', 'assets/img/Punk jam/anarchy coin 2.png');

    this.load.image('bg', 'assets/img/Punk jam/City backdrop cycle copy.png');
    this.load.image('bgbg', 'assets/img/Punk jam/City Backdrop silhouette copy.png');
    this.load.image('sp', 'assets/img/spacer.gif');
    this.load.image('bl', 'assets/img/blood.gif');


    // this.load.audio('intro', 'assets/sound/intro.mp3');
    this.load.audio('punkLoop', 'assets/sound/punkloop.mp3');
    this.load.audio('pickup', 'assets/sound/alright.mp3');
    this.load.audio('grunt1', 'assets/sound/grunt1.mp3');
    this.load.audio('grunt2', 'assets/sound/grunt2.mp3');

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
    emitter = this.add.emitter(0, 0, 2000);
    emitter.makeParticles('bl');
    emitter.gravity = 900;

    // add player
    player = createPlayer.bind(this)();

    // controls
    cursors = this.input.keyboard.createCursorKeys();

    // copz
    copz = this.add.group();

    // coinz
    coinz = this.add.group();
    coinz.enableBody = true;
    coinz.add(createCoin.bind(this)(this.camera, 250, 250));

    // text
    wantedText = this.add.text(16, 16, 'Wanted Level: 0', { fontSize: '32px', fill: 'transparent' });
    wantedText.fixedToCamera = true;

    hpText = this.add.text(this.game.width - 100, 16, player.health, { fontSize: '32px', fill: '#f00' });
    hpText.fixedToCamera = true;

    scoreText = this.add.text(300, 16, 'Score: 0', { fontSize: '32px', fill: '#ff0' });
    scoreText.fixedToCamera = true;

    // Sound
    // var intro = this.add.audio('intro');
    var punkLoop = this.add.audio('punkLoop');
    var pickup = this.add.audio('pickup');
    var grunt1 = this.add.audio('grunt1');
    var grunt2 = this.add.audio('grunt2');
    this.sounds = [punkLoop, pickup, grunt1, grunt2];
    //  Being mp3 files these take time to decode, so we can't play them instantly
    //  Using setDecodedCallback we can be notified when they're ALL ready for use.
    //  The audio files could decode in ANY order, we can never be sure which it'll be.
    // this.sounds.forEach(function (v) {
    //     v.stop();
    // });
    // this.sound.setDecodedCallback(this.sounds, function start() {


        // this.sounds[1].stop();
        // punkLoop.loopFull(0);

    // }, this);

}


function gameUpdate (test) {
if (!this.sounds[0].isPlaying) this.sounds[0].loopFull(1);
    // Collisions
    this.physics.arcade.collide(player, floor);
    this.physics.arcade.collide(copz, floor);
    this.physics.arcade.collide(emitter, floor, function (a,b) {
        a.body.velocity.x = a.body.velocity.y = 0;
        b.body.velocity.x = b.body.velocity.y = 0;
    });
    this.physics.arcade.overlap(player, coinz, collectCoin, null, this);

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
                game.sounds[Math.floor((Math.random() * 2) + 2)].play();
                LAST_HIT = game.time.now;
            }
        }
    });

    if (player.jumps > 0) {
        wantedText.fill = '#fff';
        wantedText.text = 'Wanted level: ' + wlvl;
        hpText.text = player.health;

        // if (this.sounds[1].volume !== 1) {
        //     this.sounds[0].fadeOut(1000);
        //     this.sounds[1].loopFull(1);
        // }
    }
    scoreText.text = 'Score: ' + player.score;

    copz.forEach(function (cop) {
        if (cop.body.x < game.camera.view.left - 200 || cop.body.x > game.camera.view.right + 200 ) cop.destroy();
    });

    if (coinz.length < wlvl) {
        coinz.add(createCoin.bind(this)(this.camera));
    }

    if (player.health < 1) {
        this.sound.stopAll();
        this.state.start('game');
    }



}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    render: function () {
        if (window.location.search.search('debug') > -1) {
            this.game.time.advancedTiming = true;
            this.game.debug.body(player);
            copz.forEach(function (cop) {
                this.game.debug.body(cop);
            }, this, true);
            this.game.debug.text(this.game.time.fps +' fps' || '--', 2, 14, "#00ff00");
        }
    },
    update:  gameUpdate
};

},{"../modules/canSpawnCopz":4,"../modules/collect":5,"../modules/copAttack":6,"../modules/copMovement":7,"../modules/playerMovement":8,"../modules/wantedLevel":9,"../objects/coin":10,"../objects/cop":11,"../objects/floor":12,"../objects/player":13,"debounce":1}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb2xsZWN0LmpzIiwic3JjL21vZHVsZXMvY29wQXR0YWNrLmpzIiwic3JjL21vZHVsZXMvY29wTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3dhbnRlZExldmVsLmpzIiwic3JjL29iamVjdHMvY29pbi5qcyIsInNyYy9vYmplY3RzL2NvcC5qcyIsInNyYy9vYmplY3RzL2Zsb29yLmpzIiwic3JjL29iamVjdHMvcGxheWVyLmpzIiwic3JjL3N0YXRlcy9nYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBub3cgPSByZXF1aXJlKCdkYXRlLW5vdycpO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAqIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAqIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICogbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAqXG4gKiBAc291cmNlIHVuZGVyc2NvcmUuanNcbiAqIEBzZWUgaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIHRvIHdyYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGluIG1zIChgMTAwYClcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hldGhlciB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgKGBmYWxzZWApXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKXtcbiAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuICBpZiAobnVsbCA9PSB3YWl0KSB3YWl0ID0gMTAwO1xuXG4gIGZ1bmN0aW9uIGxhdGVyKCkge1xuICAgIHZhciBsYXN0ID0gbm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgY29udGV4dCA9IHRoaXM7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lc3RhbXAgPSBub3coKTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykge1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gRGF0ZS5ub3cgfHwgbm93XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbn1cbiIsImNvbnNvbGUubG9nKCcjcHVua2phbScpO1xuXG4vLyBHYW1lXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg5NjAsIDU0MCwgUGhhc2VyLkFVVE8sICdnYW1lJyk7XG5cbi8vIFN0YXRlc1xuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCByZXF1aXJlKCcuL3N0YXRlcy9nYW1lJykpO1xuXG4vLyBTdGFydFxuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuIiwiLy8gY2FuU3Bhd25Db3B6LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcHosIHdhbnRlZExldmVsKSB7XG4gICAgaWYgKHdhbnRlZExldmVsID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgbWF4Q29weiA9ICh3YW50ZWRMZXZlbCA9PT0gMSkgP1xuICAgICAgICAgICAgICAgICAgICA1IDogKHdhbnRlZExldmVsID09PSAyKSA/XG4gICAgICAgICAgICAgICAgICAgIDEwIDogKHdhbnRlZExldmVsID09PSAzKSA/XG4gICAgICAgICAgICAgICAgICAgIDE1IDogKHdhbnRlZExldmVsID09PSA0KSA/XG4gICAgICAgICAgICAgICAgICAgIDI1IDogKHdhbnRlZExldmVsID09PSA1KSA/XG4gICAgICAgICAgICAgICAgICAgIDUwIDogKHdhbnRlZExldmVsID09PSA2KSA/XG4gICAgICAgICAgICAgICAgICAgIDEwMCA6IDA7XG5cbiAgICBpZiAoY29wei5sZW5ndGggPj0gbWF4Q29weikgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbGxlY3QgKHBsYXllciwgY29pbikge1xuICAgIHRoaXMuc291bmRzWzFdLnBsYXkoKTtcbiAgICBwbGF5ZXIuc2NvcmUrKztcbiAgICBjb2luLmRlc3Ryb3koKTtcbn1cbiIsInZhciBEQU1BR0UgPSAxMCwgS05PQ0tCQUNLID0gMTAwMCwgS05PQ0tVUCA9IDI1MDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3BBdHRhY2sgKGNvcCwgcGxheWVyLCBlbWl0dGVyKSB7XG5cbiAgICB2YXIgaGl0ID0gZmFsc2U7XG5cbiAgICBpZiAocGxheWVyLmJvZHkueCA8IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSBsZWZ0XG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKGNvcC5ib2R5LngpIC0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSA8IDEwKVxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcihjb3AuYm9keS55KSA9PT0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS55KSkge1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1LTk9DS1VQO1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC1LTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSAtIE1hdGguZmxvb3IoY29wLmJvZHkueCkgPCAxMClcbiAgICAgICAgICAgICYmIE1hdGguZmxvb3IoY29wLmJvZHkueSkgPT09IE1hdGguZmxvb3IocGxheWVyLmJvZHkueSkpIHtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtS05PQ0tVUDtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSBLTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGl0O1xuXG59O1xuIiwiLy8gY29wTW92ZW1lbnQuanNcbnZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIE1BWF9TUEVFRCA9IDI1MCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwKjI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcCwgcGxheWVyKSB7XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZC8zLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgZWxzZSBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQsIGNvcC5tYXhTcGVlZCAqIDEwKTtcblxuICAgIGlmIChwbGF5ZXIuYm9keS54IDwgY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIGxlZnRcbiAgICAgICAgY29wLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgY29wLnNjYWxlLnggPSAtTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBjb3AuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIGNvcC5zY2FsZS54ID0gTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcbiAgICB9XG5cblxufTtcbiIsInZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIEpVTVBfViA9IDEwMDAsXG4gICAgQUlSX0RFQ0VMID0gMC4zMyxcbiAgICBBSVJfRFJBRyA9IDAsXG4gICAgRkxPT1JfRFJBRyA9IDUwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllciwgY3Vyc29ycykge1xuXG4gICAgaWYgKGN1cnNvcnMubGVmdC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgbGVmdFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IC1NYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IC1NYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSByaWdodFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIHBsYXllci5zY2FsZS54ID0gTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgLy8gIFN0YW5kIHN0aWxsXG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAwO1xuXG4gICAgfVxuXG4gICAgaWYgKCFwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSB7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2p1bXAnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCAqIEFJUl9ERUNFTDtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhBSVJfRFJBRywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhGTE9PUl9EUkFHLCAwKTtcbiAgICB9XG5cbiAgICAvLyAgQWxsb3cgdGhlIHBsYXllciB0byBqdW1wIGlmIHRoZXkgYXJlIHRvdWNoaW5nIHRoZSBncm91bmQuXG4gICAgaWYgKGN1cnNvcnMudXAuaXNEb3duICYmIHBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLU1hdGguYWJzKEpVTVBfVik7XG4gICAgICAgIHBsYXllci5qdW1wcysrO1xuICAgICAgICBpZiAocGxheWVyLmZpcnN0SnVtcCA9PSBudWxsKSB7XG4gICAgICAgICAgICBwbGF5ZXIuZmlyc3RKdW1wID0gdGhpcy50aW1lLm5vdztcbiAgICAgICAgfVxuICAgIH1cblxufTtcbiIsIi8vIHdhbnRlZExldmVsLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllcikge1xuXG4gICAgdmFyIHdhbnRlZExldmVsID0gMCxcbiAgICB0aW1lU2luY2VGaXJzdEp1bXAgPSAocGxheWVyLmZpcnN0SnVtcCA9PSBudWxsKSA/IDAgOiBNYXRoLmZsb29yKCh0aGlzLnRpbWUubm93IC0gcGxheWVyLmZpcnN0SnVtcCkvMTAwMCksXG4gICAgdG90YWxKdW1wcyA9IHBsYXllci5qdW1wcztcblxuICAgIGlmICh0b3RhbEp1bXBzID4gMCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDE7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gNSB8fCB0aW1lU2luY2VGaXJzdEp1bXAgPiA1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMjtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAxNSB8fCB0aW1lU2luY2VGaXJzdEp1bXAgPiAxNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDM7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMzAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gMzApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA0O1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDQwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDQ1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNTtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAxMDAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gNjApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA2O1xuICAgIH1cblxuICAgIHJldHVybiB3YW50ZWRMZXZlbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQ29pbiAoY2FtZXJhLHNldHgsc2V0eSkge1xuXG4gICAgdmFyIHggPSBNYXRoLmZsb29yKCAoTWF0aC5yYW5kb20oKSAqIGNhbWVyYS52aWV3LnJpZ2h0IC0gMTUwKSArIGNhbWVyYS52aWV3LmxlZnQgKyAxNTAgKTtcbiAgICB2YXIgeSA9IE1hdGguZmxvb3IoIChNYXRoLnJhbmRvbSgpICogMzAwKSArIDE1MCApO1xuICAgIHZhciBjb2luID0gdGhpcy5hZGQuc3ByaXRlKHNldHggfHwgeCwgc2V0eSB8fCB5LCAnY29pbicpO1xuICAgIGNvaW4uc2NhbGUuc2V0VG8oMC4xKTtcblxuICAgIHJldHVybiBjb2luO1xufVxuIiwiLy8gY29wLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDAsXG4gICAgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNhbWVyYSkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gMzIqMjtcbiAgICB2YXIgY29wO1xuICAgIHZhciBzcGF3bkxvY2F0aW9ucyA9IFtdO1xuXG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICBjYW1lcmEudmlldy5sZWZ0IC0gMzIsXG4gICAgICAgICAgICAtV09STERfT1ZFUkZMT1dcbiAgICAgICAgKVxuICAgICk7XG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5yaWdodCArIDMyLFxuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLndpZHRoK1dPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgc3ByaXRlTmFtZSA9ICdjb3AnICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICsgMSkudG9TdHJpbmcoKTtcbiAgICBjb3AgPSB0aGlzLmFkZC5zcHJpdGUoc3Bhd25Mb2NhdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjIpXSwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsIHNwcml0ZU5hbWUpO1xuICAgIC8vIGNvcC5zY2FsZS5zZXRUbygyKTtcbiAgICBjb3AuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIGNvcC5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIGNvcFxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGNvcCk7XG4gICAgY29wLmJvZHkuc2V0U2l6ZSgyNSw1MCwtMi41LDYpO1xuXG4gICAgLy8gIGNvcCBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIGNvcC5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIGNvcC5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgLy8gY29wLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICAvLyAocGFyc2VGbG9hdCgoTWF0aC5yYW5kb20oKSAqIDEpLnRvRml4ZWQoMiksIDEwKVxuICAgIHZhciBzcGVlZHMgPSBbNTAsIDEwMCwgMTUwLCAyMDAsIDI1MF07XG4gICAgY29wLm1heFNwZWVkID0gTWF0aC5taW4oTUFYX1NQRUVEICsgc3BlZWRzW01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA1KSldLCAzNDUpO1xuICAgIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZCwgY29wLm1heFNwZWVkICogMTApO1xuICAgIGNvcC5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIGNvcC5hbmltYXRpb25zLmFkZCgncnVuJywgWzAsIDFdLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA3KSArIDMsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cblxuICAgIHJldHVybiBjb3A7XG59O1xuIiwiLy8gZmxvb3IuanNcbnZhciBXT1JMRF9PVkVSRkxPVztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgV09STERfT1ZFUkZMT1cgPSB0aGlzLmNhY2hlLmdldEltYWdlKCdwMScpLndpZHRoKjI7XG4gICAgdmFyIGZsb29yO1xuXG4gICAgZmxvb3IgPSB0aGlzLmFkZC5zcHJpdGUoLVdPUkxEX09WRVJGTE9XLCB0aGlzLndvcmxkLmhlaWdodC02MCwgJ3NwJyk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoZmxvb3IpO1xuICAgIGZsb29yLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbiAgICBmbG9vci5ib2R5LmFsbG93R3Jhdml0eSA9IGZhbHNlO1xuICAgIGZsb29yLndpZHRoID0gdGhpcy53b3JsZC53aWR0aCArIFdPUkxEX09WRVJGTE9XO1xuXG4gICAgcmV0dXJuIGZsb29yO1xufTtcbiIsIi8vIHBsYXllci5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHZhciBwbGF5ZXI7XG4gICAgc3ByaXRlTmFtZSA9ICdwJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpLnRvU3RyaW5nKCk7XG4gICAgcGxheWVyID0gdGhpcy5hZGQuc3ByaXRlKDMyLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgc3ByaXRlTmFtZSk7XG4gICAgLy8gcGxheWVyLnNjYWxlLnNldFRvKDIpO1xuICAgIHBsYXllci5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgcGxheWVyLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgcGxheWVyXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUocGxheWVyKTtcbiAgICBwbGF5ZXIuYm9keS5zZXRTaXplKDI1LDUwLC0yLjUsNik7XG5cbiAgICAvLyAgUGxheWVyIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gcGxheWVyLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgcGxheWVyLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgcGxheWVyLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oTUFYX1NQRUVELCBNQVhfU1BFRUQgKiAxMCk7XG4gICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMCwgMV0sIDYsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cbiAgICAvLyBtaXNjXG4gICAgcGxheWVyLmZpcnN0SnVtcCA9IG51bGw7XG4gICAgcGxheWVyLmp1bXBzID0gMDtcbiAgICBwbGF5ZXIuaGVhbHRoID0gMTAwO1xuICAgIHBsYXllci5zY29yZSA9IDA7XG5cbiAgICAvLyBjYW1lcmFcbiAgICB0aGlzLmNhbWVyYS5mb2xsb3cocGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04pO1xuICAgIHRoaXMuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUoXG4gICAgICAgIHRoaXMuZ2FtZS53aWR0aC8yIC0gREVBRFpPTkVfV0lEVEgvMixcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodCxcbiAgICAgICAgREVBRFpPTkVfV0lEVEgsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHRcbiAgICApO1xuXG4gICAgcmV0dXJuIHBsYXllcjtcbn07XG4iLCIvLyBnYW1lLmpzXG5cbi8vIEV4dGVybmFsXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG4vLyBDcmVhdGVcbnZhciBjcmVhdGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL3BsYXllcicpLFxuICAgIGNyZWF0ZUNvcCAgID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb3AnKSxcbiAgICBjcmVhdGVDb2luID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb2luJyksXG4gICAgY3JlYXRlRmxvb3IgPSByZXF1aXJlKCcuLi9vYmplY3RzL2Zsb29yJyk7XG5cbi8vIFVwZGF0ZVxudmFyIHBsYXllck1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudCcpLFxuICAgIGNvcE1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3BNb3ZlbWVudCcpLFxuICAgIGNvcEF0dGFjayA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29wQXR0YWNrJyksXG4gICAgd2FudGVkTGV2ZWwgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3dhbnRlZExldmVsJyksXG4gICAgY29sbGVjdENvaW4gPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvbGxlY3QnKSxcbiAgICBjYW5TcGF3bkNvcHogPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NhblNwYXduQ29weicpO1xuXG4vLyBHbG9iYWxzXG5cbnZhciBwbGF5ZXIsIGZsb29yLCBjdXJzb3JzLCBjb3B6LFxuICAgIExBU1RfU1BBV04gPSAwLCBNQVhfQ09QWiA9IDIwMCwgTEFTVF9ISVQgPSAwXG4gICAgTUFYX0NPSU5aID0gMTtcblxuZnVuY3Rpb24gcGFydGljbGVCdXJzdChlbWl0dGVyLCBwbGF5ZXIpIHtcblxuICAgIC8vICBQb3NpdGlvbiB0aGUgZW1pdHRlciB3aGVyZSB0aGUgbW91c2UvdG91Y2ggZXZlbnQgd2FzXG4gICAgZW1pdHRlci54ID0gcGxheWVyLmJvZHkueCArIHBsYXllci5ib2R5LndpZHRoLzI7XG4gICAgZW1pdHRlci55ID0gcGxheWVyLmJvZHkueSArIHBsYXllci5ib2R5LmhlaWdodC8yO1xuXG4gICAgLy8gIFRoZSBmaXJzdCBwYXJhbWV0ZXIgc2V0cyB0aGUgZWZmZWN0IHRvIFwiZXhwbG9kZVwiIHdoaWNoIG1lYW5zIGFsbCBwYXJ0aWNsZXMgYXJlIGVtaXR0ZWQgYXQgb25jZVxuICAgIC8vICBUaGUgc2Vjb25kIGdpdmVzIGVhY2ggcGFydGljbGUgYSAyMDAwbXMgbGlmZXNwYW5cbiAgICAvLyAgVGhlIHRoaXJkIGlzIGlnbm9yZWQgd2hlbiB1c2luZyBidXJzdC9leHBsb2RlIG1vZGVcbiAgICAvLyAgVGhlIGZpbmFsIHBhcmFtZXRlciAoMTApIGlzIGhvdyBtYW55IHBhcnRpY2xlcyB3aWxsIGJlIGVtaXR0ZWQgaW4gdGhpcyBzaW5nbGUgYnVyc3RcbiAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMDAwMDAwLCBudWxsLCAxMDApO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVQcmVsb2FkICgpIHtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AxJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IHB1bmsgMS5wbmcnLCA2MS44LCA4Nik7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdwMicsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBwdW5rIDIucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDMnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgcHVuayAzLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3A0JywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IHB1bmsgNC5wbmcnLCA2MS44LCA4Nik7XG5cbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDEnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgY29wIDEucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMicsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBjb3AgMi5wbmcnLCA2MS44LCA4Nik7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AzJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IGNvcCAzLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDQnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgY29wIDQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgdGhpcy5sb2FkLmltYWdlKCdjb2luJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vYW5hcmNoeSBjb2luIDIucG5nJyk7XG5cbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vQ2l0eSBiYWNrZHJvcCBjeWNsZSBjb3B5LnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnYmdiZycsICdhc3NldHMvaW1nL1B1bmsgamFtL0NpdHkgQmFja2Ryb3Agc2lsaG91ZXR0ZSBjb3B5LnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnc3AnLCAnYXNzZXRzL2ltZy9zcGFjZXIuZ2lmJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdibCcsICdhc3NldHMvaW1nL2Jsb29kLmdpZicpO1xuXG5cbiAgICAvLyB0aGlzLmxvYWQuYXVkaW8oJ2ludHJvJywgJ2Fzc2V0cy9zb3VuZC9pbnRyby5tcDMnKTtcbiAgICB0aGlzLmxvYWQuYXVkaW8oJ3B1bmtMb29wJywgJ2Fzc2V0cy9zb3VuZC9wdW5rbG9vcC5tcDMnKTtcbiAgICB0aGlzLmxvYWQuYXVkaW8oJ3BpY2t1cCcsICdhc3NldHMvc291bmQvYWxyaWdodC5tcDMnKTtcbiAgICB0aGlzLmxvYWQuYXVkaW8oJ2dydW50MScsICdhc3NldHMvc291bmQvZ3J1bnQxLm1wMycpO1xuICAgIHRoaXMubG9hZC5hdWRpbygnZ3J1bnQyJywgJ2Fzc2V0cy9zb3VuZC9ncnVudDIubXAzJyk7XG5cbn1cblxuZnVuY3Rpb24gZ2FtZUNyZWF0ZSAoKSB7XG5cbiAgICAvLyBlbmFibGUgcGh5c2ljc1xuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4gICAgLy8gd29ybGQgYm91bmRzXG4gICAgdGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCoyLCB0aGlzLmdhbWUuaGVpZ2h0KTtcblxuICAgIC8vIGRvbnQgc21vb3RoIGFydFxuICAgIHRoaXMuc3RhZ2Uuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBiYWNrZ3JvdW5kXG4gICAgLy8gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtOTAsIHRoaXMuZ2FtZS53aWR0aCwgNTQwLCAnYmdiZycpLnNjYWxlLnNldFRvKDIpO1xuICAgIHRoaXMuYWRkLnRpbGVTcHJpdGUoMCwgLTkwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKTtcblxuICAgIC8vIGFkZCBmbG9vclxuICAgIGZsb29yID0gY3JlYXRlRmxvb3IuYmluZCh0aGlzKSgpO1xuXG4gICAgLy8gZW1pdHRlclxuICAgIGVtaXR0ZXIgPSB0aGlzLmFkZC5lbWl0dGVyKDAsIDAsIDIwMDApO1xuICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygnYmwnKTtcbiAgICBlbWl0dGVyLmdyYXZpdHkgPSA5MDA7XG5cbiAgICAvLyBhZGQgcGxheWVyXG4gICAgcGxheWVyID0gY3JlYXRlUGxheWVyLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGNvbnRyb2xzXG4gICAgY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG4gICAgLy8gY29welxuICAgIGNvcHogPSB0aGlzLmFkZC5ncm91cCgpO1xuXG4gICAgLy8gY29pbnpcbiAgICBjb2lueiA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgY29pbnouZW5hYmxlQm9keSA9IHRydWU7XG4gICAgY29pbnouYWRkKGNyZWF0ZUNvaW4uYmluZCh0aGlzKSh0aGlzLmNhbWVyYSwgMjUwLCAyNTApKTtcblxuICAgIC8vIHRleHRcbiAgICB3YW50ZWRUZXh0ID0gdGhpcy5hZGQudGV4dCgxNiwgMTYsICdXYW50ZWQgTGV2ZWw6IDAnLCB7IGZvbnRTaXplOiAnMzJweCcsIGZpbGw6ICd0cmFuc3BhcmVudCcgfSk7XG4gICAgd2FudGVkVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIGhwVGV4dCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoIC0gMTAwLCAxNiwgcGxheWVyLmhlYWx0aCwgeyBmb250U2l6ZTogJzMycHgnLCBmaWxsOiAnI2YwMCcgfSk7XG4gICAgaHBUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgc2NvcmVUZXh0ID0gdGhpcy5hZGQudGV4dCgzMDAsIDE2LCAnU2NvcmU6IDAnLCB7IGZvbnRTaXplOiAnMzJweCcsIGZpbGw6ICcjZmYwJyB9KTtcbiAgICBzY29yZVRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBTb3VuZFxuICAgIC8vIHZhciBpbnRybyA9IHRoaXMuYWRkLmF1ZGlvKCdpbnRybycpO1xuICAgIHZhciBwdW5rTG9vcCA9IHRoaXMuYWRkLmF1ZGlvKCdwdW5rTG9vcCcpO1xuICAgIHZhciBwaWNrdXAgPSB0aGlzLmFkZC5hdWRpbygncGlja3VwJyk7XG4gICAgdmFyIGdydW50MSA9IHRoaXMuYWRkLmF1ZGlvKCdncnVudDEnKTtcbiAgICB2YXIgZ3J1bnQyID0gdGhpcy5hZGQuYXVkaW8oJ2dydW50MicpO1xuICAgIHRoaXMuc291bmRzID0gW3B1bmtMb29wLCBwaWNrdXAsIGdydW50MSwgZ3J1bnQyXTtcbiAgICAvLyAgQmVpbmcgbXAzIGZpbGVzIHRoZXNlIHRha2UgdGltZSB0byBkZWNvZGUsIHNvIHdlIGNhbid0IHBsYXkgdGhlbSBpbnN0YW50bHlcbiAgICAvLyAgVXNpbmcgc2V0RGVjb2RlZENhbGxiYWNrIHdlIGNhbiBiZSBub3RpZmllZCB3aGVuIHRoZXkncmUgQUxMIHJlYWR5IGZvciB1c2UuXG4gICAgLy8gIFRoZSBhdWRpbyBmaWxlcyBjb3VsZCBkZWNvZGUgaW4gQU5ZIG9yZGVyLCB3ZSBjYW4gbmV2ZXIgYmUgc3VyZSB3aGljaCBpdCdsbCBiZS5cbiAgICAvLyB0aGlzLnNvdW5kcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgLy8gICAgIHYuc3RvcCgpO1xuICAgIC8vIH0pO1xuICAgIC8vIHRoaXMuc291bmQuc2V0RGVjb2RlZENhbGxiYWNrKHRoaXMuc291bmRzLCBmdW5jdGlvbiBzdGFydCgpIHtcblxuXG4gICAgICAgIC8vIHRoaXMuc291bmRzWzFdLnN0b3AoKTtcbiAgICAgICAgLy8gcHVua0xvb3AubG9vcEZ1bGwoMCk7XG5cbiAgICAvLyB9LCB0aGlzKTtcblxufVxuXG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKHRlc3QpIHtcbmlmICghdGhpcy5zb3VuZHNbMF0uaXNQbGF5aW5nKSB0aGlzLnNvdW5kc1swXS5sb29wRnVsbCgxKTtcbiAgICAvLyBDb2xsaXNpb25zXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShjb3B6LCBmbG9vcik7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGVtaXR0ZXIsIGZsb29yLCBmdW5jdGlvbiAoYSxiKSB7XG4gICAgICAgIGEuYm9keS52ZWxvY2l0eS54ID0gYS5ib2R5LnZlbG9jaXR5LnkgPSAwO1xuICAgICAgICBiLmJvZHkudmVsb2NpdHkueCA9IGIuYm9keS52ZWxvY2l0eS55ID0gMDtcbiAgICB9KTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAocGxheWVyLCBjb2lueiwgY29sbGVjdENvaW4sIG51bGwsIHRoaXMpO1xuXG4gICAgLy8gUGxheWVyXG4gICAgcGxheWVyTW92ZW1lbnQuYmluZCh0aGlzKShwbGF5ZXIsIGN1cnNvcnMpO1xuXG4gICAgLy8gQ29welxuICAgIHZhciB3bHZsID0gd2FudGVkTGV2ZWwuYmluZCh0aGlzKShwbGF5ZXIpO1xuICAgIGlmIChjYW5TcGF3bkNvcHouYmluZCh0aGlzKShjb3B6LCB3bHZsKSkge1xuICAgICAgICBpZiAoICh0aGlzLnRpbWUubm93IC0gTEFTVF9TUEFXTikgPiAzMzMgKSB7XG4gICAgICAgICAgICBjb3B6LmFkZChjcmVhdGVDb3AuYmluZCh0aGlzKSh0aGlzLmNhbWVyYSkpO1xuICAgICAgICAgICAgTEFTVF9TUEFXTiA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGdhbWUgPSB0aGlzO1xuICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgIGNvcE1vdmVtZW50KGNvcCwgcGxheWVyKTtcbiAgICAgICAgaWYgKCAoZ2FtZS50aW1lLm5vdyAtIExBU1RfSElUKSA+IDEwMDAgKSB7XG4gICAgICAgICAgICB2YXIgaGl0ID0gY29wQXR0YWNrKGNvcCwgcGxheWVyLCBlbWl0dGVyKTtcbiAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZUJ1cnN0KGVtaXR0ZXIsIHBsYXllcik7XG4gICAgICAgICAgICAgICAgZ2FtZS5zb3VuZHNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIpICsgMildLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBMQVNUX0hJVCA9IGdhbWUudGltZS5ub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuanVtcHMgPiAwKSB7XG4gICAgICAgIHdhbnRlZFRleHQuZmlsbCA9ICcjZmZmJztcbiAgICAgICAgd2FudGVkVGV4dC50ZXh0ID0gJ1dhbnRlZCBsZXZlbDogJyArIHdsdmw7XG4gICAgICAgIGhwVGV4dC50ZXh0ID0gcGxheWVyLmhlYWx0aDtcblxuICAgICAgICAvLyBpZiAodGhpcy5zb3VuZHNbMV0udm9sdW1lICE9PSAxKSB7XG4gICAgICAgIC8vICAgICB0aGlzLnNvdW5kc1swXS5mYWRlT3V0KDEwMDApO1xuICAgICAgICAvLyAgICAgdGhpcy5zb3VuZHNbMV0ubG9vcEZ1bGwoMSk7XG4gICAgICAgIC8vIH1cbiAgICB9XG4gICAgc2NvcmVUZXh0LnRleHQgPSAnU2NvcmU6ICcgKyBwbGF5ZXIuc2NvcmU7XG5cbiAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICBpZiAoY29wLmJvZHkueCA8IGdhbWUuY2FtZXJhLnZpZXcubGVmdCAtIDIwMCB8fCBjb3AuYm9keS54ID4gZ2FtZS5jYW1lcmEudmlldy5yaWdodCArIDIwMCApIGNvcC5kZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICBpZiAoY29pbnoubGVuZ3RoIDwgd2x2bCkge1xuICAgICAgICBjb2luei5hZGQoY3JlYXRlQ29pbi5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgfVxuXG4gICAgaWYgKHBsYXllci5oZWFsdGggPCAxKSB7XG4gICAgICAgIHRoaXMuc291bmQuc3RvcEFsbCgpO1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4gICAgfVxuXG5cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWxvYWQ6IGdhbWVQcmVsb2FkLFxuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnZGVidWcnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShwbGF5ZXIpO1xuICAgICAgICAgICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShjb3ApO1xuICAgICAgICAgICAgfSwgdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcudGV4dCh0aGlzLmdhbWUudGltZS5mcHMgKycgZnBzJyB8fCAnLS0nLCAyLCAxNCwgXCIjMDBmZjAwXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIl19
