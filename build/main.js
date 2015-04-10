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

module.exports = function createCoin (camera) {

    var x = Math.floor( (Math.random() * camera.view.right - 150) + camera.view.left + 150 );
    var coin = this.add.sprite(x, 250, 'coin');
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
    coinz.add(createCoin.bind(this)(this.camera));

    // text
    wantedText = this.add.text(16, 16, 'Wanted Level: 0', { fontSize: '32px', fill: 'transparent' });
    wantedText.fixedToCamera = true;

    hpText = this.add.text(this.game.width - 100, 16, player.health, { fontSize: '32px', fill: '#f00' });
    hpText.fixedToCamera = true;

    scoreText = this.add.text(300, 16, 'Score: 0', { fontSize: '32px', fill: '#ff0' });
    scoreText.fixedToCamera = true;
}

function gameUpdate (test) {

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
                LAST_HIT = game.time.now;
            }
        }
    });

    if (player.jumps > 0) {
        wantedText.fill = '#fff';
        wantedText.text = 'Wanted level: ' + wlvl;
        hpText.text = player.health;
    }
    scoreText.text = 'Score: ' + player.score;

    copz.forEach(function (cop) {
        if (cop.body.x < game.camera.view.left - 200 || cop.body.x > game.camera.view.right + 200 ) cop.destroy();
    });

    if (coinz.length < wlvl) {
        coinz.add(createCoin.bind(this)(this.camera));
    }

    if (player.health < 1) this.state.start('game');


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb2xsZWN0LmpzIiwic3JjL21vZHVsZXMvY29wQXR0YWNrLmpzIiwic3JjL21vZHVsZXMvY29wTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3dhbnRlZExldmVsLmpzIiwic3JjL29iamVjdHMvY29pbi5qcyIsInNyYy9vYmplY3RzL2NvcC5qcyIsInNyYy9vYmplY3RzL2Zsb29yLmpzIiwic3JjL29iamVjdHMvcGxheWVyLmpzIiwic3JjL3N0YXRlcy9nYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgbm93ID0gcmVxdWlyZSgnZGF0ZS1ub3cnKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAqIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gKlxuICogQHNvdXJjZSB1bmRlcnNjb3JlLmpzXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSl7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgaWYgKG51bGwgPT0gd2FpdCkgd2FpdCA9IDEwMDtcblxuICBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IG5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXN0YW1wID0gbm93KCk7XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IG5vd1xuXG5mdW5jdGlvbiBub3coKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG59XG4iLCJjb25zb2xlLmxvZygnI3B1bmtqYW0nKTtcblxuLy8gR2FtZVxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoOTYwLCA1NDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpO1xuXG4vLyBTdGF0ZXNcbmdhbWUuc3RhdGUuYWRkKCdnYW1lJywgcmVxdWlyZSgnLi9zdGF0ZXMvZ2FtZScpKTtcblxuLy8gU3RhcnRcbmdhbWUuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcbiIsIi8vIGNhblNwYXduQ29wei5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb3B6LCB3YW50ZWRMZXZlbCkge1xuICAgIGlmICh3YW50ZWRMZXZlbCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIG1heENvcHogPSAod2FudGVkTGV2ZWwgPT09IDEpID9cbiAgICAgICAgICAgICAgICAgICAgNSA6ICh3YW50ZWRMZXZlbCA9PT0gMikgP1xuICAgICAgICAgICAgICAgICAgICAxMCA6ICh3YW50ZWRMZXZlbCA9PT0gMykgP1xuICAgICAgICAgICAgICAgICAgICAxNSA6ICh3YW50ZWRMZXZlbCA9PT0gNCkgP1xuICAgICAgICAgICAgICAgICAgICAyNSA6ICh3YW50ZWRMZXZlbCA9PT0gNSkgP1xuICAgICAgICAgICAgICAgICAgICA1MCA6ICh3YW50ZWRMZXZlbCA9PT0gNikgP1xuICAgICAgICAgICAgICAgICAgICAxMDAgOiAwO1xuXG4gICAgaWYgKGNvcHoubGVuZ3RoID49IG1heENvcHopIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb2xsZWN0IChwbGF5ZXIsIGNvaW4pIHtcbiAgICBwbGF5ZXIuc2NvcmUrKztcbiAgICBjb2luLmRlc3Ryb3koKTtcbn1cbiIsInZhciBEQU1BR0UgPSAxMCwgS05PQ0tCQUNLID0gMTAwMCwgS05PQ0tVUCA9IDI1MDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3BBdHRhY2sgKGNvcCwgcGxheWVyLCBlbWl0dGVyKSB7XG5cbiAgICB2YXIgaGl0ID0gZmFsc2U7XG5cbiAgICBpZiAocGxheWVyLmJvZHkueCA8IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSBsZWZ0XG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKGNvcC5ib2R5LngpIC0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSA8IDEwKVxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcihjb3AuYm9keS55KSA9PT0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS55KSkge1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1LTk9DS1VQO1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC1LTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSAtIE1hdGguZmxvb3IoY29wLmJvZHkueCkgPCAxMClcbiAgICAgICAgICAgICYmIE1hdGguZmxvb3IoY29wLmJvZHkueSkgPT09IE1hdGguZmxvb3IocGxheWVyLmJvZHkueSkpIHtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtS05PQ0tVUDtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSBLTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGl0O1xuXG59O1xuIiwiLy8gY29wTW92ZW1lbnQuanNcbnZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIE1BWF9TUEVFRCA9IDI1MCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwKjI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcCwgcGxheWVyKSB7XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZC8zLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgZWxzZSBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQsIGNvcC5tYXhTcGVlZCAqIDEwKTtcblxuICAgIGlmIChwbGF5ZXIuYm9keS54IDwgY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIGxlZnRcbiAgICAgICAgY29wLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgY29wLnNjYWxlLnggPSAtTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBjb3AuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIGNvcC5zY2FsZS54ID0gTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcbiAgICB9XG5cblxufTtcbiIsInZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIEpVTVBfViA9IDEwMDAsXG4gICAgQUlSX0RFQ0VMID0gMC4zMyxcbiAgICBBSVJfRFJBRyA9IDAsXG4gICAgRkxPT1JfRFJBRyA9IDUwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllciwgY3Vyc29ycykge1xuXG4gICAgaWYgKGN1cnNvcnMubGVmdC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgbGVmdFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IC1NYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IC1NYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSByaWdodFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIHBsYXllci5zY2FsZS54ID0gTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgLy8gIFN0YW5kIHN0aWxsXG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAwO1xuXG4gICAgfVxuXG4gICAgaWYgKCFwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSB7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2p1bXAnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCAqIEFJUl9ERUNFTDtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhBSVJfRFJBRywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhGTE9PUl9EUkFHLCAwKTtcbiAgICB9XG5cbiAgICAvLyAgQWxsb3cgdGhlIHBsYXllciB0byBqdW1wIGlmIHRoZXkgYXJlIHRvdWNoaW5nIHRoZSBncm91bmQuXG4gICAgaWYgKGN1cnNvcnMudXAuaXNEb3duICYmIHBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLU1hdGguYWJzKEpVTVBfVik7XG4gICAgICAgIHBsYXllci5qdW1wcysrO1xuICAgICAgICBpZiAocGxheWVyLmZpcnN0SnVtcCA9PSBudWxsKSB7XG4gICAgICAgICAgICBwbGF5ZXIuZmlyc3RKdW1wID0gdGhpcy50aW1lLm5vdztcbiAgICAgICAgfVxuICAgIH1cblxufTtcbiIsIi8vIHdhbnRlZExldmVsLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllcikge1xuXG4gICAgdmFyIHdhbnRlZExldmVsID0gMCxcbiAgICB0aW1lU2luY2VGaXJzdEp1bXAgPSAocGxheWVyLmZpcnN0SnVtcCA9PSBudWxsKSA/IDAgOiBNYXRoLmZsb29yKCh0aGlzLnRpbWUubm93IC0gcGxheWVyLmZpcnN0SnVtcCkvMTAwMCksXG4gICAgdG90YWxKdW1wcyA9IHBsYXllci5qdW1wcztcblxuICAgIGlmICh0b3RhbEp1bXBzID4gMCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDE7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gNSB8fCB0aW1lU2luY2VGaXJzdEp1bXAgPiA1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMjtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAxNSB8fCB0aW1lU2luY2VGaXJzdEp1bXAgPiAxNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDM7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMzAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gMzApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA0O1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDQwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDQ1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNTtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAxMDAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gNjApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA2O1xuICAgIH1cblxuICAgIHJldHVybiB3YW50ZWRMZXZlbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQ29pbiAoY2FtZXJhKSB7XG5cbiAgICB2YXIgeCA9IE1hdGguZmxvb3IoIChNYXRoLnJhbmRvbSgpICogY2FtZXJhLnZpZXcucmlnaHQgLSAxNTApICsgY2FtZXJhLnZpZXcubGVmdCArIDE1MCApO1xuICAgIHZhciBjb2luID0gdGhpcy5hZGQuc3ByaXRlKHgsIDI1MCwgJ2NvaW4nKTtcbiAgICBjb2luLnNjYWxlLnNldFRvKDAuMSk7XG5cbiAgICByZXR1cm4gY29pbjtcbn1cbiIsIi8vIGNvcC5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwLFxuICAgIFdPUkxEX09WRVJGTE9XO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjYW1lcmEpIHtcbiAgICBXT1JMRF9PVkVSRkxPVyA9IDMyKjI7XG4gICAgdmFyIGNvcDtcbiAgICB2YXIgc3Bhd25Mb2NhdGlvbnMgPSBbXTtcblxuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWF4KFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcubGVmdCAtIDMyLFxuICAgICAgICAgICAgLVdPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcucmlnaHQgKyAzMixcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC53aWR0aCtXT1JMRF9PVkVSRkxPV1xuICAgICAgICApXG4gICAgKTtcblxuICAgIHNwcml0ZU5hbWUgPSAnY29wJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpLnRvU3RyaW5nKCk7XG4gICAgY29wID0gdGhpcy5hZGQuc3ByaXRlKHNwYXduTG9jYXRpb25zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyKV0sIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCBzcHJpdGVOYW1lKTtcbiAgICAvLyBjb3Auc2NhbGUuc2V0VG8oMik7XG4gICAgY29wLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBjb3Auc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBjb3BcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShjb3ApO1xuICAgIGNvcC5ib2R5LnNldFNpemUoMjUsNTAsLTIuNSw2KTtcblxuICAgIC8vICBjb3AgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICAvLyBjb3AuYm9keS5ib3VuY2UueSA9IDAuMjtcbiAgICBjb3AuYm9keS5ncmF2aXR5LnkgPSBHUkFWSVRZO1xuICAgIC8vIGNvcC5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG4gICAgLy8gKHBhcnNlRmxvYXQoKE1hdGgucmFuZG9tKCkgKiAxKS50b0ZpeGVkKDIpLCAxMClcbiAgICB2YXIgc3BlZWRzID0gWzUwLCAxMDAsIDE1MCwgMjAwLCAyNTBdO1xuICAgIGNvcC5tYXhTcGVlZCA9IE1hdGgubWluKE1BWF9TUEVFRCArIHNwZWVkc1tNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogNSkpXSwgMzQ1KTtcbiAgICBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQsIGNvcC5tYXhTcGVlZCAqIDEwKTtcbiAgICBjb3AuYm9keS5kcmFnLnNldFRvKERSQUcsIDApO1xuXG4gICAgLy8gIE91ciB0d28gYW5pbWF0aW9ucywgd2Fsa2luZyBsZWZ0IGFuZCByaWdodC5cbiAgICBjb3AuYW5pbWF0aW9ucy5hZGQoJ3J1bicsIFswLCAxXSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNykgKyAzLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMl0sIDEsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszLCAzLCA0XSwgMiwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG5cbiAgICByZXR1cm4gY29wO1xufTtcbiIsIi8vIGZsb29yLmpzXG52YXIgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gdGhpcy5jYWNoZS5nZXRJbWFnZSgncDEnKS53aWR0aCoyO1xuICAgIHZhciBmbG9vcjtcblxuICAgIGZsb29yID0gdGhpcy5hZGQuc3ByaXRlKC1XT1JMRF9PVkVSRkxPVywgdGhpcy53b3JsZC5oZWlnaHQtNjAsICdzcCcpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGZsb29yKTtcbiAgICBmbG9vci5ib2R5LmltbW92YWJsZSA9IHRydWU7XG4gICAgZmxvb3IuYm9keS5hbGxvd0dyYXZpdHkgPSBmYWxzZTtcbiAgICBmbG9vci53aWR0aCA9IHRoaXMud29ybGQud2lkdGggKyBXT1JMRF9PVkVSRkxPVztcblxuICAgIHJldHVybiBmbG9vcjtcbn07XG4iLCIvLyBwbGF5ZXIuanNcbnZhciBERUFEWk9ORV9XSURUSCA9IDQwMCxcbiAgICBNQVhfU1BFRUQgPSAzNTAsXG4gICAgQUNDRUxFUkFUSU9OID0gMTAwMCxcbiAgICBEUkFHID0gMTAwMCxcbiAgICBHUkFWSVRZID0gMjAwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBUaGUgcGxheWVyIGFuZCBpdHMgc2V0dGluZ3NcbiAgICB2YXIgcGxheWVyO1xuICAgIHNwcml0ZU5hbWUgPSAncCcgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkgKyAxKS50b1N0cmluZygpO1xuICAgIHBsYXllciA9IHRoaXMuYWRkLnNwcml0ZSgzMiwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsIHNwcml0ZU5hbWUpO1xuICAgIC8vIHBsYXllci5zY2FsZS5zZXRUbygyKTtcbiAgICBwbGF5ZXIuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIHBsYXllci5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG4gICAgcGxheWVyLmJvZHkuc2V0U2l6ZSgyNSw1MCwtMi41LDYpO1xuXG4gICAgLy8gIFBsYXllciBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIHBsYXllci5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHBsYXllci5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKE1BWF9TUEVFRCwgTUFYX1NQRUVEICogMTApO1xuICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgncnVuJywgWzAsIDFdLCA2LCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMl0sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszLCAzLCA0XSwgMiwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgLy8gbWlzY1xuICAgIHBsYXllci5maXJzdEp1bXAgPSBudWxsO1xuICAgIHBsYXllci5qdW1wcyA9IDA7XG4gICAgcGxheWVyLmhlYWx0aCA9IDEwMDtcbiAgICBwbGF5ZXIuc2NvcmUgPSAwO1xuXG4gICAgLy8gY2FtZXJhXG4gICAgdGhpcy5jYW1lcmEuZm9sbG93KHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OKTtcbiAgICB0aGlzLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKFxuICAgICAgICB0aGlzLmdhbWUud2lkdGgvMiAtIERFQURaT05FX1dJRFRILzIsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHQsXG4gICAgICAgIERFQURaT05FX1dJRFRILFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0XG4gICAgKTtcblxuICAgIHJldHVybiBwbGF5ZXI7XG59O1xuIiwiLy8gZ2FtZS5qc1xuXG4vLyBFeHRlcm5hbFxudmFyIGRlYm91bmNlID0gcmVxdWlyZSgnZGVib3VuY2UnKTtcblxuLy8gQ3JlYXRlXG52YXIgY3JlYXRlUGxheWVyID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9wbGF5ZXInKSxcbiAgICBjcmVhdGVDb3AgICA9IHJlcXVpcmUoJy4uL29iamVjdHMvY29wJyksXG4gICAgY3JlYXRlQ29pbiA9IHJlcXVpcmUoJy4uL29iamVjdHMvY29pbicpLFxuICAgIGNyZWF0ZUZsb29yID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9mbG9vcicpO1xuXG4vLyBVcGRhdGVcbnZhciBwbGF5ZXJNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcGxheWVyTW92ZW1lbnQnKSxcbiAgICBjb3BNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29wTW92ZW1lbnQnKSxcbiAgICBjb3BBdHRhY2sgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcEF0dGFjaycpLFxuICAgIHdhbnRlZExldmVsID0gcmVxdWlyZSgnLi4vbW9kdWxlcy93YW50ZWRMZXZlbCcpLFxuICAgIGNvbGxlY3RDb2luID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb2xsZWN0JyksXG4gICAgY2FuU3Bhd25Db3B6ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jYW5TcGF3bkNvcHonKTtcblxuLy8gR2xvYmFsc1xuXG52YXIgcGxheWVyLCBmbG9vciwgY3Vyc29ycywgY29weixcbiAgICBMQVNUX1NQQVdOID0gMCwgTUFYX0NPUFogPSAyMDAsIExBU1RfSElUID0gMFxuICAgIE1BWF9DT0lOWiA9IDE7XG5cbmZ1bmN0aW9uIHBhcnRpY2xlQnVyc3QoZW1pdHRlciwgcGxheWVyKSB7XG5cbiAgICAvLyAgUG9zaXRpb24gdGhlIGVtaXR0ZXIgd2hlcmUgdGhlIG1vdXNlL3RvdWNoIGV2ZW50IHdhc1xuICAgIGVtaXR0ZXIueCA9IHBsYXllci5ib2R5LnggKyBwbGF5ZXIuYm9keS53aWR0aC8yO1xuICAgIGVtaXR0ZXIueSA9IHBsYXllci5ib2R5LnkgKyBwbGF5ZXIuYm9keS5oZWlnaHQvMjtcblxuICAgIC8vICBUaGUgZmlyc3QgcGFyYW1ldGVyIHNldHMgdGhlIGVmZmVjdCB0byBcImV4cGxvZGVcIiB3aGljaCBtZWFucyBhbGwgcGFydGljbGVzIGFyZSBlbWl0dGVkIGF0IG9uY2VcbiAgICAvLyAgVGhlIHNlY29uZCBnaXZlcyBlYWNoIHBhcnRpY2xlIGEgMjAwMG1zIGxpZmVzcGFuXG4gICAgLy8gIFRoZSB0aGlyZCBpcyBpZ25vcmVkIHdoZW4gdXNpbmcgYnVyc3QvZXhwbG9kZSBtb2RlXG4gICAgLy8gIFRoZSBmaW5hbCBwYXJhbWV0ZXIgKDEwKSBpcyBob3cgbWFueSBwYXJ0aWNsZXMgd2lsbCBiZSBlbWl0dGVkIGluIHRoaXMgc2luZ2xlIGJ1cnN0XG4gICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAwMDAwMCwgbnVsbCwgMTAwKTtcblxufVxuXG5mdW5jdGlvbiBnYW1lUHJlbG9hZCAoKSB7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdwMScsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBwdW5rIDEucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDInLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgcHVuayAyLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AzJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IHB1bmsgMy5wbmcnLCA2MS44LCA4Nik7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdwNCcsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBwdW5rIDQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AxJywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IGNvcCAxLnBuZycsIDYxLjgsIDg2KTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDInLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9kb3VibGUgc2l6ZSBzcHJpdGUgc2hlZXQgY29wIDIucG5nJywgNjEuOCwgODYpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMycsICdhc3NldHMvaW1nL1B1bmsgamFtL2RvdWJsZSBzaXplIHNwcml0ZSBzaGVldCBjb3AgMy5wbmcnLCA2MS44LCA4Nik7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3A0JywgJ2Fzc2V0cy9pbWcvUHVuayBqYW0vZG91YmxlIHNpemUgc3ByaXRlIHNoZWV0IGNvcCA0LnBuZycsIDYxLjgsIDg2KTtcblxuICAgIHRoaXMubG9hZC5pbWFnZSgnY29pbicsICdhc3NldHMvaW1nL1B1bmsgamFtL2FuYXJjaHkgY29pbiAyLnBuZycpO1xuXG4gICAgdGhpcy5sb2FkLmltYWdlKCdiZycsICdhc3NldHMvaW1nL1B1bmsgamFtL0NpdHkgYmFja2Ryb3AgY3ljbGUgY29weS5wbmcnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnYmcnLCAnYXNzZXRzL2ltZy9QdW5rIGphbS9DaXR5IEJhY2tkcm9wIHNpbGhvdWV0dGUgY29weS5wbmcnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NwJywgJ2Fzc2V0cy9pbWcvc3BhY2VyLmdpZicpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnYmwnLCAnYXNzZXRzL2ltZy9ibG9vZC5naWYnKTtcbn1cblxuZnVuY3Rpb24gZ2FtZUNyZWF0ZSAoKSB7XG5cbiAgICAvLyBlbmFibGUgcGh5c2ljc1xuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4gICAgLy8gd29ybGQgYm91bmRzXG4gICAgdGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCoyLCB0aGlzLmdhbWUuaGVpZ2h0KTtcblxuICAgIC8vIGRvbnQgc21vb3RoIGFydFxuICAgIHRoaXMuc3RhZ2Uuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBiYWNrZ3JvdW5kXG4gICAgLy8gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtOTAsIHRoaXMuZ2FtZS53aWR0aCwgNTQwLCAnYmdiZycpLnNjYWxlLnNldFRvKDIpO1xuICAgIHRoaXMuYWRkLnRpbGVTcHJpdGUoMCwgLTkwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKTtcblxuICAgIC8vIGFkZCBmbG9vclxuICAgIGZsb29yID0gY3JlYXRlRmxvb3IuYmluZCh0aGlzKSgpO1xuXG4gICAgLy8gZW1pdHRlclxuICAgIGVtaXR0ZXIgPSB0aGlzLmFkZC5lbWl0dGVyKDAsIDAsIDIwMDApO1xuICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygnYmwnKTtcbiAgICBlbWl0dGVyLmdyYXZpdHkgPSA5MDA7XG5cbiAgICAvLyBhZGQgcGxheWVyXG4gICAgcGxheWVyID0gY3JlYXRlUGxheWVyLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGNvbnRyb2xzXG4gICAgY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG4gICAgLy8gY29welxuICAgIGNvcHogPSB0aGlzLmFkZC5ncm91cCgpO1xuXG4gICAgLy8gY29pbnpcbiAgICBjb2lueiA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgY29pbnouZW5hYmxlQm9keSA9IHRydWU7XG4gICAgY29pbnouYWRkKGNyZWF0ZUNvaW4uYmluZCh0aGlzKSh0aGlzLmNhbWVyYSkpO1xuXG4gICAgLy8gdGV4dFxuICAgIHdhbnRlZFRleHQgPSB0aGlzLmFkZC50ZXh0KDE2LCAxNiwgJ1dhbnRlZCBMZXZlbDogMCcsIHsgZm9udFNpemU6ICczMnB4JywgZmlsbDogJ3RyYW5zcGFyZW50JyB9KTtcbiAgICB3YW50ZWRUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgaHBUZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGggLSAxMDAsIDE2LCBwbGF5ZXIuaGVhbHRoLCB7IGZvbnRTaXplOiAnMzJweCcsIGZpbGw6ICcjZjAwJyB9KTtcbiAgICBocFRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICBzY29yZVRleHQgPSB0aGlzLmFkZC50ZXh0KDMwMCwgMTYsICdTY29yZTogMCcsIHsgZm9udFNpemU6ICczMnB4JywgZmlsbDogJyNmZjAnIH0pO1xuICAgIHNjb3JlVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZ2FtZVVwZGF0ZSAodGVzdCkge1xuXG4gICAgLy8gQ29sbGlzaW9uc1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGZsb29yKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoY29weiwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShlbWl0dGVyLCBmbG9vciwgZnVuY3Rpb24gKGEsYikge1xuICAgICAgICBhLmJvZHkudmVsb2NpdHkueCA9IGEuYm9keS52ZWxvY2l0eS55ID0gMDtcbiAgICAgICAgYi5ib2R5LnZlbG9jaXR5LnggPSBiLmJvZHkudmVsb2NpdHkueSA9IDA7XG4gICAgfSk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHBsYXllciwgY29pbnosIGNvbGxlY3RDb2luLCBudWxsLCB0aGlzKTtcblxuICAgIC8vIFBsYXllclxuICAgIHBsYXllck1vdmVtZW50LmJpbmQodGhpcykocGxheWVyLCBjdXJzb3JzKTtcblxuICAgIC8vIENvcHpcbiAgICB2YXIgd2x2bCA9IHdhbnRlZExldmVsLmJpbmQodGhpcykocGxheWVyKTtcbiAgICBpZiAoY2FuU3Bhd25Db3B6LmJpbmQodGhpcykoY29weiwgd2x2bCkpIHtcbiAgICAgICAgaWYgKCAodGhpcy50aW1lLm5vdyAtIExBU1RfU1BBV04pID4gMzMzICkge1xuICAgICAgICAgICAgY29wei5hZGQoY3JlYXRlQ29wLmJpbmQodGhpcykodGhpcy5jYW1lcmEpKTtcbiAgICAgICAgICAgIExBU1RfU1BBV04gPSB0aGlzLnRpbWUubm93O1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBnYW1lID0gdGhpcztcbiAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICBjb3BNb3ZlbWVudChjb3AsIHBsYXllcik7XG4gICAgICAgIGlmICggKGdhbWUudGltZS5ub3cgLSBMQVNUX0hJVCkgPiAxMDAwICkge1xuICAgICAgICAgICAgdmFyIGhpdCA9IGNvcEF0dGFjayhjb3AsIHBsYXllciwgZW1pdHRlcik7XG4gICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGVCdXJzdChlbWl0dGVyLCBwbGF5ZXIpO1xuICAgICAgICAgICAgICAgIExBU1RfSElUID0gZ2FtZS50aW1lLm5vdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBsYXllci5qdW1wcyA+IDApIHtcbiAgICAgICAgd2FudGVkVGV4dC5maWxsID0gJyNmZmYnO1xuICAgICAgICB3YW50ZWRUZXh0LnRleHQgPSAnV2FudGVkIGxldmVsOiAnICsgd2x2bDtcbiAgICAgICAgaHBUZXh0LnRleHQgPSBwbGF5ZXIuaGVhbHRoO1xuICAgIH1cbiAgICBzY29yZVRleHQudGV4dCA9ICdTY29yZTogJyArIHBsYXllci5zY29yZTtcblxuICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgIGlmIChjb3AuYm9keS54IDwgZ2FtZS5jYW1lcmEudmlldy5sZWZ0IC0gMjAwIHx8IGNvcC5ib2R5LnggPiBnYW1lLmNhbWVyYS52aWV3LnJpZ2h0ICsgMjAwICkgY29wLmRlc3Ryb3koKTtcbiAgICB9KTtcblxuICAgIGlmIChjb2luei5sZW5ndGggPCB3bHZsKSB7XG4gICAgICAgIGNvaW56LmFkZChjcmVhdGVDb2luLmJpbmQodGhpcykodGhpcy5jYW1lcmEpKTtcbiAgICB9XG5cbiAgICBpZiAocGxheWVyLmhlYWx0aCA8IDEpIHRoaXMuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcblxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlbG9hZDogZ2FtZVByZWxvYWQsXG4gICAgY3JlYXRlOiAgZ2FtZUNyZWF0ZSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdkZWJ1ZycpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmFkdmFuY2VkVGltaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KHBsYXllcik7XG4gICAgICAgICAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KGNvcCk7XG4gICAgICAgICAgICB9LCB0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy50ZXh0KHRoaXMuZ2FtZS50aW1lLmZwcyArJyBmcHMnIHx8ICctLScsIDIsIDE0LCBcIiMwMGZmMDBcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogIGdhbWVVcGRhdGVcbn07XG4iXX0=
