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
    // this.add.tileSprite(0, -90, this.cache.getImage('bg').width*2, this.cache.getImage('bg').height, 'bg');
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
        'GOODNIGHT, JOHNBOY',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb2xsZWN0LmpzIiwic3JjL21vZHVsZXMvY29wQXR0YWNrLmpzIiwic3JjL21vZHVsZXMvY29wTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3dhbnRlZERpc3BsYXkuanMiLCJzcmMvbW9kdWxlcy93YW50ZWRMZXZlbC5qcyIsInNyYy9vYmplY3RzL2NvaW4uanMiLCJzcmMvb2JqZWN0cy9jb3AuanMiLCJzcmMvb2JqZWN0cy9mbG9vci5qcyIsInNyYy9vYmplY3RzL3BsYXllci5qcyIsInNyYy9zdGF0ZXMvYm9vdC5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgbm93ID0gcmVxdWlyZSgnZGF0ZS1ub3cnKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAqIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gKlxuICogQHNvdXJjZSB1bmRlcnNjb3JlLmpzXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSl7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgaWYgKG51bGwgPT0gd2FpdCkgd2FpdCA9IDEwMDtcblxuICBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IG5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXN0YW1wID0gbm93KCk7XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IG5vd1xuXG5mdW5jdGlvbiBub3coKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG59XG4iLCJjb25zb2xlLmxvZygnI3B1bmtqYW0nKTtcblxuLy8gR2FtZVxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoOTYwLCA1NDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpO1xuXG4vLyBTdGF0ZXNcbmdhbWUuc3RhdGUuYWRkKCdib290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdsb2FkJywgcmVxdWlyZSgnLi9zdGF0ZXMvbG9hZCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdnYW1lJywgcmVxdWlyZSgnLi9zdGF0ZXMvZ2FtZScpKTtcblxuLy8gU3RhcnRcbmdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcbiIsIi8vIGNhblNwYXduQ29wei5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb3B6LCB3YW50ZWRMZXZlbCkge1xuICAgIGlmICh3YW50ZWRMZXZlbCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIG1heENvcHogPSAod2FudGVkTGV2ZWwgPT09IDEpID9cbiAgICAgICAgICAgICAgICAgICAgNSA6ICh3YW50ZWRMZXZlbCA9PT0gMikgP1xuICAgICAgICAgICAgICAgICAgICAxMCA6ICh3YW50ZWRMZXZlbCA9PT0gMykgP1xuICAgICAgICAgICAgICAgICAgICAxNSA6ICh3YW50ZWRMZXZlbCA9PT0gNCkgP1xuICAgICAgICAgICAgICAgICAgICAyNSA6ICh3YW50ZWRMZXZlbCA9PT0gNSkgP1xuICAgICAgICAgICAgICAgICAgICA1MCA6ICh3YW50ZWRMZXZlbCA9PT0gNikgP1xuICAgICAgICAgICAgICAgICAgICAxMDAgOiAwO1xuXG4gICAgaWYgKGNvcHoubGVuZ3RoID49IG1heENvcHopIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb2xsZWN0IChwbGF5ZXIsIGNvaW4pIHtcbiAgICB0aGlzLnNvdW5kc1sxXS5wbGF5KCk7XG4gICAgcGxheWVyLnNjb3JlKys7XG4gICAgY29pbi5kZXN0cm95KCk7XG59XG4iLCJ2YXIgREFNQUdFID0gMTAsIEtOT0NLQkFDSyA9IDEwMDAsIEtOT0NLVVAgPSAyNTA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29wQXR0YWNrIChjb3AsIHBsYXllciwgZW1pdHRlcikge1xuXG4gICAgdmFyIGhpdCA9IGZhbHNlO1xuXG4gICAgaWYgKHBsYXllci5ib2R5LnggPCBjb3AuYm9keS54KSB7XG4gICAgICAgIC8vIHBsYXllciBpcyB0byB0aGUgbGVmdFxuICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihjb3AuYm9keS54KSAtIE1hdGguZmxvb3IocGxheWVyLmJvZHkueCkgPCAxMClcbiAgICAgICAgICAgICYmIE1hdGguZmxvb3IoY29wLmJvZHkueSkgPT09IE1hdGguZmxvb3IocGxheWVyLmJvZHkueSkpIHtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtS05PQ0tVUDtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAtS05PQ0tCQUNLO1xuICAgICAgICAgICAgcGxheWVyLmhlYWx0aCA9IHBsYXllci5oZWFsdGggLSBEQU1BR0U7XG4gICAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHBsYXllci5ib2R5LnggPiBjb3AuYm9keS54KSB7XG4gICAgICAgIC8vIHBsYXllciBpcyB0byB0aGUgcmlnaHRcbiAgICAgICAgaWYgKE1hdGguYWJzKE1hdGguZmxvb3IocGxheWVyLmJvZHkueCkgLSBNYXRoLmZsb29yKGNvcC5ib2R5LngpIDwgMTApXG4gICAgICAgICAgICAmJiBNYXRoLmZsb29yKGNvcC5ib2R5LnkpID09PSBNYXRoLmZsb29yKHBsYXllci5ib2R5LnkpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLUtOT0NLVVA7XG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gS05PQ0tCQUNLO1xuICAgICAgICAgICAgcGxheWVyLmhlYWx0aCA9IHBsYXllci5oZWFsdGggLSBEQU1BR0U7XG4gICAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhpdDtcblxufTtcbiIsIi8vIGNvcE1vdmVtZW50LmpzXG52YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBNQVhfU1BFRUQgPSAyNTAsXG4gICAgSlVNUF9WID0gMTAwMCxcbiAgICBBSVJfREVDRUwgPSAwLjMzLFxuICAgIEFJUl9EUkFHID0gMCxcbiAgICBGTE9PUl9EUkFHID0gNTAwMCoyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb3AsIHBsYXllcikge1xuXG4gICAgaWYgKCFwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQvMywgY29wLm1heFNwZWVkICogMTApO1xuICAgIGVsc2UgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLCBjb3AubWF4U3BlZWQgKiAxMCk7XG5cbiAgICBpZiAocGxheWVyLmJvZHkueCA8IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSBsZWZ0XG4gICAgICAgIGNvcC5ib2R5LmFjY2VsZXJhdGlvbi54ID0gLU1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIGNvcC5zY2FsZS54ID0gLU1hdGguYWJzKGNvcC5zY2FsZS54KTtcbiAgICAgICAgY29wLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBsYXllci5ib2R5LnggPiBjb3AuYm9keS54KSB7XG4gICAgICAgIC8vIHBsYXllciBpcyB0byB0aGUgcmlnaHRcbiAgICAgICAgY29wLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBjb3Auc2NhbGUueCA9IE1hdGguYWJzKGNvcC5zY2FsZS54KTtcbiAgICAgICAgY29wLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgU3RhbmQgc3RpbGxcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IDA7XG4gICAgfVxuXG5cbn07XG4iLCJ2YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIsIGN1cnNvcnMpIHtcblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIGxlZnRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSAtTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcblxuICAgIH1cblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikge1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggKiBBSVJfREVDRUw7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oQUlSX0RSQUcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRkxPT1JfRFJBRywgMCk7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1NYXRoLmFicyhKVU1QX1YpO1xuICAgICAgICBwbGF5ZXIuanVtcHMrKztcbiAgICAgICAgaWYgKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkge1xuICAgICAgICAgICAgcGxheWVyLmZpcnN0SnVtcCA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGxheVdhbnRlZCAoc3ByaXRlcywgd2x2bCkge1xuXG4gICAgc3ByaXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LGkpIHtcbiAgICAgICAgaWYgKGkgPCB3bHZsKSB2LmFscGhhID0gMTtcbiAgICB9KTtcblxuICAgIGlmICh3bHZsIDwgNikge1xuICAgICAgICBzcHJpdGVzWzVdLmFscGhhID0gMDtcbiAgICB9XG5cbn1cbiIsIi8vIHdhbnRlZExldmVsLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllcikge1xuXG4gICAgdmFyIHdhbnRlZExldmVsID0gMCxcbiAgICB0aW1lU2luY2VGaXJzdEp1bXAgPSAocGxheWVyLmZpcnN0SnVtcCA9PSBudWxsKSA/IDAgOiBNYXRoLmZsb29yKCh0aGlzLnRpbWUubm93IC0gcGxheWVyLmZpcnN0SnVtcCkvMTAwMCksXG4gICAgdG90YWxKdW1wcyA9IHBsYXllci5qdW1wcztcblxuICAgIGlmICh0b3RhbEp1bXBzID4gMCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDE7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gNSB8fCB0aW1lU2luY2VGaXJzdEp1bXAgPiA1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMjtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAxNSB8fCB0aW1lU2luY2VGaXJzdEp1bXAgPiAxNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDM7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMzAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gMzApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA0O1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDQwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDQ1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNTtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAxMDAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gNjApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA2O1xuICAgIH1cblxuICAgIHJldHVybiB3YW50ZWRMZXZlbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQ29pbiAoY2FtZXJhLHNldHgsc2V0eSkge1xuXG4gICAgdmFyIHggPSBnZXRSYW5kb21JbnQoY2FtZXJhLnZpZXcubGVmdCArIDE1MCwgY2FtZXJhLnZpZXcucmlnaHQgLSAxNTApO1xuICAgIHZhciB5ID0gZ2V0UmFuZG9tSW50KDE1MCwgMzAwKTtcbiAgICB2YXIgY29pbiA9IHRoaXMuYWRkLnNwcml0ZShzZXR4IHx8IHgsIHNldHkgfHwgeSwgJ2NvaW4nKTtcbiAgICBjb2luLnNjYWxlLnNldFRvKDAuMSk7XG5cbiAgICByZXR1cm4gY29pbjtcbn1cblxuXG5mdW5jdGlvbiBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG59XG4iLCIvLyBjb3AuanNcbnZhciBERUFEWk9ORV9XSURUSCA9IDQwMCxcbiAgICBNQVhfU1BFRUQgPSAzNTAsXG4gICAgQUNDRUxFUkFUSU9OID0gMTAwMCxcbiAgICBEUkFHID0gMTAwMCxcbiAgICBHUkFWSVRZID0gMjAwMCxcbiAgICBXT1JMRF9PVkVSRkxPVztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2FtZXJhKSB7XG4gICAgV09STERfT1ZFUkZMT1cgPSAzMioyO1xuICAgIHZhciBjb3A7XG4gICAgdmFyIHNwYXduTG9jYXRpb25zID0gW107XG5cbiAgICBzcGF3bkxvY2F0aW9ucy5wdXNoKFxuICAgICAgICBNYXRoLm1heChcbiAgICAgICAgICAgIGNhbWVyYS52aWV3LmxlZnQgLSAzMixcbiAgICAgICAgICAgIC1XT1JMRF9PVkVSRkxPV1xuICAgICAgICApXG4gICAgKTtcbiAgICBzcGF3bkxvY2F0aW9ucy5wdXNoKFxuICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICAgIGNhbWVyYS52aWV3LnJpZ2h0ICsgMzIsXG4gICAgICAgICAgICB0aGlzLmdhbWUud29ybGQud2lkdGgrV09STERfT1ZFUkZMT1dcbiAgICAgICAgKVxuICAgICk7XG5cbiAgICBzcHJpdGVOYW1lID0gJ2NvcCcgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkgKyAxKS50b1N0cmluZygpO1xuICAgIGNvcCA9IHRoaXMuYWRkLnNwcml0ZShzcGF3bkxvY2F0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMildLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgc3ByaXRlTmFtZSk7XG4gICAgY29wLmxpZmVzcGFuID0gNjAwMDA7XG4gICAgY29wLmV2ZW50cy5vbktpbGxlZC5hZGQoZnVuY3Rpb24gKHNwcml0ZSl7XG4gICAgICAgIHNwcml0ZS5kZXN0cm95KCk7XG4gICAgfSlcbiAgICAvLyBjb3Auc2NhbGUuc2V0VG8oMik7XG4gICAgY29wLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBjb3Auc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBjb3BcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShjb3ApO1xuICAgIGNvcC5ib2R5LnNldFNpemUoMjUsNTAsLTIuNSw2KTtcblxuICAgIC8vICBjb3AgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICAvLyBjb3AuYm9keS5ib3VuY2UueSA9IDAuMjtcbiAgICBjb3AuYm9keS5ncmF2aXR5LnkgPSBHUkFWSVRZO1xuICAgIC8vIGNvcC5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG4gICAgLy8gKHBhcnNlRmxvYXQoKE1hdGgucmFuZG9tKCkgKiAxKS50b0ZpeGVkKDIpLCAxMClcbiAgICB2YXIgc3BlZWRzID0gWzUwLCAxMDAsIDE1MCwgMjAwLCAyNTBdO1xuICAgIGNvcC5tYXhTcGVlZCA9IE1hdGgubWluKE1BWF9TUEVFRCArIHNwZWVkc1tNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogNSkpXSwgMzQ1KTtcbiAgICBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQsIGNvcC5tYXhTcGVlZCAqIDEwKTtcbiAgICBjb3AuYm9keS5kcmFnLnNldFRvKERSQUcsIDApO1xuXG4gICAgLy8gIE91ciB0d28gYW5pbWF0aW9ucywgd2Fsa2luZyBsZWZ0IGFuZCByaWdodC5cbiAgICBjb3AuYW5pbWF0aW9ucy5hZGQoJ3J1bicsIFswLCAxXSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNykgKyAzLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMl0sIDEsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszLCAzLCA0XSwgMiwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG5cbiAgICByZXR1cm4gY29wO1xufTtcbiIsIi8vIGZsb29yLmpzXG52YXIgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gdGhpcy5jYWNoZS5nZXRJbWFnZSgncDEnKS53aWR0aCoyO1xuICAgIHZhciBmbG9vcjtcblxuICAgIGZsb29yID0gdGhpcy5hZGQuc3ByaXRlKC1XT1JMRF9PVkVSRkxPVywgdGhpcy53b3JsZC5oZWlnaHQtNjAsICdzcCcpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGZsb29yKTtcbiAgICBmbG9vci5ib2R5LmltbW92YWJsZSA9IHRydWU7XG4gICAgZmxvb3IuYm9keS5hbGxvd0dyYXZpdHkgPSBmYWxzZTtcbiAgICBmbG9vci53aWR0aCA9IHRoaXMud29ybGQud2lkdGggKyBXT1JMRF9PVkVSRkxPVztcblxuICAgIHJldHVybiBmbG9vcjtcbn07XG4iLCIvLyBwbGF5ZXIuanNcbnZhciBERUFEWk9ORV9XSURUSCA9IDQwMCxcbiAgICBNQVhfU1BFRUQgPSAzNTAsXG4gICAgQUNDRUxFUkFUSU9OID0gMTAwMCxcbiAgICBEUkFHID0gMTAwMCxcbiAgICBHUkFWSVRZID0gMjAwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBUaGUgcGxheWVyIGFuZCBpdHMgc2V0dGluZ3NcbiAgICB2YXIgcGxheWVyO1xuICAgIHNwcml0ZU5hbWUgPSAncCcgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkgKyAxKS50b1N0cmluZygpO1xuICAgIHBsYXllciA9IHRoaXMuYWRkLnNwcml0ZSgzMiwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsIHNwcml0ZU5hbWUpO1xuICAgIC8vIHBsYXllci5zY2FsZS5zZXRUbygyKTtcbiAgICBwbGF5ZXIuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIHBsYXllci5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG4gICAgcGxheWVyLmJvZHkuc2V0U2l6ZSgyNSw1MCwtMi41LDYpO1xuXG4gICAgLy8gIFBsYXllciBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIHBsYXllci5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHBsYXllci5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKE1BWF9TUEVFRCwgTUFYX1NQRUVEICogMTApO1xuICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgncnVuJywgWzAsIDFdLCA2LCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMl0sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszLCAzLCA0XSwgMiwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgLy8gbWlzY1xuICAgIHBsYXllci5maXJzdEp1bXAgPSBudWxsO1xuICAgIHBsYXllci5qdW1wcyA9IDA7XG4gICAgcGxheWVyLmhlYWx0aCA9IDEwMDtcbiAgICB0cnkge1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ2dvZCcpID4gLTEpIHBsYXllci5oZWFsdGggPSBJbmZpbml0eTtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdocCcpID4gLTEpIHBsYXllci5oZWFsdGggPSBwYXJzZUludCh3aW5kb3cubG9jYXRpb24uc2VhcmNoLm1hdGNoKC9ocD0oXFxkKykvKVsxXSwgMTApO1xuICAgIH0gY2F0Y2ggKGUpe31cbiAgICBwbGF5ZXIuc2NvcmUgPSAwO1xuICAgIHBsYXllci5kZWFkID0gZmFsc2U7XG5cbiAgICAvLyBjYW1lcmFcbiAgICB0aGlzLmNhbWVyYS5mb2xsb3cocGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04pO1xuICAgIHRoaXMuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUoXG4gICAgICAgIHRoaXMuZ2FtZS53aWR0aC8yIC0gREVBRFpPTkVfV0lEVEgvMixcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodCxcbiAgICAgICAgREVBRFpPTkVfV0lEVEgsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHRcbiAgICApO1xuXG4gICAgcmV0dXJuIHBsYXllcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2xvYWRpbmcnLCAnYXNzZXRzL2ltZy90aXRsZS5wbmcnKTtcbiAgICB9LFxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2xvYWQnKTtcbiAgICB9XG59O1xuIiwiLy8gZ2FtZS5qc1xuXG4vLyBFeHRlcm5hbFxudmFyIGRlYm91bmNlID0gcmVxdWlyZSgnZGVib3VuY2UnKTtcblxuLy8gQ3JlYXRlXG52YXIgY3JlYXRlUGxheWVyID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9wbGF5ZXInKSxcbiAgICBjcmVhdGVDb3AgICA9IHJlcXVpcmUoJy4uL29iamVjdHMvY29wJyksXG4gICAgY3JlYXRlQ29pbiA9IHJlcXVpcmUoJy4uL29iamVjdHMvY29pbicpLFxuICAgIGNyZWF0ZUZsb29yID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9mbG9vcicpO1xuXG4vLyBVcGRhdGVcbnZhciBwbGF5ZXJNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcGxheWVyTW92ZW1lbnQnKSxcbiAgICBjb3BNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29wTW92ZW1lbnQnKSxcbiAgICBjb3BBdHRhY2sgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcEF0dGFjaycpLFxuICAgIHdhbnRlZExldmVsID0gcmVxdWlyZSgnLi4vbW9kdWxlcy93YW50ZWRMZXZlbCcpLFxuICAgIGNvbGxlY3RDb2luID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb2xsZWN0JyksXG4gICAgc2hvd1dhbnRlZCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvd2FudGVkRGlzcGxheScpLFxuICAgIGNhblNwYXduQ29weiA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY2FuU3Bhd25Db3B6Jyk7XG5cbi8vIEdsb2JhbHNcblxudmFyIHBsYXllciwgZmxvb3IsIGN1cnNvcnMsIGNvcHosIHNwcml0ZXMsXG4gICAgTEFTVF9TUEFXTiA9IDAsIE1BWF9DT1BaID0gMjAwLCBMQVNUX0hJVCA9IDAsXG4gICAgTUFYX0NPSU5aID0gMSxcbiAgICBNVVNJQyA9IHRydWUsIFNPVU5EID0gdHJ1ZSxcbiAgICBHQU1FX09WRVIgPSBmYWxzZTtcblxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnbm9tdXNpYycpID4gLTEpIHtcbiAgICAgICAgTVVTSUMgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdub3NvdW5kJykgPiAtMSkge1xuICAgICAgICBNVVNJQyA9IFNPVU5EID0gZmFsc2U7XG4gICAgfVxuXG5mdW5jdGlvbiBwYXJ0aWNsZUJ1cnN0KGVtaXR0ZXIsIHBsYXllcikge1xuXG4gICAgLy8gIFBvc2l0aW9uIHRoZSBlbWl0dGVyIHdoZXJlIHRoZSBtb3VzZS90b3VjaCBldmVudCB3YXNcbiAgICBlbWl0dGVyLnggPSBwbGF5ZXIuYm9keS54ICsgcGxheWVyLmJvZHkud2lkdGgvMjtcbiAgICBlbWl0dGVyLnkgPSBwbGF5ZXIuYm9keS55ICsgcGxheWVyLmJvZHkuaGVpZ2h0LzI7XG5cbiAgICAvLyAgVGhlIGZpcnN0IHBhcmFtZXRlciBzZXRzIHRoZSBlZmZlY3QgdG8gXCJleHBsb2RlXCIgd2hpY2ggbWVhbnMgYWxsIHBhcnRpY2xlcyBhcmUgZW1pdHRlZCBhdCBvbmNlXG4gICAgLy8gIFRoZSBzZWNvbmQgZ2l2ZXMgZWFjaCBwYXJ0aWNsZSBhIDIwMDBtcyBsaWZlc3BhblxuICAgIC8vICBUaGUgdGhpcmQgaXMgaWdub3JlZCB3aGVuIHVzaW5nIGJ1cnN0L2V4cGxvZGUgbW9kZVxuICAgIC8vICBUaGUgZmluYWwgcGFyYW1ldGVyICgxMCkgaXMgaG93IG1hbnkgcGFydGljbGVzIHdpbGwgYmUgZW1pdHRlZCBpbiB0aGlzIHNpbmdsZSBidXJzdFxuICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwMDAwMDAsIG51bGwsIDEwMCk7XG5cbn1cblxuZnVuY3Rpb24gZ2FtZUNyZWF0ZSAoKSB7XG4gICAgR0FNRV9PVkVSID0gZmFsc2VcbiAgICAvLyBlbmFibGUgcGh5c2ljc1xuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4gICAgLy8gd29ybGQgYm91bmRzXG4gICAgdGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCoyLCB0aGlzLmdhbWUuaGVpZ2h0KTtcblxuICAgIC8vIGRvbnQgc21vb3RoIGFydFxuICAgIHRoaXMuc3RhZ2Uuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBiYWNrZ3JvdW5kXG4gICAgLy8gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtOTAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgqMiwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS5oZWlnaHQsICdiZycpO1xuICAgIHRoaXMuYWRkLnRpbGVTcHJpdGUoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCoyLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLmhlaWdodCwgJ2JnJyk7XG5cbiAgICAvLyBhZGQgZmxvb3JcbiAgICBmbG9vciA9IGNyZWF0ZUZsb29yLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGFkZCBzaWduXG4gICAgdGhpcy5hZGQuaW1hZ2UoMTMwLCB0aGlzLmdhbWUuaGVpZ2h0IC0gMTYwLCAnc2lnbicpO1xuICAgIHZhciB4ID0gMTA7XG4gICAgdmFyIGRpdiA9IHRoaXMud29ybGQud2lkdGgveDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB4OyBpKyspIHtcbiAgICAgICAgdGhpcy5hZGQuaW1hZ2UoXG4gICAgICAgICAgICBnZXRSYW5kb21JbnQoXG4gICAgICAgICAgICAgICAgTWF0aC5tYXgoMjUwLCBkaXYqaSksXG4gICAgICAgICAgICAgICAgKGkgPT09IDEpID8gTWF0aC5taW4oZGl2KihpKzEpLCA4MDApOiBkaXYqKGkrMSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0IC0gNjAsXG4gICAgICAgICAgICAoTWF0aC5yYW5kb20oKTwuMzMpID8gJ3JhbXAnIDogJ2JpbidcbiAgICAgICAgKTtcbiAgICB9O1xuXG5cbiAgICAvLyBlbWl0dGVyXG4gICAgZW1pdHRlciA9IHRoaXMuYWRkLmVtaXR0ZXIoMCwgMCwgMjAwMCk7XG4gICAgZW1pdHRlci5tYWtlUGFydGljbGVzKCdibCcpO1xuICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDkwMDtcblxuICAgIC8vIGFkZCBwbGF5ZXJcbiAgICBwbGF5ZXIgPSBjcmVhdGVQbGF5ZXIuYmluZCh0aGlzKSgpO1xuXG4gICAgLy8gY29udHJvbHNcbiAgICBjdXJzb3JzID0gdGhpcy5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cbiAgICAvLyBjb3B6XG4gICAgY29weiA9IHRoaXMuYWRkLmdyb3VwKCk7XG5cbiAgICAvLyBjb2luelxuICAgIGNvaW56ID0gdGhpcy5hZGQuZ3JvdXAoKTtcbiAgICBjb2luei5lbmFibGVCb2R5ID0gdHJ1ZTtcbiAgICBjb2luei5hZGQoY3JlYXRlQ29pbi5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhLCAyNTAsIDI1MCkpO1xuXG4gICAgLy8gd2FudGVkIGxldmVsXG4gICAgdmFyIHNwcml0ZVdpZHRoID0gdGhpcy5jYWNoZS5nZXRJbWFnZSgnd2FudGVkJykud2lkdGggKiAwLjA3NTtcbiAgICB2YXIgdzEgPSB0aGlzLmFkZC5zcHJpdGUoMTYsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHcyID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiAxLCAxNiwgJ3dhbnRlZCcpO1xuICAgIHZhciB3MyA9IHRoaXMuYWRkLnNwcml0ZSgxNiArIHNwcml0ZVdpZHRoICogMiwgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzQgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDMsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHc1ID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiA0LCAxNiwgJ3dhbnRlZCcpO1xuICAgIHZhciB3NiA9IHRoaXMuYWRkLnNwcml0ZSgxNiArIHNwcml0ZVdpZHRoICogNSwgMTYsICd3YW50ZWQnKTtcblxuICAgIHNwcml0ZXMgPSBbdzEsdzIsdzMsdzQsdzUsdzZdO1xuICAgIHNwcml0ZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICB2LmFscGhhID0gMDtcbiAgICAgICAgdi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICAgICAgdi5zY2FsZS5zZXRUbygwLjA3NSk7XG4gICAgfSk7XG5cbiAgICAvLyBocCB0ZXh0XG4gICAgaHBUZXh0ID0gdGhpcy5hZGQucmV0cm9Gb250KCdudW1iZXJzJywgMzYsIDU0LCAnMDEyMzQ1Njc4OScsIDEwLCAwLCAwKTtcbiAgICBocFRleHQudGV4dCA9IHBsYXllci5oZWFsdGgudG9TdHJpbmcoKTtcbiAgICBocERpc3BsYXkgPSB0aGlzLmFkZC5pbWFnZSh0aGlzLmdhbWUud2lkdGggLSAxMjAsIDE2LCBocFRleHQpO1xuICAgIGhwRGlzcGxheS50aW50ID0gMHhmZjAwMDA7XG4gICAgaHBEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgLy8gc2NvcmUgdGV4dFxuICAgIHNjb3JlVGV4dCA9IHRoaXMuYWRkLnJldHJvRm9udCgnbnVtYmVycycsIDM2LCA1NCwgJzAxMjM0NTY3ODknLCAxMCwgMCwgMCk7XG4gICAgc2NvcmVUZXh0LnRleHQgPSBwbGF5ZXIuaGVhbHRoLnRvU3RyaW5nKCk7XG4gICAgc2NvcmVEaXNwbGF5ID0gdGhpcy5hZGQuaW1hZ2UodGhpcy5nYW1lLndpZHRoIC0gMjUwLCAxNiwgc2NvcmVUZXh0KTtcbiAgICBzY29yZURpc3BsYXkudGludCA9IDB4ZmZmZjAwO1xuICAgIHNjb3JlRGlzcGxheS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIC8vc2hhZGVcblxuICAgIHNoYWRlID0gdGhpcy5hZGQuZ3JhcGhpY3MoMCwgMCk7XG4gICAgc2hhZGUuYmVnaW5GaWxsKDB4MDAwMDAwLCAxKTtcbiAgICBzaGFkZS5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuICAgIHNoYWRlLmVuZEZpbGwoKTtcbiAgICBzaGFkZS5hbHBoYSA9IDA7XG4gICAgc2hhZGUuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBnYW1lIG92ZXIgdGV4dFxuICAgIHZhciBnYW1lT3ZlciA9IFtcbiAgICAgICAgJ1lPVSBMT1NFIScsXG4gICAgICAgICdHQU1FIE9WRVIhJyxcbiAgICAgICAgJ0xPU0VSIScsXG4gICAgICAgICdTVUNLWiAyIEIgVSEnLFxuICAgICAgICAnRFJFQU0gT04hJyxcbiAgICAgICAgJ0lOIFlPVVIgRkFDRSEnLFxuICAgICAgICAnR09PRE5JR0hULCBKT0hOQk9ZJyxcbiAgICAgICAgJ05PIEZVVFVSRSEnLFxuICAgICAgICAnUFVOS1MgREVBRCdcbiAgICBdO1xuICAgIGdhbWVvdmVyVGV4dCA9IHRoaXMuYWRkLnJldHJvRm9udCgnZm9udCcsIDY5LjQsIDY3LjUsICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWiE/LiwxMjM0NTY3ODkwJywgNSwgMCwgMCk7XG4gICAgZ2FtZW92ZXJUZXh0LnRleHQgPSBnYW1lT3ZlcltnZXRSYW5kb21JbnQoMCwgZ2FtZU92ZXIubGVuZ3RoLTEpXTtcbiAgICBnYW1lb3ZlckRpc3BsYXkgPSB0aGlzLmFkZC5pbWFnZSh0aGlzLmdhbWUud2lkdGgvMiwgdGhpcy5nYW1lLmhlaWdodC8zLCBnYW1lb3ZlclRleHQpO1xuICAgIGdhbWVvdmVyRGlzcGxheS5hbHBoYSA9IDA7XG4gICAgZ2FtZW92ZXJEaXNwbGF5LnRpbnQgPSAweGZmMDAwMDtcbiAgICBnYW1lb3ZlckRpc3BsYXkuYW5jaG9yLnggPSBNYXRoLnJvdW5kKGdhbWVvdmVyVGV4dC53aWR0aCAqIDAuNSkgLyBnYW1lb3ZlclRleHQud2lkdGg7XG4gICAgZ2FtZW92ZXJEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgdmFyIHJlcGxheSA9IFtcbiAgICAgICAgJ1JlcGxheT8nLFxuICAgICAgICAnR28gYWdhaW4/JyxcbiAgICAgICAgJ1RyeSBhZ2Fpbj8nLFxuICAgICAgICAnT25jZSBtb3JlPycsXG4gICAgICAgICdBbm90aGVyIHNob3Q/J1xuICAgIF07XG4gICAgcmVwbGF5VGV4dCA9IHRoaXMuYWRkLnJldHJvRm9udCgnZm9udCcsIDY5LjQsIDY3LjUsICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWiE/LiwxMjM0NTY3ODkwJywgNSwgMCwgMCk7XG4gICAgcmVwbGF5VGV4dC50ZXh0ID0gcmVwbGF5W2dldFJhbmRvbUludCgwLCByZXBsYXkubGVuZ3RoLTEpXTtcbiAgICByZXBsYXlEaXNwbGF5ID0gdGhpcy5hZGQuaW1hZ2UodGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMiwgcmVwbGF5VGV4dCk7XG4gICAgcmVwbGF5RGlzcGxheS5hbHBoYSA9IDA7XG4gICAgcmVwbGF5RGlzcGxheS50aW50ID0gMHhmZjAwMDA7XG4gICAgcmVwbGF5RGlzcGxheS5hbmNob3IueCA9IE1hdGgucm91bmQocmVwbGF5VGV4dC53aWR0aCAqIDAuNSkgLyByZXBsYXlUZXh0LndpZHRoO1xuICAgIHJlcGxheURpc3BsYXkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBTb3VuZFxuICAgIHZhciBwdW5rTG9vcCA9IHRoaXMuYWRkLmF1ZGlvKCdwdW5rTG9vcCcpO1xuICAgIHZhciBwaWNrdXAgPSB0aGlzLmFkZC5hdWRpbygncGlja3VwJyk7XG4gICAgdmFyIGdydW50MSA9IHRoaXMuYWRkLmF1ZGlvKCdncnVudDEnKTtcbiAgICB2YXIgZ3J1bnQyID0gdGhpcy5hZGQuYXVkaW8oJ2dydW50MicpO1xuICAgIHRoaXMuc291bmRzID0gW3B1bmtMb29wLCBwaWNrdXAsIGdydW50MSwgZ3J1bnQyXTtcbiAgICBpZiAoIU1VU0lDKSB0aGlzLnNvdW5kc1swXS52b2x1bWUgPSAwO1xuICAgIGlmICghU09VTkQpIHRoaXMuc291bmQudm9sdW1lID0gMDtcblxufVxuXG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKHRlc3QpIHtcbiAgICBpZiAoIXRoaXMuc291bmRzWzBdLmlzUGxheWluZyAmJiBNVVNJQyAmJiBTT1VORCkgdGhpcy5zb3VuZHNbMF0ubG9vcEZ1bGwoMSk7XG4gICAgLy8gQ29sbGlzaW9uc1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGZsb29yKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoY29weiwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShlbWl0dGVyLCBmbG9vciwgZnVuY3Rpb24gKGEsYikge1xuICAgICAgICBhLmJvZHkudmVsb2NpdHkueCA9IGEuYm9keS52ZWxvY2l0eS55ID0gMDtcbiAgICAgICAgYi5ib2R5LnZlbG9jaXR5LnggPSBiLmJvZHkudmVsb2NpdHkueSA9IDA7XG4gICAgfSk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHBsYXllciwgY29pbnosIGNvbGxlY3RDb2luLCBudWxsLCB0aGlzKTtcbiAgICBpZiAoIUdBTUVfT1ZFUikge1xuICAgICAgICAvLyBQbGF5ZXJcbiAgICAgICAgcGxheWVyTW92ZW1lbnQuYmluZCh0aGlzKShwbGF5ZXIsIGN1cnNvcnMpO1xuXG4gICAgICAgIC8vIENvcHpcbiAgICAgICAgdmFyIHdsdmwgPSB3YW50ZWRMZXZlbC5iaW5kKHRoaXMpKHBsYXllcik7XG4gICAgICAgIGlmIChjYW5TcGF3bkNvcHouYmluZCh0aGlzKShjb3B6LCB3bHZsKSkge1xuICAgICAgICAgICAgaWYgKCAodGhpcy50aW1lLm5vdyAtIExBU1RfU1BBV04pID4gKDMwMDAvd2x2bCkgKSB7XG4gICAgICAgICAgICAgICAgY29wei5hZGQoY3JlYXRlQ29wLmJpbmQodGhpcykodGhpcy5jYW1lcmEpKTtcbiAgICAgICAgICAgICAgICBMQVNUX1NQQVdOID0gdGhpcy50aW1lLm5vdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIChjb3B6Lmxlbmd0aCA+IDUwKSBjb3B6LmNoaWxkcmVuWzBdLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2FtZSA9IHRoaXM7XG4gICAgICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgICAgICBjb3BNb3ZlbWVudChjb3AsIHBsYXllcik7XG4gICAgICAgICAgICBpZiAoIChnYW1lLnRpbWUubm93IC0gTEFTVF9ISVQpID4gNjY2ICkge1xuICAgICAgICAgICAgICAgIHZhciBoaXQgPSBjb3BBdHRhY2soY29wLCBwbGF5ZXIsIGVtaXR0ZXIpO1xuICAgICAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGVCdXJzdChlbWl0dGVyLCBwbGF5ZXIpO1xuICAgICAgICAgICAgICAgICAgICBnYW1lLnNvdW5kc1tNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMikgKyAyKV0ucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICBMQVNUX0hJVCA9IGdhbWUudGltZS5ub3c7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocGxheWVyLmp1bXBzID4gMCkge1xuICAgICAgICAgICAgLy8gd2FudGVkVGV4dC5maWxsID0gJyNmZmYnO1xuICAgICAgICAgICAgLy8gd2FudGVkVGV4dC50ZXh0ID0gJ1dhbnRlZCBsZXZlbDogJyArIHdsdmw7XG4gICAgICAgICAgICBocFRleHQudGV4dCA9IHBsYXllci5oZWFsdGgudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBzY29yZVRleHQudGV4dCA9ICcnICsgcGxheWVyLnNjb3JlO1xuICAgICAgICBzaG93V2FudGVkLmJpbmQodGhpcykoc3ByaXRlcywgd2x2bCk7XG5cbiAgICAgICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgICAgIGlmIChjb3AuYm9keS54IDwgZ2FtZS5jYW1lcmEudmlldy5sZWZ0IC0gMjAwIHx8IGNvcC5ib2R5LnggPiBnYW1lLmNhbWVyYS52aWV3LnJpZ2h0ICsgMjAwICkgY29wLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvaW56LmZvckVhY2goZnVuY3Rpb24gKGNvaW4pIHtcbiAgICAgICAgICAgIGlmIChjb2luLmJvZHkueCA8IGdhbWUuY2FtZXJhLnZpZXcubGVmdCAtIDIwMCB8fCBjb2luLmJvZHkueCA+IGdhbWUuY2FtZXJhLnZpZXcucmlnaHQgKyAyMDAgKSBjb2luLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNvaW56Lmxlbmd0aCA8IHdsdmwpIHtcbiAgICAgICAgICAgIGNvaW56LmFkZChjcmVhdGVDb2luLmJpbmQodGhpcykodGhpcy5jYW1lcmEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIuaGVhbHRoIDwgMSkge1xuICAgICAgICAgICAgR0FNRV9PVkVSID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxheWVyLnggPiA0NjI1ICYmIHBsYXllci5qdW1wcyA9PT0gMCkgR0FNRV9PVkVSID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBHQU1FIE9WRVJcbiAgICAgICAgaWYgKCFwbGF5ZXIuZGVhZCkge1xuICAgICAgICAgICAgcGxheWVyLmRlYWQgPSB0cnVlO1xuICAgICAgICAgICAgcGxheWVyLmtpbGwoKTtcbiAgICAgICAgICAgIGRlYXRoID0gdGhpcy5hZGQuZW1pdHRlcigwLCAwLCAxKTtcbiAgICAgICAgICAgIGRlYXRoLm1ha2VQYXJ0aWNsZXMocGxheWVyLmtleSk7XG4gICAgICAgICAgICBkZWF0aC5ncmF2aXR5ID0gMTAwO1xuICAgICAgICAgICAgZGVhdGgueCA9IHBsYXllci5ib2R5LnggKyBwbGF5ZXIuYm9keS53aWR0aC8yO1xuICAgICAgICAgICAgZGVhdGgueSA9IHBsYXllci5ib2R5LnkgKyBwbGF5ZXIuYm9keS5oZWlnaHQvMjtcbiAgICAgICAgICAgIGRlYXRoLnN0YXJ0KHRydWUsIDUwMDAwMDAwLCBudWxsLCAxKTtcbiAgICAgICAgICAgIHRoaXMuYWRkLnR3ZWVuKGdhbWVvdmVyRGlzcGxheSkudG8oIHsgYWxwaGE6IDAuNzUgfSwgMjAwMCwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSwgdHJ1ZSwgMCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5hZGQudHdlZW4ocmVwbGF5RGlzcGxheSkudG8oIHsgYWxwaGE6IDAuNzUgfSwgMjAwMCwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSwgdHJ1ZSwgMjUwLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmFkZC50d2VlbihzaGFkZSkudG8oIHsgYWxwaGE6IDEgfSwgMjAwMCwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSwgdHJ1ZSwgMTUwMCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgcmVwbGF5RGlzcGxheS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVwbGF5RGlzcGxheS5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdW5kLnN0b3BBbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIHJlcGxheURpc3BsYXkuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVwbGF5RGlzcGxheS5hbHBoYSA9IDE7XG4gICAgICAgICAgICB9LCByZXBsYXlEaXNwbGF5KTtcbiAgICAgICAgICAgIHJlcGxheURpc3BsYXkuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXBsYXlEaXNwbGF5LmFscGhhID0gMC43NTtcbiAgICAgICAgICAgIH0sIHJlcGxheURpc3BsYXkpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxufVxuXG5mdW5jdGlvbiBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY3JlYXRlOiAgZ2FtZUNyZWF0ZSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdkZWJ1ZycpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmFkdmFuY2VkVGltaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KHBsYXllcik7XG4gICAgICAgICAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KGNvcCk7XG4gICAgICAgICAgICB9LCB0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy50ZXh0KHRoaXMuZ2FtZS50aW1lLmZwcyArJyBmcHMnIHx8ICctLScsIDIsIDE0LCBcIiMwMGZmMDBcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogIGdhbWVVcGRhdGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvYWRpbmcgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgMCwgJ2xvYWRpbmcnKTtcbiAgICAgICAgbG9hZGluZy5hbmNob3IueCA9IE1hdGgucm91bmQobG9hZGluZy53aWR0aCAqIDAuNSkgLyBsb2FkaW5nLndpZHRoO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5zZXRQcmVsb2FkU3ByaXRlKGxvYWRpbmcpO1xuXG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDEnLCAnYXNzZXRzL2ltZy9wdW5rMS5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDInLCAnYXNzZXRzL2ltZy9wdW5rMi5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDMnLCAnYXNzZXRzL2ltZy9wdW5rMy5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncDQnLCAnYXNzZXRzL2ltZy9wdW5rNC5wbmcnLCA2MS44LCA4Nik7XG5cbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AxJywgJ2Fzc2V0cy9pbWcvY29wMS5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMicsICdhc3NldHMvaW1nL2NvcDIucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDMnLCAnYXNzZXRzL2ltZy9jb3AzLnBuZycsIDYxLjgsIDg2KTtcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3A0JywgJ2Fzc2V0cy9pbWcvY29wNC5wbmcnLCA2MS44LCA4Nik7XG5cbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdjb2luJywgJ2Fzc2V0cy9pbWcvYW5hcmNoeWNvaW4ucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnd2FudGVkJywgJ2Fzc2V0cy9pbWcvd2FudGVkLnBuZycpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnYXNzZXRzL2ltZy9iZy1uZXcucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnc3AnLCAnYXNzZXRzL2ltZy9zcGFjZXIuZ2lmJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYmwnLCAnYXNzZXRzL2ltZy9ibG9vZC5naWYnKTtcblxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NpZ24nLCAnYXNzZXRzL2ltZy9zaWduLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3JhbXAnLCAnYXNzZXRzL2ltZy9yYW1wLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JpbicsICdhc3NldHMvaW1nL2Jpbi5wbmcnKTtcblxuICAgICAgICB0aGlzLmxvYWQuYXVkaW8oJ3B1bmtMb29wJywgJ2Fzc2V0cy9zb3VuZC9wdW5rbG9vcC5tcDMnKTtcbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdwaWNrdXAnLCAnYXNzZXRzL3NvdW5kL2FscmlnaHQubXAzJyk7XG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygnZ3J1bnQxJywgJ2Fzc2V0cy9zb3VuZC9ncnVudDEubXAzJyk7XG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygnZ3J1bnQyJywgJ2Fzc2V0cy9zb3VuZC9ncnVudDIubXAzJyk7XG5cbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdudW1iZXJzJywgJ2Fzc2V0cy9pbWcvbnVtYmVycy5wbmcnKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdmb250JywgJ2Fzc2V0cy9pbWcvZm9udC5wbmcnKTtcbiAgICB9LFxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2FtZSA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZ2FtZS5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cbn07XG4iXX0=
