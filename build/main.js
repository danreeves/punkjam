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
game.state.add('boot', require('./states/boot'));
game.state.add('load', require('./states/load'));
game.state.add('game', require('./states/game'));

// Start
game.state.start('boot');

},{"./states/boot":15,"./states/game":16,"./states/load":17}],4:[function(require,module,exports){
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
'use strict';

module.exports = function displayWanted (sprites, wlvl) {

    sprites.forEach(function (v,i) {
        if (i < wlvl) v.alpha = 1;
    });

    if (wlvl < 6) {
        sprites[5].alpha = 0;
    }

}

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function createCoin (camera,setx,sety) {

    var x = getRandomInt(camera.view.left + 150, camera.view.right - 150);
    var y = getRandomInt(150, 300);
    var coin = this.add.sprite(setx || x, sety || y, 'coin');
    coin.scale.setTo(0.1);

    return coin;
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{}],12:[function(require,module,exports){
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
    cop.lifespan = 60000;
    cop.events.onKilled.add(function (sprite){
        sprite.destroy();
    })
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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
    try {
        if (window.location.search.search('god') > -1) player.health = Infinity;
        if (window.location.search.search('hp') > -1) player.health = parseInt(window.location.search.match(/hp=(\d+)/)[1], 10);
    } catch (e){}
    player.score = 0;
    player.dead = false;

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

},{}],15:[function(require,module,exports){
'use strict';

module.exports = {
    preload: function () {
        this.game.load.image('loading', 'assets/img/title.png');
    },
    create: function () {
        this.game.state.start('load');
    }
};

},{}],16:[function(require,module,exports){
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
    showWanted = require('../modules/wantedDisplay'),
    canSpawnCopz = require('../modules/canSpawnCopz');

// Globals

var player, floor, cursors, copz, sprites,
    LAST_SPAWN = 0, MAX_COPZ = 200, LAST_HIT = 0,
    MAX_COINZ = 1,
    MUSIC = true, SOUND = true,
    GAME_OVER = false;

    if (window.location.search.search('nomusic') > -1) {
        MUSIC = false;
    }
    if (window.location.search.search('nosound') > -1) {
        MUSIC = SOUND = false;
    }

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

function gameCreate () {
    GAME_OVER = false
    // enable physics
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // world bounds
    this.world.setBounds(0, 0, this.cache.getImage('bg').width*2, this.game.height);

    // dont smooth art
    this.stage.smoothed = false;

    //  background
    bluesky = this.add.image(0, 0, 'bluesky');
    punksky = this.add.image(0, 0, 'punksky');
    bluesky.fixedToCamera = punksky.fixedToCamera = true;
    bluesky.width = punksky.width = this.game.width;
    punksky.alpha = 0;
    this.add.tileSprite(0, 0, this.cache.getImage('bg').width*2, this.cache.getImage('bg').height, 'bg');

    // add floor
    floor = createFloor.bind(this)();

    // add sign
    this.add.image(130, this.game.height - 160, 'sign');
    var x = 10;
    var div = this.world.width/x;
    for (var i = 1; i <= x; i++) {
        this.add.image(
            getRandomInt(
                Math.max(250, div*i),
                (i === 1) ? Math.min(div*(i+1), 800): div*(i+1)
            ),
            this.game.height - 60,
            (Math.random()<.33) ? 'ramp' : 'bin'
        );
    };


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

    // wanted level
    var spriteWidth = this.cache.getImage('wanted').width * 0.075;
    var w1 = this.add.sprite(16, 16, 'wanted');
    var w2 = this.add.sprite(16 + spriteWidth * 1, 16, 'wanted');
    var w3 = this.add.sprite(16 + spriteWidth * 2, 16, 'wanted');
    var w4 = this.add.sprite(16 + spriteWidth * 3, 16, 'wanted');
    var w5 = this.add.sprite(16 + spriteWidth * 4, 16, 'wanted');
    var w6 = this.add.sprite(16 + spriteWidth * 5, 16, 'wanted');

    sprites = [w1,w2,w3,w4,w5,w6];
    sprites.forEach(function (v) {
        v.alpha = 0;
        v.fixedToCamera = true;
        v.scale.setTo(0.075);
    });

    // hp text
    hpText = this.add.retroFont('numbers', 36, 54, '0123456789', 10, 0, 0);
    hpText.text = player.health.toString();
    hpDisplay = this.add.image(this.game.width - 120, 16, hpText);
    hpDisplay.tint = 0xff0000;
    hpDisplay.fixedToCamera = true;

    // score text
    scoreText = this.add.retroFont('numbers', 36, 54, '0123456789', 10, 0, 0);
    scoreText.text = player.health.toString();
    scoreDisplay = this.add.image(this.game.width - 250, 16, scoreText);
    scoreDisplay.tint = 0xffff00;
    scoreDisplay.fixedToCamera = true;

    //shade
    shade = this.add.graphics(0, 0);
    shade.beginFill(0x000000, 1);
    shade.drawRect(0, 0, this.game.width, this.game.height);
    shade.endFill();
    shade.alpha = 0;
    shade.fixedToCamera = true;

    // game over text
    var gameOver = [
        'YOU LOSE!',
        'GAME OVER!',
        'LOSER!',
        'SUCKZ 2 B U!',
        'DREAM ON!',
        'IN YOUR FACE!',
        'GOODNIGHT!',
        'NO FUTURE!',
        'PUNKS DEAD'
    ];
    gameoverText = this.add.retroFont('font', 69.4, 67.5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?.,1234567890', 5, 0, 0);
    gameoverText.text = gameOver[getRandomInt(0, gameOver.length-1)];
    gameoverDisplay = this.add.image(this.game.width/2, this.game.height/3, gameoverText);
    gameoverDisplay.alpha = 0;
    gameoverDisplay.tint = 0xff0000;
    gameoverDisplay.anchor.x = Math.round(gameoverText.width * 0.5) / gameoverText.width;
    gameoverDisplay.fixedToCamera = true;

    var replay = [
        'Replay?',
        'Go again?',
        'Try again?',
        'Once more?',
        'Another shot?'
    ];
    replayText = this.add.retroFont('font', 69.4, 67.5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?.,1234567890', 5, 0, 0);
    replayText.text = replay[getRandomInt(0, replay.length-1)];
    replayDisplay = this.add.image(this.game.width/2, this.game.height/2, replayText);
    replayDisplay.alpha = 0;
    replayDisplay.tint = 0xff0000;
    replayDisplay.anchor.x = Math.round(replayText.width * 0.5) / replayText.width;
    replayDisplay.fixedToCamera = true;

    // Sound
    var punkLoop = this.add.audio('punkLoop');
    var pickup = this.add.audio('pickup');
    var grunt1 = this.add.audio('grunt1');
    var grunt2 = this.add.audio('grunt2');
    this.sounds = [punkLoop, pickup, grunt1, grunt2];
    if (!MUSIC) this.sounds[0].volume = 0;
    if (!SOUND) this.sound.volume = 0;

}


function gameUpdate (test) {
    if (!this.sounds[0].isPlaying && MUSIC && SOUND) this.sounds[0].loopFull(1);
    // Collisions
    this.physics.arcade.collide(player, floor);
    this.physics.arcade.collide(copz, floor);
    this.physics.arcade.collide(emitter, floor, function (a,b) {
        a.body.velocity.x = a.body.velocity.y = 0;
        b.body.velocity.x = b.body.velocity.y = 0;
    });
    this.physics.arcade.overlap(player, coinz, collectCoin, null, this);
    if (!GAME_OVER) {
        // Player
        playerMovement.bind(this)(player, cursors);

        // Copz
        var wlvl = wantedLevel.bind(this)(player);
        if (canSpawnCopz.bind(this)(copz, wlvl)) {
            if ( (this.time.now - LAST_SPAWN) > (3000/wlvl) ) {
                copz.add(createCop.bind(this)(this.camera));
                LAST_SPAWN = this.time.now;
            }
            // if (copz.length > 50) copz.children[0].destroy();
        }
        var game = this;
        copz.forEach(function (cop) {
            copMovement(cop, player);
            if ( (game.time.now - LAST_HIT) > 666 ) {
                var hit = copAttack(cop, player, emitter);
                if (hit) {
                    particleBurst(emitter, player);
                    game.sounds[Math.floor((Math.random() * 2) + 2)].play();
                    LAST_HIT = game.time.now;
                }
            }
        });

        if (player.jumps > 0) {
            // wantedText.fill = '#fff';
            // wantedText.text = 'Wanted level: ' + wlvl;
            hpText.text = player.health.toString();
            if (punksky.alpha === 0) {
                this.add.tween(punksky).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 0, false);
            }
        }
        scoreText.text = '' + player.score;
        showWanted.bind(this)(sprites, wlvl);

        copz.forEach(function (cop) {
            if (cop.body.x < game.camera.view.left - 200 || cop.body.x > game.camera.view.right + 200 ) cop.destroy();
        });
        coinz.forEach(function (coin) {
            if (coin.body.x < game.camera.view.left - 200 || coin.body.x > game.camera.view.right + 200 ) coin.destroy();
        });

        if (coinz.length < wlvl) {
            coinz.add(createCoin.bind(this)(this.camera));
        }

        if (player.health < 1) {
            GAME_OVER = true;
        }
        if (player.x > 4625 && player.jumps === 0) GAME_OVER = true;
    } else {
        // GAME OVER
        if (!player.dead) {
            player.dead = true;
            player.kill();
            death = this.add.emitter(0, 0, 1);
            death.makeParticles(player.key);
            death.gravity = 100;
            death.x = player.body.x + player.body.width/2;
            death.y = player.body.y + player.body.height/2;
            death.start(true, 50000000, null, 1);
            this.add.tween(gameoverDisplay).to( { alpha: 0.75 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.add.tween(replayDisplay).to( { alpha: 0.75 }, 2000, Phaser.Easing.Linear.None, true, 250, 0, false);
            this.add.tween(shade).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 1500, 0, false);
            replayDisplay.inputEnabled = true;
            replayDisplay.events.onInputDown.add(function () {
                this.sound.stopAll();
                this.state.start('game');
            }, this);
            replayDisplay.events.onInputOver.add(function () {
                replayDisplay.alpha = 1;
            }, replayDisplay);
            replayDisplay.events.onInputOut.add(function () {
                replayDisplay.alpha = 0.75;
            }, replayDisplay);
        }

    }


}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
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

},{"../modules/canSpawnCopz":4,"../modules/collect":5,"../modules/copAttack":6,"../modules/copMovement":7,"../modules/playerMovement":8,"../modules/wantedDisplay":9,"../modules/wantedLevel":10,"../objects/coin":11,"../objects/cop":12,"../objects/floor":13,"../objects/player":14,"debounce":1}],17:[function(require,module,exports){
'use strict';

module.exports = {
    preload: function () {
        var loading = this.game.add.sprite(this.game.width/2, 0, 'loading');
        loading.anchor.x = Math.round(loading.width * 0.5) / loading.width;
        this.game.load.setPreloadSprite(loading);

        this.load.spritesheet('p1', 'assets/img/punk1.png', 61.8, 86);
        this.load.spritesheet('p2', 'assets/img/punk2.png', 61.8, 86);
        this.load.spritesheet('p3', 'assets/img/punk3.png', 61.8, 86);
        this.load.spritesheet('p4', 'assets/img/punk4.png', 61.8, 86);

        this.load.spritesheet('cop1', 'assets/img/cop1.png', 61.8, 86);
        this.load.spritesheet('cop2', 'assets/img/cop2.png', 61.8, 86);
        this.load.spritesheet('cop3', 'assets/img/cop3.png', 61.8, 86);
        this.load.spritesheet('cop4', 'assets/img/cop4.png', 61.8, 86);

        this.load.image('coin', 'assets/img/anarchycoin.png');
        this.load.image('wanted', 'assets/img/wanted.png');

        this.load.image('bg', 'assets/img/bg-new.png');
        this.load.image('bluesky', 'assets/img/bluesky.png');
        this.load.image('punksky', 'assets/img/punksky.png');
        this.load.image('sp', 'assets/img/spacer.gif');
        this.load.image('bl', 'assets/img/blood.gif');

        this.load.image('sign', 'assets/img/sign.png');
        this.load.image('ramp', 'assets/img/ramp.png');
        this.load.image('bin', 'assets/img/bin.png');

        this.load.audio('punkLoop', 'assets/sound/punkloop.mp3');
        this.load.audio('pickup', 'assets/sound/alright.mp3');
        this.load.audio('grunt1', 'assets/sound/grunt1.mp3');
        this.load.audio('grunt2', 'assets/sound/grunt2.mp3');

        this.load.image('numbers', 'assets/img/numbers.png');
        this.load.image('font', 'assets/img/font.png');
    },
    create: function () {
        var game = this;
        setTimeout(function () {
            game.game.state.start('game');
        }, 1000);
    }
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb2xsZWN0LmpzIiwic3JjL21vZHVsZXMvY29wQXR0YWNrLmpzIiwic3JjL21vZHVsZXMvY29wTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3dhbnRlZERpc3BsYXkuanMiLCJzcmMvbW9kdWxlcy93YW50ZWRMZXZlbC5qcyIsInNyYy9vYmplY3RzL2NvaW4uanMiLCJzcmMvb2JqZWN0cy9jb3AuanMiLCJzcmMvb2JqZWN0cy9mbG9vci5qcyIsInNyYy9vYmplY3RzL3BsYXllci5qcyIsInNyYy9zdGF0ZXMvYm9vdC5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIG5vdyA9IHJlcXVpcmUoJ2RhdGUtbm93Jyk7XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICogYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICogTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gKiBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICpcbiAqIEBzb3VyY2UgdW5kZXJzY29yZS5qc1xuICogQHNlZSBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gd3JhcFxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgaW4gbXMgKGAxMDBgKVxuICogQHBhcmFtIHtCb29sZWFufSB3aGV0aGVyIHRvIGV4ZWN1dGUgYXQgdGhlIGJlZ2lubmluZyAoYGZhbHNlYClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpe1xuICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG4gIGlmIChudWxsID09IHdhaXQpIHdhaXQgPSAxMDA7XG5cbiAgZnVuY3Rpb24gbGF0ZXIoKSB7XG4gICAgdmFyIGxhc3QgPSBub3coKSAtIHRpbWVzdGFtcDtcblxuICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID4gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICBjb250ZXh0ID0gdGhpcztcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHRpbWVzdGFtcCA9IG5vdygpO1xuICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSB7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBEYXRlLm5vdyB8fCBub3dcblxuZnVuY3Rpb24gbm93KCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxufVxuIiwiY29uc29sZS5sb2coJyNwdW5ramFtJyk7XG5cbi8vIEdhbWVcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDk2MCwgNTQwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuLy8gU3RhdGVzXG5nYW1lLnN0YXRlLmFkZCgnYm9vdCcsIHJlcXVpcmUoJy4vc3RhdGVzL2Jvb3QnKSk7XG5nYW1lLnN0YXRlLmFkZCgnbG9hZCcsIHJlcXVpcmUoJy4vc3RhdGVzL2xvYWQnKSk7XG5nYW1lLnN0YXRlLmFkZCgnZ2FtZScsIHJlcXVpcmUoJy4vc3RhdGVzL2dhbWUnKSk7XG5cbi8vIFN0YXJ0XG5nYW1lLnN0YXRlLnN0YXJ0KCdib290Jyk7XG4iLCIvLyBjYW5TcGF3bkNvcHouanNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29weiwgd2FudGVkTGV2ZWwpIHtcbiAgICBpZiAod2FudGVkTGV2ZWwgPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIHZhciBtYXhDb3B6ID0gKHdhbnRlZExldmVsID09PSAxKSA/XG4gICAgICAgICAgICAgICAgICAgIDUgOiAod2FudGVkTGV2ZWwgPT09IDIpID9cbiAgICAgICAgICAgICAgICAgICAgMTAgOiAod2FudGVkTGV2ZWwgPT09IDMpID9cbiAgICAgICAgICAgICAgICAgICAgMTUgOiAod2FudGVkTGV2ZWwgPT09IDQpID9cbiAgICAgICAgICAgICAgICAgICAgMjUgOiAod2FudGVkTGV2ZWwgPT09IDUpID9cbiAgICAgICAgICAgICAgICAgICAgNTAgOiAod2FudGVkTGV2ZWwgPT09IDYpID9cbiAgICAgICAgICAgICAgICAgICAgMTAwIDogMDtcblxuICAgIGlmIChjb3B6Lmxlbmd0aCA+PSBtYXhDb3B6KSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29sbGVjdCAocGxheWVyLCBjb2luKSB7XG4gICAgdGhpcy5zb3VuZHNbMV0ucGxheSgpO1xuICAgIHBsYXllci5zY29yZSsrO1xuICAgIGNvaW4uZGVzdHJveSgpO1xufVxuIiwidmFyIERBTUFHRSA9IDEwLCBLTk9DS0JBQ0sgPSAxMDAwLCBLTk9DS1VQID0gMjUwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvcEF0dGFjayAoY29wLCBwbGF5ZXIsIGVtaXR0ZXIpIHtcblxuICAgIHZhciBoaXQgPSBmYWxzZTtcblxuICAgIGlmIChwbGF5ZXIuYm9keS54IDwgY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIGxlZnRcbiAgICAgICAgaWYgKE1hdGguYWJzKE1hdGguZmxvb3IoY29wLmJvZHkueCkgLSBNYXRoLmZsb29yKHBsYXllci5ib2R5LngpIDwgMTApXG4gICAgICAgICAgICAmJiBNYXRoLmZsb29yKGNvcC5ib2R5LnkpID09PSBNYXRoLmZsb29yKHBsYXllci5ib2R5LnkpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLUtOT0NLVVA7XG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gLUtOT0NLQkFDSztcbiAgICAgICAgICAgIHBsYXllci5oZWFsdGggPSBwbGF5ZXIuaGVhbHRoIC0gREFNQUdFO1xuICAgICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChwbGF5ZXIuYm9keS54ID4gY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIHJpZ2h0XG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKHBsYXllci5ib2R5LngpIC0gTWF0aC5mbG9vcihjb3AuYm9keS54KSA8IDEwKVxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcihjb3AuYm9keS55KSA9PT0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS55KSkge1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1LTk9DS1VQO1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IEtOT0NLQkFDSztcbiAgICAgICAgICAgIHBsYXllci5oZWFsdGggPSBwbGF5ZXIuaGVhbHRoIC0gREFNQUdFO1xuICAgICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoaXQ7XG5cbn07XG4iLCIvLyBjb3BNb3ZlbWVudC5qc1xudmFyIFJVTl9TUEVFRCA9IDM1MDAsXG4gICAgTUFYX1NQRUVEID0gMjUwLFxuICAgIEpVTVBfViA9IDEwMDAsXG4gICAgQUlSX0RFQ0VMID0gMC4zMyxcbiAgICBBSVJfRFJBRyA9IDAsXG4gICAgRkxPT1JfRFJBRyA9IDUwMDAqMjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29wLCBwbGF5ZXIpIHtcblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLzMsIGNvcC5tYXhTcGVlZCAqIDEwKTtcbiAgICBlbHNlIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZCwgY29wLm1heFNwZWVkICogMTApO1xuXG4gICAgaWYgKHBsYXllci5ib2R5LnggPCBjb3AuYm9keS54KSB7XG4gICAgICAgIC8vIHBsYXllciBpcyB0byB0aGUgbGVmdFxuICAgICAgICBjb3AuYm9keS5hY2NlbGVyYXRpb24ueCA9IC1NYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBjb3Auc2NhbGUueCA9IC1NYXRoLmFicyhjb3Auc2NhbGUueCk7XG4gICAgICAgIGNvcC5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwbGF5ZXIuYm9keS54ID4gY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIHJpZ2h0XG4gICAgICAgIGNvcC5ib2R5LmFjY2VsZXJhdGlvbi54ID0gTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgY29wLnNjYWxlLnggPSBNYXRoLmFicyhjb3Auc2NhbGUueCk7XG4gICAgICAgIGNvcC5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gIFN0YW5kIHN0aWxsXG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAwO1xuICAgIH1cblxuXG59O1xuIiwidmFyIFJVTl9TUEVFRCA9IDM1MDAsXG4gICAgSlVNUF9WID0gMTAwMCxcbiAgICBBSVJfREVDRUwgPSAwLjMzLFxuICAgIEFJUl9EUkFHID0gMCxcbiAgICBGTE9PUl9EUkFHID0gNTAwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVyLCBjdXJzb3JzKSB7XG5cbiAgICBpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSBsZWZ0XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gLU1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIHBsYXllci5zY2FsZS54ID0gLU1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIHJpZ2h0XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSBNYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAvLyAgU3RhbmQgc3RpbGxcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IDA7XG5cbiAgICB9XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIHtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnanVtcCcpO1xuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ICogQUlSX0RFQ0VMO1xuICAgICAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKEFJUl9EUkFHLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKEZMT09SX0RSQUcsIDApO1xuICAgIH1cblxuICAgIC8vICBBbGxvdyB0aGUgcGxheWVyIHRvIGp1bXAgaWYgdGhleSBhcmUgdG91Y2hpbmcgdGhlIGdyb3VuZC5cbiAgICBpZiAoY3Vyc29ycy51cC5pc0Rvd24gJiYgcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bilcbiAgICB7XG4gICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtTWF0aC5hYnMoSlVNUF9WKTtcbiAgICAgICAgcGxheWVyLmp1bXBzKys7XG4gICAgICAgIGlmIChwbGF5ZXIuZmlyc3RKdW1wID09IG51bGwpIHtcbiAgICAgICAgICAgIHBsYXllci5maXJzdEp1bXAgPSB0aGlzLnRpbWUubm93O1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BsYXlXYW50ZWQgKHNwcml0ZXMsIHdsdmwpIHtcblxuICAgIHNwcml0ZXMuZm9yRWFjaChmdW5jdGlvbiAodixpKSB7XG4gICAgICAgIGlmIChpIDwgd2x2bCkgdi5hbHBoYSA9IDE7XG4gICAgfSk7XG5cbiAgICBpZiAod2x2bCA8IDYpIHtcbiAgICAgICAgc3ByaXRlc1s1XS5hbHBoYSA9IDA7XG4gICAgfVxuXG59XG4iLCIvLyB3YW50ZWRMZXZlbC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIpIHtcblxuICAgIHZhciB3YW50ZWRMZXZlbCA9IDAsXG4gICAgdGltZVNpbmNlRmlyc3RKdW1wID0gKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkgPyAwIDogTWF0aC5mbG9vcigodGhpcy50aW1lLm5vdyAtIHBsYXllci5maXJzdEp1bXApLzEwMDApLFxuICAgIHRvdGFsSnVtcHMgPSBwbGF5ZXIuanVtcHM7XG5cbiAgICBpZiAodG90YWxKdW1wcyA+IDApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAxO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDI7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gMTUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAzO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDMwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDMwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNDtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiA0MCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiA0NSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDU7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTAwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDYwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2FudGVkTGV2ZWw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUNvaW4gKGNhbWVyYSxzZXR4LHNldHkpIHtcblxuICAgIHZhciB4ID0gZ2V0UmFuZG9tSW50KGNhbWVyYS52aWV3LmxlZnQgKyAxNTAsIGNhbWVyYS52aWV3LnJpZ2h0IC0gMTUwKTtcbiAgICB2YXIgeSA9IGdldFJhbmRvbUludCgxNTAsIDMwMCk7XG4gICAgdmFyIGNvaW4gPSB0aGlzLmFkZC5zcHJpdGUoc2V0eCB8fCB4LCBzZXR5IHx8IHksICdjb2luJyk7XG4gICAgY29pbi5zY2FsZS5zZXRUbygwLjEpO1xuXG4gICAgcmV0dXJuIGNvaW47XG59XG5cblxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufVxuIiwiLy8gY29wLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDAsXG4gICAgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNhbWVyYSkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gMzIqMjtcbiAgICB2YXIgY29wO1xuICAgIHZhciBzcGF3bkxvY2F0aW9ucyA9IFtdO1xuXG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICBjYW1lcmEudmlldy5sZWZ0IC0gMzIsXG4gICAgICAgICAgICAtV09STERfT1ZFUkZMT1dcbiAgICAgICAgKVxuICAgICk7XG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5yaWdodCArIDMyLFxuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLndpZHRoK1dPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgc3ByaXRlTmFtZSA9ICdjb3AnICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICsgMSkudG9TdHJpbmcoKTtcbiAgICBjb3AgPSB0aGlzLmFkZC5zcHJpdGUoc3Bhd25Mb2NhdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjIpXSwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsIHNwcml0ZU5hbWUpO1xuICAgIGNvcC5saWZlc3BhbiA9IDYwMDAwO1xuICAgIGNvcC5ldmVudHMub25LaWxsZWQuYWRkKGZ1bmN0aW9uIChzcHJpdGUpe1xuICAgICAgICBzcHJpdGUuZGVzdHJveSgpO1xuICAgIH0pXG4gICAgLy8gY29wLnNjYWxlLnNldFRvKDIpO1xuICAgIGNvcC5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgY29wLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgY29wXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoY29wKTtcbiAgICBjb3AuYm9keS5zZXRTaXplKDI1LDUwLC0yLjUsNik7XG5cbiAgICAvLyAgY29wIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gY29wLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgY29wLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICAvLyBjb3AuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuICAgIC8vIChwYXJzZUZsb2F0KChNYXRoLnJhbmRvbSgpICogMSkudG9GaXhlZCgyKSwgMTApXG4gICAgdmFyIHNwZWVkcyA9IFs1MCwgMTAwLCAxNTAsIDIwMCwgMjUwXTtcbiAgICBjb3AubWF4U3BlZWQgPSBNYXRoLm1pbihNQVhfU1BFRUQgKyBzcGVlZHNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDUpKV0sIDM0NSk7XG4gICAgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgY29wLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMCwgMV0sIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDcpICsgMywgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzJdLCAxLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnLCBbMywgMywgNF0sIDIsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcblxuXG4gICAgcmV0dXJuIGNvcDtcbn07XG4iLCIvLyBmbG9vci5qc1xudmFyIFdPUkxEX09WRVJGTE9XO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBXT1JMRF9PVkVSRkxPVyA9IHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ3AxJykud2lkdGgqMjtcbiAgICB2YXIgZmxvb3I7XG5cbiAgICBmbG9vciA9IHRoaXMuYWRkLnNwcml0ZSgtV09STERfT1ZFUkZMT1csIHRoaXMud29ybGQuaGVpZ2h0LTYwLCAnc3AnKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShmbG9vcik7XG4gICAgZmxvb3IuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuICAgIGZsb29yLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgZmxvb3Iud2lkdGggPSB0aGlzLndvcmxkLndpZHRoICsgV09STERfT1ZFUkZMT1c7XG5cbiAgICByZXR1cm4gZmxvb3I7XG59O1xuIiwiLy8gcGxheWVyLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gVGhlIHBsYXllciBhbmQgaXRzIHNldHRpbmdzXG4gICAgdmFyIHBsYXllcjtcbiAgICBzcHJpdGVOYW1lID0gJ3AnICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICsgMSkudG9TdHJpbmcoKTtcbiAgICBwbGF5ZXIgPSB0aGlzLmFkZC5zcHJpdGUoMzIsIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCBzcHJpdGVOYW1lKTtcbiAgICAvLyBwbGF5ZXIuc2NhbGUuc2V0VG8oMik7XG4gICAgcGxheWVyLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBwbGF5ZXIuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBwbGF5ZXJcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwbGF5ZXIpO1xuICAgIHBsYXllci5ib2R5LnNldFNpemUoMjUsNTAsLTIuNSw2KTtcblxuICAgIC8vICBQbGF5ZXIgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICAvLyBwbGF5ZXIuYm9keS5ib3VuY2UueSA9IDAuMjtcbiAgICBwbGF5ZXIuYm9keS5ncmF2aXR5LnkgPSBHUkFWSVRZO1xuICAgIHBsYXllci5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG5cbiAgICBwbGF5ZXIuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhNQVhfU1BFRUQsIE1BWF9TUEVFRCAqIDEwKTtcbiAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKERSQUcsIDApO1xuXG4gICAgLy8gIE91ciB0d28gYW5pbWF0aW9ucywgd2Fsa2luZyBsZWZ0IGFuZCByaWdodC5cbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ3J1bicsIFswLCAxXSwgNiwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzJdLCAxLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnLCBbMywgMywgNF0sIDIsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcblxuICAgIC8vIG1pc2NcbiAgICBwbGF5ZXIuZmlyc3RKdW1wID0gbnVsbDtcbiAgICBwbGF5ZXIuanVtcHMgPSAwO1xuICAgIHBsYXllci5oZWFsdGggPSAxMDA7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdnb2QnKSA+IC0xKSBwbGF5ZXIuaGVhbHRoID0gSW5maW5pdHk7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnaHAnKSA+IC0xKSBwbGF5ZXIuaGVhbHRoID0gcGFyc2VJbnQod2luZG93LmxvY2F0aW9uLnNlYXJjaC5tYXRjaCgvaHA9KFxcZCspLylbMV0sIDEwKTtcbiAgICB9IGNhdGNoIChlKXt9XG4gICAgcGxheWVyLnNjb3JlID0gMDtcbiAgICBwbGF5ZXIuZGVhZCA9IGZhbHNlO1xuXG4gICAgLy8gY2FtZXJhXG4gICAgdGhpcy5jYW1lcmEuZm9sbG93KHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OKTtcbiAgICB0aGlzLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKFxuICAgICAgICB0aGlzLmdhbWUud2lkdGgvMiAtIERFQURaT05FX1dJRFRILzIsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHQsXG4gICAgICAgIERFQURaT05FX1dJRFRILFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0XG4gICAgKTtcblxuICAgIHJldHVybiBwbGF5ZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdsb2FkaW5nJywgJ2Fzc2V0cy9pbWcvdGl0bGUucG5nJyk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdsb2FkJyk7XG4gICAgfVxufTtcbiIsIi8vIGdhbWUuanNcblxuLy8gRXh0ZXJuYWxcbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2RlYm91bmNlJyk7XG5cbi8vIENyZWF0ZVxudmFyIGNyZWF0ZVBsYXllciA9IHJlcXVpcmUoJy4uL29iamVjdHMvcGxheWVyJyksXG4gICAgY3JlYXRlQ29wICAgPSByZXF1aXJlKCcuLi9vYmplY3RzL2NvcCcpLFxuICAgIGNyZWF0ZUNvaW4gPSByZXF1aXJlKCcuLi9vYmplY3RzL2NvaW4nKSxcbiAgICBjcmVhdGVGbG9vciA9IHJlcXVpcmUoJy4uL29iamVjdHMvZmxvb3InKTtcblxuLy8gVXBkYXRlXG52YXIgcGxheWVyTW92ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3BsYXllck1vdmVtZW50JyksXG4gICAgY29wTW92ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcE1vdmVtZW50JyksXG4gICAgY29wQXR0YWNrID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3BBdHRhY2snKSxcbiAgICB3YW50ZWRMZXZlbCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvd2FudGVkTGV2ZWwnKSxcbiAgICBjb2xsZWN0Q29pbiA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29sbGVjdCcpLFxuICAgIHNob3dXYW50ZWQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3dhbnRlZERpc3BsYXknKSxcbiAgICBjYW5TcGF3bkNvcHogPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NhblNwYXduQ29weicpO1xuXG4vLyBHbG9iYWxzXG5cbnZhciBwbGF5ZXIsIGZsb29yLCBjdXJzb3JzLCBjb3B6LCBzcHJpdGVzLFxuICAgIExBU1RfU1BBV04gPSAwLCBNQVhfQ09QWiA9IDIwMCwgTEFTVF9ISVQgPSAwLFxuICAgIE1BWF9DT0lOWiA9IDEsXG4gICAgTVVTSUMgPSB0cnVlLCBTT1VORCA9IHRydWUsXG4gICAgR0FNRV9PVkVSID0gZmFsc2U7XG5cbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ25vbXVzaWMnKSA+IC0xKSB7XG4gICAgICAgIE1VU0lDID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnbm9zb3VuZCcpID4gLTEpIHtcbiAgICAgICAgTVVTSUMgPSBTT1VORCA9IGZhbHNlO1xuICAgIH1cblxuZnVuY3Rpb24gcGFydGljbGVCdXJzdChlbWl0dGVyLCBwbGF5ZXIpIHtcblxuICAgIC8vICBQb3NpdGlvbiB0aGUgZW1pdHRlciB3aGVyZSB0aGUgbW91c2UvdG91Y2ggZXZlbnQgd2FzXG4gICAgZW1pdHRlci54ID0gcGxheWVyLmJvZHkueCArIHBsYXllci5ib2R5LndpZHRoLzI7XG4gICAgZW1pdHRlci55ID0gcGxheWVyLmJvZHkueSArIHBsYXllci5ib2R5LmhlaWdodC8yO1xuXG4gICAgLy8gIFRoZSBmaXJzdCBwYXJhbWV0ZXIgc2V0cyB0aGUgZWZmZWN0IHRvIFwiZXhwbG9kZVwiIHdoaWNoIG1lYW5zIGFsbCBwYXJ0aWNsZXMgYXJlIGVtaXR0ZWQgYXQgb25jZVxuICAgIC8vICBUaGUgc2Vjb25kIGdpdmVzIGVhY2ggcGFydGljbGUgYSAyMDAwbXMgbGlmZXNwYW5cbiAgICAvLyAgVGhlIHRoaXJkIGlzIGlnbm9yZWQgd2hlbiB1c2luZyBidXJzdC9leHBsb2RlIG1vZGVcbiAgICAvLyAgVGhlIGZpbmFsIHBhcmFtZXRlciAoMTApIGlzIGhvdyBtYW55IHBhcnRpY2xlcyB3aWxsIGJlIGVtaXR0ZWQgaW4gdGhpcyBzaW5nbGUgYnVyc3RcbiAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMDAwMDAwLCBudWxsLCAxMDApO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVDcmVhdGUgKCkge1xuICAgIEdBTUVfT1ZFUiA9IGZhbHNlXG4gICAgLy8gZW5hYmxlIHBoeXNpY3NcbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcblxuICAgIC8vIHdvcmxkIGJvdW5kc1xuICAgIHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIDAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgqMiwgdGhpcy5nYW1lLmhlaWdodCk7XG5cbiAgICAvLyBkb250IHNtb290aCBhcnRcbiAgICB0aGlzLnN0YWdlLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgYmFja2dyb3VuZFxuICAgIGJsdWVza3kgPSB0aGlzLmFkZC5pbWFnZSgwLCAwLCAnYmx1ZXNreScpO1xuICAgIHB1bmtza3kgPSB0aGlzLmFkZC5pbWFnZSgwLCAwLCAncHVua3NreScpO1xuICAgIGJsdWVza3kuZml4ZWRUb0NhbWVyYSA9IHB1bmtza3kuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgYmx1ZXNreS53aWR0aCA9IHB1bmtza3kud2lkdGggPSB0aGlzLmdhbWUud2lkdGg7XG4gICAgcHVua3NreS5hbHBoYSA9IDA7XG4gICAgdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKTtcblxuICAgIC8vIGFkZCBmbG9vclxuICAgIGZsb29yID0gY3JlYXRlRmxvb3IuYmluZCh0aGlzKSgpO1xuXG4gICAgLy8gYWRkIHNpZ25cbiAgICB0aGlzLmFkZC5pbWFnZSgxMzAsIHRoaXMuZ2FtZS5oZWlnaHQgLSAxNjAsICdzaWduJyk7XG4gICAgdmFyIHggPSAxMDtcbiAgICB2YXIgZGl2ID0gdGhpcy53b3JsZC53aWR0aC94O1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHg7IGkrKykge1xuICAgICAgICB0aGlzLmFkZC5pbWFnZShcbiAgICAgICAgICAgIGdldFJhbmRvbUludChcbiAgICAgICAgICAgICAgICBNYXRoLm1heCgyNTAsIGRpdippKSxcbiAgICAgICAgICAgICAgICAoaSA9PT0gMSkgPyBNYXRoLm1pbihkaXYqKGkrMSksIDgwMCk6IGRpdiooaSsxKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5oZWlnaHQgLSA2MCxcbiAgICAgICAgICAgIChNYXRoLnJhbmRvbSgpPC4zMykgPyAncmFtcCcgOiAnYmluJ1xuICAgICAgICApO1xuICAgIH07XG5cblxuICAgIC8vIGVtaXR0ZXJcbiAgICBlbWl0dGVyID0gdGhpcy5hZGQuZW1pdHRlcigwLCAwLCAyMDAwKTtcbiAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ2JsJyk7XG4gICAgZW1pdHRlci5ncmF2aXR5ID0gOTAwO1xuXG4gICAgLy8gYWRkIHBsYXllclxuICAgIHBsYXllciA9IGNyZWF0ZVBsYXllci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBjb250cm9sc1xuICAgIGN1cnNvcnMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcblxuICAgIC8vIGNvcHpcbiAgICBjb3B6ID0gdGhpcy5hZGQuZ3JvdXAoKTtcblxuICAgIC8vIGNvaW56XG4gICAgY29pbnogPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgIGNvaW56LmVuYWJsZUJvZHkgPSB0cnVlO1xuICAgIGNvaW56LmFkZChjcmVhdGVDb2luLmJpbmQodGhpcykodGhpcy5jYW1lcmEsIDI1MCwgMjUwKSk7XG5cbiAgICAvLyB3YW50ZWQgbGV2ZWxcbiAgICB2YXIgc3ByaXRlV2lkdGggPSB0aGlzLmNhY2hlLmdldEltYWdlKCd3YW50ZWQnKS53aWR0aCAqIDAuMDc1O1xuICAgIHZhciB3MSA9IHRoaXMuYWRkLnNwcml0ZSgxNiwgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzIgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDEsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHczID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiAyLCAxNiwgJ3dhbnRlZCcpO1xuICAgIHZhciB3NCA9IHRoaXMuYWRkLnNwcml0ZSgxNiArIHNwcml0ZVdpZHRoICogMywgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzUgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDQsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHc2ID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiA1LCAxNiwgJ3dhbnRlZCcpO1xuXG4gICAgc3ByaXRlcyA9IFt3MSx3Mix3Myx3NCx3NSx3Nl07XG4gICAgc3ByaXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHYuYWxwaGEgPSAwO1xuICAgICAgICB2LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB2LnNjYWxlLnNldFRvKDAuMDc1KTtcbiAgICB9KTtcblxuICAgIC8vIGhwIHRleHRcbiAgICBocFRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ251bWJlcnMnLCAzNiwgNTQsICcwMTIzNDU2Nzg5JywgMTAsIDAsIDApO1xuICAgIGhwVGV4dC50ZXh0ID0gcGxheWVyLmhlYWx0aC50b1N0cmluZygpO1xuICAgIGhwRGlzcGxheSA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS53aWR0aCAtIDEyMCwgMTYsIGhwVGV4dCk7XG4gICAgaHBEaXNwbGF5LnRpbnQgPSAweGZmMDAwMDtcbiAgICBocERpc3BsYXkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBzY29yZSB0ZXh0XG4gICAgc2NvcmVUZXh0ID0gdGhpcy5hZGQucmV0cm9Gb250KCdudW1iZXJzJywgMzYsIDU0LCAnMDEyMzQ1Njc4OScsIDEwLCAwLCAwKTtcbiAgICBzY29yZVRleHQudGV4dCA9IHBsYXllci5oZWFsdGgudG9TdHJpbmcoKTtcbiAgICBzY29yZURpc3BsYXkgPSB0aGlzLmFkZC5pbWFnZSh0aGlzLmdhbWUud2lkdGggLSAyNTAsIDE2LCBzY29yZVRleHQpO1xuICAgIHNjb3JlRGlzcGxheS50aW50ID0gMHhmZmZmMDA7XG4gICAgc2NvcmVEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgLy9zaGFkZVxuICAgIHNoYWRlID0gdGhpcy5hZGQuZ3JhcGhpY3MoMCwgMCk7XG4gICAgc2hhZGUuYmVnaW5GaWxsKDB4MDAwMDAwLCAxKTtcbiAgICBzaGFkZS5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuICAgIHNoYWRlLmVuZEZpbGwoKTtcbiAgICBzaGFkZS5hbHBoYSA9IDA7XG4gICAgc2hhZGUuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBnYW1lIG92ZXIgdGV4dFxuICAgIHZhciBnYW1lT3ZlciA9IFtcbiAgICAgICAgJ1lPVSBMT1NFIScsXG4gICAgICAgICdHQU1FIE9WRVIhJyxcbiAgICAgICAgJ0xPU0VSIScsXG4gICAgICAgICdTVUNLWiAyIEIgVSEnLFxuICAgICAgICAnRFJFQU0gT04hJyxcbiAgICAgICAgJ0lOIFlPVVIgRkFDRSEnLFxuICAgICAgICAnR09PRE5JR0hUIScsXG4gICAgICAgICdOTyBGVVRVUkUhJyxcbiAgICAgICAgJ1BVTktTIERFQUQnXG4gICAgXTtcbiAgICBnYW1lb3ZlclRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ2ZvbnQnLCA2OS40LCA2Ny41LCAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVohPy4sMTIzNDU2Nzg5MCcsIDUsIDAsIDApO1xuICAgIGdhbWVvdmVyVGV4dC50ZXh0ID0gZ2FtZU92ZXJbZ2V0UmFuZG9tSW50KDAsIGdhbWVPdmVyLmxlbmd0aC0xKV07XG4gICAgZ2FtZW92ZXJEaXNwbGF5ID0gdGhpcy5hZGQuaW1hZ2UodGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMywgZ2FtZW92ZXJUZXh0KTtcbiAgICBnYW1lb3ZlckRpc3BsYXkuYWxwaGEgPSAwO1xuICAgIGdhbWVvdmVyRGlzcGxheS50aW50ID0gMHhmZjAwMDA7XG4gICAgZ2FtZW92ZXJEaXNwbGF5LmFuY2hvci54ID0gTWF0aC5yb3VuZChnYW1lb3ZlclRleHQud2lkdGggKiAwLjUpIC8gZ2FtZW92ZXJUZXh0LndpZHRoO1xuICAgIGdhbWVvdmVyRGlzcGxheS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIHZhciByZXBsYXkgPSBbXG4gICAgICAgICdSZXBsYXk/JyxcbiAgICAgICAgJ0dvIGFnYWluPycsXG4gICAgICAgICdUcnkgYWdhaW4/JyxcbiAgICAgICAgJ09uY2UgbW9yZT8nLFxuICAgICAgICAnQW5vdGhlciBzaG90PydcbiAgICBdO1xuICAgIHJlcGxheVRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ2ZvbnQnLCA2OS40LCA2Ny41LCAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVohPy4sMTIzNDU2Nzg5MCcsIDUsIDAsIDApO1xuICAgIHJlcGxheVRleHQudGV4dCA9IHJlcGxheVtnZXRSYW5kb21JbnQoMCwgcmVwbGF5Lmxlbmd0aC0xKV07XG4gICAgcmVwbGF5RGlzcGxheSA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS53aWR0aC8yLCB0aGlzLmdhbWUuaGVpZ2h0LzIsIHJlcGxheVRleHQpO1xuICAgIHJlcGxheURpc3BsYXkuYWxwaGEgPSAwO1xuICAgIHJlcGxheURpc3BsYXkudGludCA9IDB4ZmYwMDAwO1xuICAgIHJlcGxheURpc3BsYXkuYW5jaG9yLnggPSBNYXRoLnJvdW5kKHJlcGxheVRleHQud2lkdGggKiAwLjUpIC8gcmVwbGF5VGV4dC53aWR0aDtcbiAgICByZXBsYXlEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgLy8gU291bmRcbiAgICB2YXIgcHVua0xvb3AgPSB0aGlzLmFkZC5hdWRpbygncHVua0xvb3AnKTtcbiAgICB2YXIgcGlja3VwID0gdGhpcy5hZGQuYXVkaW8oJ3BpY2t1cCcpO1xuICAgIHZhciBncnVudDEgPSB0aGlzLmFkZC5hdWRpbygnZ3J1bnQxJyk7XG4gICAgdmFyIGdydW50MiA9IHRoaXMuYWRkLmF1ZGlvKCdncnVudDInKTtcbiAgICB0aGlzLnNvdW5kcyA9IFtwdW5rTG9vcCwgcGlja3VwLCBncnVudDEsIGdydW50Ml07XG4gICAgaWYgKCFNVVNJQykgdGhpcy5zb3VuZHNbMF0udm9sdW1lID0gMDtcbiAgICBpZiAoIVNPVU5EKSB0aGlzLnNvdW5kLnZvbHVtZSA9IDA7XG5cbn1cblxuXG5mdW5jdGlvbiBnYW1lVXBkYXRlICh0ZXN0KSB7XG4gICAgaWYgKCF0aGlzLnNvdW5kc1swXS5pc1BsYXlpbmcgJiYgTVVTSUMgJiYgU09VTkQpIHRoaXMuc291bmRzWzBdLmxvb3BGdWxsKDEpO1xuICAgIC8vIENvbGxpc2lvbnNcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBmbG9vcik7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGNvcHosIGZsb29yKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoZW1pdHRlciwgZmxvb3IsIGZ1bmN0aW9uIChhLGIpIHtcbiAgICAgICAgYS5ib2R5LnZlbG9jaXR5LnggPSBhLmJvZHkudmVsb2NpdHkueSA9IDA7XG4gICAgICAgIGIuYm9keS52ZWxvY2l0eS54ID0gYi5ib2R5LnZlbG9jaXR5LnkgPSAwO1xuICAgIH0pO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIGNvaW56LCBjb2xsZWN0Q29pbiwgbnVsbCwgdGhpcyk7XG4gICAgaWYgKCFHQU1FX09WRVIpIHtcbiAgICAgICAgLy8gUGxheWVyXG4gICAgICAgIHBsYXllck1vdmVtZW50LmJpbmQodGhpcykocGxheWVyLCBjdXJzb3JzKTtcblxuICAgICAgICAvLyBDb3B6XG4gICAgICAgIHZhciB3bHZsID0gd2FudGVkTGV2ZWwuYmluZCh0aGlzKShwbGF5ZXIpO1xuICAgICAgICBpZiAoY2FuU3Bhd25Db3B6LmJpbmQodGhpcykoY29weiwgd2x2bCkpIHtcbiAgICAgICAgICAgIGlmICggKHRoaXMudGltZS5ub3cgLSBMQVNUX1NQQVdOKSA+ICgzMDAwL3dsdmwpICkge1xuICAgICAgICAgICAgICAgIGNvcHouYWRkKGNyZWF0ZUNvcC5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgICAgICAgICAgICAgTEFTVF9TUEFXTiA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAoY29wei5sZW5ndGggPiA1MCkgY29wei5jaGlsZHJlblswXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzO1xuICAgICAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICAgICAgY29wTW92ZW1lbnQoY29wLCBwbGF5ZXIpO1xuICAgICAgICAgICAgaWYgKCAoZ2FtZS50aW1lLm5vdyAtIExBU1RfSElUKSA+IDY2NiApIHtcbiAgICAgICAgICAgICAgICB2YXIgaGl0ID0gY29wQXR0YWNrKGNvcCwgcGxheWVyLCBlbWl0dGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlQnVyc3QoZW1pdHRlciwgcGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zb3VuZHNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIpICsgMildLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgTEFTVF9ISVQgPSBnYW1lLnRpbWUubm93O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBsYXllci5qdW1wcyA+IDApIHtcbiAgICAgICAgICAgIC8vIHdhbnRlZFRleHQuZmlsbCA9ICcjZmZmJztcbiAgICAgICAgICAgIC8vIHdhbnRlZFRleHQudGV4dCA9ICdXYW50ZWQgbGV2ZWw6ICcgKyB3bHZsO1xuICAgICAgICAgICAgaHBUZXh0LnRleHQgPSBwbGF5ZXIuaGVhbHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAocHVua3NreS5hbHBoYSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkLnR3ZWVuKHB1bmtza3kpLnRvKCB7IGFscGhhOiAxIH0sIDEwMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluT3V0LCB0cnVlLCAwLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2NvcmVUZXh0LnRleHQgPSAnJyArIHBsYXllci5zY29yZTtcbiAgICAgICAgc2hvd1dhbnRlZC5iaW5kKHRoaXMpKHNwcml0ZXMsIHdsdmwpO1xuXG4gICAgICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgICAgICBpZiAoY29wLmJvZHkueCA8IGdhbWUuY2FtZXJhLnZpZXcubGVmdCAtIDIwMCB8fCBjb3AuYm9keS54ID4gZ2FtZS5jYW1lcmEudmlldy5yaWdodCArIDIwMCApIGNvcC5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb2luei5mb3JFYWNoKGZ1bmN0aW9uIChjb2luKSB7XG4gICAgICAgICAgICBpZiAoY29pbi5ib2R5LnggPCBnYW1lLmNhbWVyYS52aWV3LmxlZnQgLSAyMDAgfHwgY29pbi5ib2R5LnggPiBnYW1lLmNhbWVyYS52aWV3LnJpZ2h0ICsgMjAwICkgY29pbi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjb2luei5sZW5ndGggPCB3bHZsKSB7XG4gICAgICAgICAgICBjb2luei5hZGQoY3JlYXRlQ29pbi5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGxheWVyLmhlYWx0aCA8IDEpIHtcbiAgICAgICAgICAgIEdBTUVfT1ZFUiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXllci54ID4gNDYyNSAmJiBwbGF5ZXIuanVtcHMgPT09IDApIEdBTUVfT1ZFUiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR0FNRSBPVkVSXG4gICAgICAgIGlmICghcGxheWVyLmRlYWQpIHtcbiAgICAgICAgICAgIHBsYXllci5kZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgIHBsYXllci5raWxsKCk7XG4gICAgICAgICAgICBkZWF0aCA9IHRoaXMuYWRkLmVtaXR0ZXIoMCwgMCwgMSk7XG4gICAgICAgICAgICBkZWF0aC5tYWtlUGFydGljbGVzKHBsYXllci5rZXkpO1xuICAgICAgICAgICAgZGVhdGguZ3Jhdml0eSA9IDEwMDtcbiAgICAgICAgICAgIGRlYXRoLnggPSBwbGF5ZXIuYm9keS54ICsgcGxheWVyLmJvZHkud2lkdGgvMjtcbiAgICAgICAgICAgIGRlYXRoLnkgPSBwbGF5ZXIuYm9keS55ICsgcGxheWVyLmJvZHkuaGVpZ2h0LzI7XG4gICAgICAgICAgICBkZWF0aC5zdGFydCh0cnVlLCA1MDAwMDAwMCwgbnVsbCwgMSk7XG4gICAgICAgICAgICB0aGlzLmFkZC50d2VlbihnYW1lb3ZlckRpc3BsYXkpLnRvKCB7IGFscGhhOiAwLjc1IH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDAsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuYWRkLnR3ZWVuKHJlcGxheURpc3BsYXkpLnRvKCB7IGFscGhhOiAwLjc1IH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDI1MCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5hZGQudHdlZW4oc2hhZGUpLnRvKCB7IGFscGhhOiAxIH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDE1MDAsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIHJlcGxheURpc3BsYXkuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcGxheURpc3BsYXkuZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZC5zdG9wQWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICByZXBsYXlEaXNwbGF5LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlcGxheURpc3BsYXkuYWxwaGEgPSAxO1xuICAgICAgICAgICAgfSwgcmVwbGF5RGlzcGxheSk7XG4gICAgICAgICAgICByZXBsYXlEaXNwbGF5LmV2ZW50cy5vbklucHV0T3V0LmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVwbGF5RGlzcGxheS5hbHBoYSA9IDAuNzU7XG4gICAgICAgICAgICB9LCByZXBsYXlEaXNwbGF5KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnZGVidWcnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShwbGF5ZXIpO1xuICAgICAgICAgICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShjb3ApO1xuICAgICAgICAgICAgfSwgdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcudGV4dCh0aGlzLmdhbWUudGltZS5mcHMgKycgZnBzJyB8fCAnLS0nLCAyLCAxNCwgXCIjMDBmZjAwXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsb2FkaW5nID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoLzIsIDAsICdsb2FkaW5nJyk7XG4gICAgICAgIGxvYWRpbmcuYW5jaG9yLnggPSBNYXRoLnJvdW5kKGxvYWRpbmcud2lkdGggKiAwLjUpIC8gbG9hZGluZy53aWR0aDtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc2V0UHJlbG9hZFNwcml0ZShsb2FkaW5nKTtcblxuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AxJywgJ2Fzc2V0cy9pbWcvcHVuazEucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AyJywgJ2Fzc2V0cy9pbWcvcHVuazIucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AzJywgJ2Fzc2V0cy9pbWcvcHVuazMucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3A0JywgJ2Fzc2V0cy9pbWcvcHVuazQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMScsICdhc3NldHMvaW1nL2NvcDEucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDInLCAnYXNzZXRzL2ltZy9jb3AyLnBuZycsIDYxLjgsIDg2KTtcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AzJywgJ2Fzc2V0cy9pbWcvY29wMy5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wNCcsICdhc3NldHMvaW1nL2NvcDQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnY29pbicsICdhc3NldHMvaW1nL2FuYXJjaHljb2luLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3dhbnRlZCcsICdhc3NldHMvaW1nL3dhbnRlZC5wbmcnKTtcblxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvYmctbmV3LnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JsdWVza3knLCAnYXNzZXRzL2ltZy9ibHVlc2t5LnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3B1bmtza3knLCAnYXNzZXRzL2ltZy9wdW5rc2t5LnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NwJywgJ2Fzc2V0cy9pbWcvc3BhY2VyLmdpZicpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JsJywgJ2Fzc2V0cy9pbWcvYmxvb2QuZ2lmJyk7XG5cbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdzaWduJywgJ2Fzc2V0cy9pbWcvc2lnbi5wbmcnKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdyYW1wJywgJ2Fzc2V0cy9pbWcvcmFtcC5wbmcnKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdiaW4nLCAnYXNzZXRzL2ltZy9iaW4ucG5nJyk7XG5cbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdwdW5rTG9vcCcsICdhc3NldHMvc291bmQvcHVua2xvb3AubXAzJyk7XG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygncGlja3VwJywgJ2Fzc2V0cy9zb3VuZC9hbHJpZ2h0Lm1wMycpO1xuICAgICAgICB0aGlzLmxvYWQuYXVkaW8oJ2dydW50MScsICdhc3NldHMvc291bmQvZ3J1bnQxLm1wMycpO1xuICAgICAgICB0aGlzLmxvYWQuYXVkaW8oJ2dydW50MicsICdhc3NldHMvc291bmQvZ3J1bnQyLm1wMycpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbnVtYmVycycsICdhc3NldHMvaW1nL251bWJlcnMucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnZm9udCcsICdhc3NldHMvaW1nL2ZvbnQucG5nJyk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdhbWUuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9XG59O1xuIl19
