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

module.exports = function (player, cursors) {

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.acceleration.x = -Math.abs(player.RUN_SPEED);
        player.scale.x = -Math.abs(player.scale.x);
        player.animations.play('run');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.acceleration.x = Math.abs(player.RUN_SPEED);
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
        player.body.acceleration.x = player.body.acceleration.x * player.AIR_DECEL;
        player.body.drag.setTo(player.AIR_DRAG, 0);
    } else {
        player.body.drag.setTo(player.FLOOR_DRAG, 0);
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -Math.abs(player.JUMP_V);
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
    GRAVITY = 2000,
    HEALTH = 100,
    RUN_SPEED = 3500,
    JUMP_V = 1000,
    AIR_DECEL = 0.33,
    AIR_DRAG = 0,
    FLOOR_DRAG = 5000;

module.exports = function (spriteNo, hp, gravity, max_speed, jump_v) {

    if (hp != null) HEALTH = hp;
    if (gravity != null) GRAVITY = gravity;
    if (max_speed != null) MAX_SPEED = max_speed;
    if (jump_v != null) JUMP_V = jump_v;

    // The player and its settings
    var player;
    // spriteName = 'p' + (Math.floor(Math.random() * 4) + 1).toString();
    var spriteName = 'p' + spriteNo;
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
    player.health = HEALTH;
    try {
        if (window.location.search.search('god') > -1) player.health = Infinity;
        if (window.location.search.search('hp') > -1) player.health = parseInt(window.location.search.match(/hp=(\d+)/)[1], 10);
    } catch (e){}
    player.score = 0;
    player.dead = false;

    player.RUN_SPEED = RUN_SPEED;
    player.JUMP_V = JUMP_V;
    player.AIR_DECEL = AIR_DECEL;
    player.AIR_DRAG = AIR_DRAG;
    player.FLOOR_DRAG = FLOOR_DRAG;


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
    // spriteNo, hp, gravity, run_speed, jump_v
    // HEALTH = 100,GRAVITY = 2000,MAX_SPEED = 350,JUMP_V = 1000
    var chars = {
        1: [1, 150],
        2: [2, 100, 1600, 350, 1000],
        3: [3, 100, 1600, 200, 800],
        4: [4, 100, 2000, 500, 1000],
    }
    var charNum = false;
    try {
        if (window.location.search.search('char') > -1) charNum = parseInt(window.location.search.match(/char=(\d+)/)[1], 10);
    } catch (e){}
    player = createPlayer.apply(this, chars[(charNum || Math.floor(Math.random() * 4) + 1)]);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb2xsZWN0LmpzIiwic3JjL21vZHVsZXMvY29wQXR0YWNrLmpzIiwic3JjL21vZHVsZXMvY29wTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3dhbnRlZERpc3BsYXkuanMiLCJzcmMvbW9kdWxlcy93YW50ZWRMZXZlbC5qcyIsInNyYy9vYmplY3RzL2NvaW4uanMiLCJzcmMvb2JqZWN0cy9jb3AuanMiLCJzcmMvb2JqZWN0cy9mbG9vci5qcyIsInNyYy9vYmplY3RzL3BsYXllci5qcyIsInNyYy9zdGF0ZXMvYm9vdC5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBub3cgPSByZXF1aXJlKCdkYXRlLW5vdycpO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAqIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAqIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICogbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAqXG4gKiBAc291cmNlIHVuZGVyc2NvcmUuanNcbiAqIEBzZWUgaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIHRvIHdyYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGluIG1zIChgMTAwYClcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hldGhlciB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgKGBmYWxzZWApXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKXtcbiAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuICBpZiAobnVsbCA9PSB3YWl0KSB3YWl0ID0gMTAwO1xuXG4gIGZ1bmN0aW9uIGxhdGVyKCkge1xuICAgIHZhciBsYXN0ID0gbm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgY29udGV4dCA9IHRoaXM7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lc3RhbXAgPSBub3coKTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykge1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gRGF0ZS5ub3cgfHwgbm93XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbn1cbiIsImNvbnNvbGUubG9nKCcjcHVua2phbScpO1xuXG4vLyBHYW1lXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg5NjAsIDU0MCwgUGhhc2VyLkFVVE8sICdnYW1lJyk7XG5cbi8vIFN0YXRlc1xuZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL3N0YXRlcy9ib290JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWQnLCByZXF1aXJlKCcuL3N0YXRlcy9sb2FkJykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCByZXF1aXJlKCcuL3N0YXRlcy9nYW1lJykpO1xuXG4vLyBTdGFydFxuZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuIiwiLy8gY2FuU3Bhd25Db3B6LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcHosIHdhbnRlZExldmVsKSB7XG4gICAgaWYgKHdhbnRlZExldmVsID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgbWF4Q29weiA9ICh3YW50ZWRMZXZlbCA9PT0gMSkgP1xuICAgICAgICAgICAgICAgICAgICA1IDogKHdhbnRlZExldmVsID09PSAyKSA/XG4gICAgICAgICAgICAgICAgICAgIDEwIDogKHdhbnRlZExldmVsID09PSAzKSA/XG4gICAgICAgICAgICAgICAgICAgIDE1IDogKHdhbnRlZExldmVsID09PSA0KSA/XG4gICAgICAgICAgICAgICAgICAgIDI1IDogKHdhbnRlZExldmVsID09PSA1KSA/XG4gICAgICAgICAgICAgICAgICAgIDUwIDogKHdhbnRlZExldmVsID09PSA2KSA/XG4gICAgICAgICAgICAgICAgICAgIDEwMCA6IDA7XG5cbiAgICBpZiAoY29wei5sZW5ndGggPj0gbWF4Q29weikgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbGxlY3QgKHBsYXllciwgY29pbikge1xuICAgIHRoaXMuc291bmRzWzFdLnBsYXkoKTtcbiAgICBwbGF5ZXIuc2NvcmUrKztcbiAgICBjb2luLmRlc3Ryb3koKTtcbn1cbiIsInZhciBEQU1BR0UgPSAxMCwgS05PQ0tCQUNLID0gMTAwMCwgS05PQ0tVUCA9IDI1MDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3BBdHRhY2sgKGNvcCwgcGxheWVyLCBlbWl0dGVyKSB7XG5cbiAgICB2YXIgaGl0ID0gZmFsc2U7XG5cbiAgICBpZiAocGxheWVyLmJvZHkueCA8IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSBsZWZ0XG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKGNvcC5ib2R5LngpIC0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSA8IDEwKVxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcihjb3AuYm9keS55KSA9PT0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS55KSkge1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1LTk9DS1VQO1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC1LTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSAtIE1hdGguZmxvb3IoY29wLmJvZHkueCkgPCAxMClcbiAgICAgICAgICAgICYmIE1hdGguZmxvb3IoY29wLmJvZHkueSkgPT09IE1hdGguZmxvb3IocGxheWVyLmJvZHkueSkpIHtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtS05PQ0tVUDtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSBLTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGl0O1xuXG59O1xuIiwiLy8gY29wTW92ZW1lbnQuanNcbnZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIE1BWF9TUEVFRCA9IDI1MCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwKjI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcCwgcGxheWVyKSB7XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZC8zLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgZWxzZSBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQsIGNvcC5tYXhTcGVlZCAqIDEwKTtcblxuICAgIGlmIChwbGF5ZXIuYm9keS54IDwgY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIGxlZnRcbiAgICAgICAgY29wLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgY29wLnNjYWxlLnggPSAtTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBjb3AuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIGNvcC5zY2FsZS54ID0gTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcbiAgICB9XG5cblxufTtcbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVyLCBjdXJzb3JzKSB7XG5cbiAgICBpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSBsZWZ0XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gLU1hdGguYWJzKHBsYXllci5SVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IC1NYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSByaWdodFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKHBsYXllci5SVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcblxuICAgIH1cblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikge1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggKiBwbGF5ZXIuQUlSX0RFQ0VMO1xuICAgICAgICBwbGF5ZXIuYm9keS5kcmFnLnNldFRvKHBsYXllci5BSVJfRFJBRywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhwbGF5ZXIuRkxPT1JfRFJBRywgMCk7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1NYXRoLmFicyhwbGF5ZXIuSlVNUF9WKTtcbiAgICAgICAgcGxheWVyLmp1bXBzKys7XG4gICAgICAgIGlmIChwbGF5ZXIuZmlyc3RKdW1wID09IG51bGwpIHtcbiAgICAgICAgICAgIHBsYXllci5maXJzdEp1bXAgPSB0aGlzLnRpbWUubm93O1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BsYXlXYW50ZWQgKHNwcml0ZXMsIHdsdmwpIHtcblxuICAgIHNwcml0ZXMuZm9yRWFjaChmdW5jdGlvbiAodixpKSB7XG4gICAgICAgIGlmIChpIDwgd2x2bCkgdi5hbHBoYSA9IDE7XG4gICAgfSk7XG5cbiAgICBpZiAod2x2bCA8IDYpIHtcbiAgICAgICAgc3ByaXRlc1s1XS5hbHBoYSA9IDA7XG4gICAgfVxuXG59XG4iLCIvLyB3YW50ZWRMZXZlbC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIpIHtcblxuICAgIHZhciB3YW50ZWRMZXZlbCA9IDAsXG4gICAgdGltZVNpbmNlRmlyc3RKdW1wID0gKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkgPyAwIDogTWF0aC5mbG9vcigodGhpcy50aW1lLm5vdyAtIHBsYXllci5maXJzdEp1bXApLzEwMDApLFxuICAgIHRvdGFsSnVtcHMgPSBwbGF5ZXIuanVtcHM7XG5cbiAgICBpZiAodG90YWxKdW1wcyA+IDApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAxO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDI7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gMTUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAzO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDMwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDMwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNDtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiA0MCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiA0NSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDU7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTAwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDYwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2FudGVkTGV2ZWw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUNvaW4gKGNhbWVyYSxzZXR4LHNldHkpIHtcblxuICAgIHZhciB4ID0gZ2V0UmFuZG9tSW50KGNhbWVyYS52aWV3LmxlZnQgKyAxNTAsIGNhbWVyYS52aWV3LnJpZ2h0IC0gMTUwKTtcbiAgICB2YXIgeSA9IGdldFJhbmRvbUludCgxNTAsIDMwMCk7XG4gICAgdmFyIGNvaW4gPSB0aGlzLmFkZC5zcHJpdGUoc2V0eCB8fCB4LCBzZXR5IHx8IHksICdjb2luJyk7XG4gICAgY29pbi5zY2FsZS5zZXRUbygwLjEpO1xuXG4gICAgcmV0dXJuIGNvaW47XG59XG5cblxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufVxuIiwiLy8gY29wLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDAsXG4gICAgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNhbWVyYSkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gMzIqMjtcbiAgICB2YXIgY29wO1xuICAgIHZhciBzcGF3bkxvY2F0aW9ucyA9IFtdO1xuXG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICBjYW1lcmEudmlldy5sZWZ0IC0gMzIsXG4gICAgICAgICAgICAtV09STERfT1ZFUkZMT1dcbiAgICAgICAgKVxuICAgICk7XG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5yaWdodCArIDMyLFxuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLndpZHRoK1dPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgc3ByaXRlTmFtZSA9ICdjb3AnICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICsgMSkudG9TdHJpbmcoKTtcbiAgICBjb3AgPSB0aGlzLmFkZC5zcHJpdGUoc3Bhd25Mb2NhdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjIpXSwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsIHNwcml0ZU5hbWUpO1xuICAgIGNvcC5saWZlc3BhbiA9IDYwMDAwO1xuICAgIGNvcC5ldmVudHMub25LaWxsZWQuYWRkKGZ1bmN0aW9uIChzcHJpdGUpe1xuICAgICAgICBzcHJpdGUuZGVzdHJveSgpO1xuICAgIH0pXG4gICAgLy8gY29wLnNjYWxlLnNldFRvKDIpO1xuICAgIGNvcC5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgY29wLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgY29wXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoY29wKTtcbiAgICBjb3AuYm9keS5zZXRTaXplKDI1LDUwLC0yLjUsNik7XG5cbiAgICAvLyAgY29wIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gY29wLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgY29wLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICAvLyBjb3AuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuICAgIC8vIChwYXJzZUZsb2F0KChNYXRoLnJhbmRvbSgpICogMSkudG9GaXhlZCgyKSwgMTApXG4gICAgdmFyIHNwZWVkcyA9IFs1MCwgMTAwLCAxNTAsIDIwMCwgMjUwXTtcbiAgICBjb3AubWF4U3BlZWQgPSBNYXRoLm1pbihNQVhfU1BFRUQgKyBzcGVlZHNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDUpKV0sIDM0NSk7XG4gICAgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oY29wLm1heFNwZWVkLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgY29wLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMCwgMV0sIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDcpICsgMywgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzJdLCAxLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnLCBbMywgMywgNF0sIDIsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcblxuXG4gICAgcmV0dXJuIGNvcDtcbn07XG4iLCIvLyBmbG9vci5qc1xudmFyIFdPUkxEX09WRVJGTE9XO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBXT1JMRF9PVkVSRkxPVyA9IHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ3AxJykud2lkdGgqMjtcbiAgICB2YXIgZmxvb3I7XG5cbiAgICBmbG9vciA9IHRoaXMuYWRkLnNwcml0ZSgtV09STERfT1ZFUkZMT1csIHRoaXMud29ybGQuaGVpZ2h0LTYwLCAnc3AnKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShmbG9vcik7XG4gICAgZmxvb3IuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuICAgIGZsb29yLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgZmxvb3Iud2lkdGggPSB0aGlzLndvcmxkLndpZHRoICsgV09STERfT1ZFUkZMT1c7XG5cbiAgICByZXR1cm4gZmxvb3I7XG59O1xuIiwiLy8gcGxheWVyLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDAsXG4gICAgSEVBTFRIID0gMTAwLFxuICAgIFJVTl9TUEVFRCA9IDM1MDAsXG4gICAgSlVNUF9WID0gMTAwMCxcbiAgICBBSVJfREVDRUwgPSAwLjMzLFxuICAgIEFJUl9EUkFHID0gMCxcbiAgICBGTE9PUl9EUkFHID0gNTAwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3ByaXRlTm8sIGhwLCBncmF2aXR5LCBtYXhfc3BlZWQsIGp1bXBfdikge1xuXG4gICAgaWYgKGhwICE9IG51bGwpIEhFQUxUSCA9IGhwO1xuICAgIGlmIChncmF2aXR5ICE9IG51bGwpIEdSQVZJVFkgPSBncmF2aXR5O1xuICAgIGlmIChtYXhfc3BlZWQgIT0gbnVsbCkgTUFYX1NQRUVEID0gbWF4X3NwZWVkO1xuICAgIGlmIChqdW1wX3YgIT0gbnVsbCkgSlVNUF9WID0ganVtcF92O1xuXG4gICAgLy8gVGhlIHBsYXllciBhbmQgaXRzIHNldHRpbmdzXG4gICAgdmFyIHBsYXllcjtcbiAgICAvLyBzcHJpdGVOYW1lID0gJ3AnICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICsgMSkudG9TdHJpbmcoKTtcbiAgICB2YXIgc3ByaXRlTmFtZSA9ICdwJyArIHNwcml0ZU5vO1xuICAgIHBsYXllciA9IHRoaXMuYWRkLnNwcml0ZSgzMiwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsIHNwcml0ZU5hbWUpO1xuICAgIC8vIHBsYXllci5zY2FsZS5zZXRUbygyKTtcbiAgICBwbGF5ZXIuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIHBsYXllci5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG4gICAgcGxheWVyLmJvZHkuc2V0U2l6ZSgyNSw1MCwtMi41LDYpO1xuXG4gICAgLy8gIFBsYXllciBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIHBsYXllci5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHBsYXllci5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKE1BWF9TUEVFRCwgTUFYX1NQRUVEICogMTApO1xuICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgncnVuJywgWzAsIDFdLCA2LCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMl0sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszLCAzLCA0XSwgMiwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgLy8gbWlzY1xuICAgIHBsYXllci5maXJzdEp1bXAgPSBudWxsO1xuICAgIHBsYXllci5qdW1wcyA9IDA7XG4gICAgcGxheWVyLmhlYWx0aCA9IEhFQUxUSDtcbiAgICB0cnkge1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ2dvZCcpID4gLTEpIHBsYXllci5oZWFsdGggPSBJbmZpbml0eTtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdocCcpID4gLTEpIHBsYXllci5oZWFsdGggPSBwYXJzZUludCh3aW5kb3cubG9jYXRpb24uc2VhcmNoLm1hdGNoKC9ocD0oXFxkKykvKVsxXSwgMTApO1xuICAgIH0gY2F0Y2ggKGUpe31cbiAgICBwbGF5ZXIuc2NvcmUgPSAwO1xuICAgIHBsYXllci5kZWFkID0gZmFsc2U7XG5cbiAgICBwbGF5ZXIuUlVOX1NQRUVEID0gUlVOX1NQRUVEO1xuICAgIHBsYXllci5KVU1QX1YgPSBKVU1QX1Y7XG4gICAgcGxheWVyLkFJUl9ERUNFTCA9IEFJUl9ERUNFTDtcbiAgICBwbGF5ZXIuQUlSX0RSQUcgPSBBSVJfRFJBRztcbiAgICBwbGF5ZXIuRkxPT1JfRFJBRyA9IEZMT09SX0RSQUc7XG5cblxuICAgIC8vIGNhbWVyYVxuICAgIHRoaXMuY2FtZXJhLmZvbGxvdyhwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTik7XG4gICAgdGhpcy5jYW1lcmEuZGVhZHpvbmUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShcbiAgICAgICAgdGhpcy5nYW1lLndpZHRoLzIgLSBERUFEWk9ORV9XSURUSC8yLFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0LFxuICAgICAgICBERUFEWk9ORV9XSURUSCxcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodFxuICAgICk7XG5cbiAgICByZXR1cm4gcGxheWVyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgnbG9hZGluZycsICdhc3NldHMvaW1nL3RpdGxlLnBuZycpO1xuICAgIH0sXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbG9hZCcpO1xuICAgIH1cbn07XG4iLCIvLyBnYW1lLmpzXG5cbi8vIEV4dGVybmFsXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG4vLyBDcmVhdGVcbnZhciBjcmVhdGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL3BsYXllcicpLFxuICAgIGNyZWF0ZUNvcCAgID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb3AnKSxcbiAgICBjcmVhdGVDb2luID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb2luJyksXG4gICAgY3JlYXRlRmxvb3IgPSByZXF1aXJlKCcuLi9vYmplY3RzL2Zsb29yJyk7XG5cbi8vIFVwZGF0ZVxudmFyIHBsYXllck1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudCcpLFxuICAgIGNvcE1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3BNb3ZlbWVudCcpLFxuICAgIGNvcEF0dGFjayA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29wQXR0YWNrJyksXG4gICAgd2FudGVkTGV2ZWwgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3dhbnRlZExldmVsJyksXG4gICAgY29sbGVjdENvaW4gPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvbGxlY3QnKSxcbiAgICBzaG93V2FudGVkID0gcmVxdWlyZSgnLi4vbW9kdWxlcy93YW50ZWREaXNwbGF5JyksXG4gICAgY2FuU3Bhd25Db3B6ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jYW5TcGF3bkNvcHonKTtcblxuLy8gR2xvYmFsc1xuXG52YXIgcGxheWVyLCBmbG9vciwgY3Vyc29ycywgY29weiwgc3ByaXRlcyxcbiAgICBMQVNUX1NQQVdOID0gMCwgTUFYX0NPUFogPSAyMDAsIExBU1RfSElUID0gMCxcbiAgICBNQVhfQ09JTlogPSAxLFxuICAgIE1VU0lDID0gdHJ1ZSwgU09VTkQgPSB0cnVlLFxuICAgIEdBTUVfT1ZFUiA9IGZhbHNlO1xuXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdub211c2ljJykgPiAtMSkge1xuICAgICAgICBNVVNJQyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ25vc291bmQnKSA+IC0xKSB7XG4gICAgICAgIE1VU0lDID0gU09VTkQgPSBmYWxzZTtcbiAgICB9XG5cbmZ1bmN0aW9uIHBhcnRpY2xlQnVyc3QoZW1pdHRlciwgcGxheWVyKSB7XG5cbiAgICAvLyAgUG9zaXRpb24gdGhlIGVtaXR0ZXIgd2hlcmUgdGhlIG1vdXNlL3RvdWNoIGV2ZW50IHdhc1xuICAgIGVtaXR0ZXIueCA9IHBsYXllci5ib2R5LnggKyBwbGF5ZXIuYm9keS53aWR0aC8yO1xuICAgIGVtaXR0ZXIueSA9IHBsYXllci5ib2R5LnkgKyBwbGF5ZXIuYm9keS5oZWlnaHQvMjtcblxuICAgIC8vICBUaGUgZmlyc3QgcGFyYW1ldGVyIHNldHMgdGhlIGVmZmVjdCB0byBcImV4cGxvZGVcIiB3aGljaCBtZWFucyBhbGwgcGFydGljbGVzIGFyZSBlbWl0dGVkIGF0IG9uY2VcbiAgICAvLyAgVGhlIHNlY29uZCBnaXZlcyBlYWNoIHBhcnRpY2xlIGEgMjAwMG1zIGxpZmVzcGFuXG4gICAgLy8gIFRoZSB0aGlyZCBpcyBpZ25vcmVkIHdoZW4gdXNpbmcgYnVyc3QvZXhwbG9kZSBtb2RlXG4gICAgLy8gIFRoZSBmaW5hbCBwYXJhbWV0ZXIgKDEwKSBpcyBob3cgbWFueSBwYXJ0aWNsZXMgd2lsbCBiZSBlbWl0dGVkIGluIHRoaXMgc2luZ2xlIGJ1cnN0XG4gICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAwMDAwMCwgbnVsbCwgMTAwKTtcblxufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcbiAgICBHQU1FX09WRVIgPSBmYWxzZVxuICAgIC8vIGVuYWJsZSBwaHlzaWNzXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICAvLyB3b3JsZCBib3VuZHNcbiAgICB0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICBibHVlc2t5ID0gdGhpcy5hZGQuaW1hZ2UoMCwgMCwgJ2JsdWVza3knKTtcbiAgICBwdW5rc2t5ID0gdGhpcy5hZGQuaW1hZ2UoMCwgMCwgJ3B1bmtza3knKTtcbiAgICBibHVlc2t5LmZpeGVkVG9DYW1lcmEgPSBwdW5rc2t5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIGJsdWVza3kud2lkdGggPSBwdW5rc2t5LndpZHRoID0gdGhpcy5nYW1lLndpZHRoO1xuICAgIHB1bmtza3kuYWxwaGEgPSAwO1xuICAgIHRoaXMuYWRkLnRpbGVTcHJpdGUoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCoyLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLmhlaWdodCwgJ2JnJyk7XG5cbiAgICAvLyBhZGQgZmxvb3JcbiAgICBmbG9vciA9IGNyZWF0ZUZsb29yLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGFkZCBzaWduXG4gICAgdGhpcy5hZGQuaW1hZ2UoMTMwLCB0aGlzLmdhbWUuaGVpZ2h0IC0gMTYwLCAnc2lnbicpO1xuICAgIHZhciB4ID0gMTA7XG4gICAgdmFyIGRpdiA9IHRoaXMud29ybGQud2lkdGgveDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB4OyBpKyspIHtcbiAgICAgICAgdGhpcy5hZGQuaW1hZ2UoXG4gICAgICAgICAgICBnZXRSYW5kb21JbnQoXG4gICAgICAgICAgICAgICAgTWF0aC5tYXgoMjUwLCBkaXYqaSksXG4gICAgICAgICAgICAgICAgKGkgPT09IDEpID8gTWF0aC5taW4oZGl2KihpKzEpLCA4MDApOiBkaXYqKGkrMSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0IC0gNjAsXG4gICAgICAgICAgICAoTWF0aC5yYW5kb20oKTwuMzMpID8gJ3JhbXAnIDogJ2JpbidcbiAgICAgICAgKTtcbiAgICB9O1xuXG5cbiAgICAvLyBlbWl0dGVyXG4gICAgZW1pdHRlciA9IHRoaXMuYWRkLmVtaXR0ZXIoMCwgMCwgMjAwMCk7XG4gICAgZW1pdHRlci5tYWtlUGFydGljbGVzKCdibCcpO1xuICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDkwMDtcblxuICAgIC8vIGFkZCBwbGF5ZXJcbiAgICAvLyBzcHJpdGVObywgaHAsIGdyYXZpdHksIHJ1bl9zcGVlZCwganVtcF92XG4gICAgLy8gSEVBTFRIID0gMTAwLEdSQVZJVFkgPSAyMDAwLE1BWF9TUEVFRCA9IDM1MCxKVU1QX1YgPSAxMDAwXG4gICAgdmFyIGNoYXJzID0ge1xuICAgICAgICAxOiBbMSwgMTUwXSxcbiAgICAgICAgMjogWzIsIDEwMCwgMTYwMCwgMzUwLCAxMDAwXSxcbiAgICAgICAgMzogWzMsIDEwMCwgMTYwMCwgMjAwLCA4MDBdLFxuICAgICAgICA0OiBbNCwgMTAwLCAyMDAwLCA1MDAsIDEwMDBdLFxuICAgIH1cbiAgICB2YXIgY2hhck51bSA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnY2hhcicpID4gLTEpIGNoYXJOdW0gPSBwYXJzZUludCh3aW5kb3cubG9jYXRpb24uc2VhcmNoLm1hdGNoKC9jaGFyPShcXGQrKS8pWzFdLCAxMCk7XG4gICAgfSBjYXRjaCAoZSl7fVxuICAgIHBsYXllciA9IGNyZWF0ZVBsYXllci5hcHBseSh0aGlzLCBjaGFyc1soY2hhck51bSB8fCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpXSk7XG5cbiAgICAvLyBjb250cm9sc1xuICAgIGN1cnNvcnMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcblxuICAgIC8vIGNvcHpcbiAgICBjb3B6ID0gdGhpcy5hZGQuZ3JvdXAoKTtcblxuICAgIC8vIGNvaW56XG4gICAgY29pbnogPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgIGNvaW56LmVuYWJsZUJvZHkgPSB0cnVlO1xuICAgIGNvaW56LmFkZChjcmVhdGVDb2luLmJpbmQodGhpcykodGhpcy5jYW1lcmEsIDI1MCwgMjUwKSk7XG5cbiAgICAvLyB3YW50ZWQgbGV2ZWxcbiAgICB2YXIgc3ByaXRlV2lkdGggPSB0aGlzLmNhY2hlLmdldEltYWdlKCd3YW50ZWQnKS53aWR0aCAqIDAuMDc1O1xuICAgIHZhciB3MSA9IHRoaXMuYWRkLnNwcml0ZSgxNiwgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzIgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDEsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHczID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiAyLCAxNiwgJ3dhbnRlZCcpO1xuICAgIHZhciB3NCA9IHRoaXMuYWRkLnNwcml0ZSgxNiArIHNwcml0ZVdpZHRoICogMywgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzUgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDQsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHc2ID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiA1LCAxNiwgJ3dhbnRlZCcpO1xuXG4gICAgc3ByaXRlcyA9IFt3MSx3Mix3Myx3NCx3NSx3Nl07XG4gICAgc3ByaXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHYuYWxwaGEgPSAwO1xuICAgICAgICB2LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB2LnNjYWxlLnNldFRvKDAuMDc1KTtcbiAgICB9KTtcblxuICAgIC8vIGhwIHRleHRcbiAgICBocFRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ251bWJlcnMnLCAzNiwgNTQsICcwMTIzNDU2Nzg5JywgMTAsIDAsIDApO1xuICAgIGhwVGV4dC50ZXh0ID0gcGxheWVyLmhlYWx0aC50b1N0cmluZygpO1xuICAgIGhwRGlzcGxheSA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS53aWR0aCAtIDEyMCwgMTYsIGhwVGV4dCk7XG4gICAgaHBEaXNwbGF5LnRpbnQgPSAweGZmMDAwMDtcbiAgICBocERpc3BsYXkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBzY29yZSB0ZXh0XG4gICAgc2NvcmVUZXh0ID0gdGhpcy5hZGQucmV0cm9Gb250KCdudW1iZXJzJywgMzYsIDU0LCAnMDEyMzQ1Njc4OScsIDEwLCAwLCAwKTtcbiAgICBzY29yZVRleHQudGV4dCA9IHBsYXllci5oZWFsdGgudG9TdHJpbmcoKTtcbiAgICBzY29yZURpc3BsYXkgPSB0aGlzLmFkZC5pbWFnZSh0aGlzLmdhbWUud2lkdGggLSAyNTAsIDE2LCBzY29yZVRleHQpO1xuICAgIHNjb3JlRGlzcGxheS50aW50ID0gMHhmZmZmMDA7XG4gICAgc2NvcmVEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgLy9zaGFkZVxuICAgIHNoYWRlID0gdGhpcy5hZGQuZ3JhcGhpY3MoMCwgMCk7XG4gICAgc2hhZGUuYmVnaW5GaWxsKDB4MDAwMDAwLCAxKTtcbiAgICBzaGFkZS5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuICAgIHNoYWRlLmVuZEZpbGwoKTtcbiAgICBzaGFkZS5hbHBoYSA9IDA7XG4gICAgc2hhZGUuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAvLyBnYW1lIG92ZXIgdGV4dFxuICAgIHZhciBnYW1lT3ZlciA9IFtcbiAgICAgICAgJ1lPVSBMT1NFIScsXG4gICAgICAgICdHQU1FIE9WRVIhJyxcbiAgICAgICAgJ0xPU0VSIScsXG4gICAgICAgICdTVUNLWiAyIEIgVSEnLFxuICAgICAgICAnRFJFQU0gT04hJyxcbiAgICAgICAgJ0lOIFlPVVIgRkFDRSEnLFxuICAgICAgICAnR09PRE5JR0hUIScsXG4gICAgICAgICdOTyBGVVRVUkUhJyxcbiAgICAgICAgJ1BVTktTIERFQUQnXG4gICAgXTtcbiAgICBnYW1lb3ZlclRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ2ZvbnQnLCA2OS40LCA2Ny41LCAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVohPy4sMTIzNDU2Nzg5MCcsIDUsIDAsIDApO1xuICAgIGdhbWVvdmVyVGV4dC50ZXh0ID0gZ2FtZU92ZXJbZ2V0UmFuZG9tSW50KDAsIGdhbWVPdmVyLmxlbmd0aC0xKV07XG4gICAgZ2FtZW92ZXJEaXNwbGF5ID0gdGhpcy5hZGQuaW1hZ2UodGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMywgZ2FtZW92ZXJUZXh0KTtcbiAgICBnYW1lb3ZlckRpc3BsYXkuYWxwaGEgPSAwO1xuICAgIGdhbWVvdmVyRGlzcGxheS50aW50ID0gMHhmZjAwMDA7XG4gICAgZ2FtZW92ZXJEaXNwbGF5LmFuY2hvci54ID0gTWF0aC5yb3VuZChnYW1lb3ZlclRleHQud2lkdGggKiAwLjUpIC8gZ2FtZW92ZXJUZXh0LndpZHRoO1xuICAgIGdhbWVvdmVyRGlzcGxheS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIHZhciByZXBsYXkgPSBbXG4gICAgICAgICdSZXBsYXk/JyxcbiAgICAgICAgJ0dvIGFnYWluPycsXG4gICAgICAgICdUcnkgYWdhaW4/JyxcbiAgICAgICAgJ09uY2UgbW9yZT8nLFxuICAgICAgICAnQW5vdGhlciBzaG90PydcbiAgICBdO1xuICAgIHJlcGxheVRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ2ZvbnQnLCA2OS40LCA2Ny41LCAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVohPy4sMTIzNDU2Nzg5MCcsIDUsIDAsIDApO1xuICAgIHJlcGxheVRleHQudGV4dCA9IHJlcGxheVtnZXRSYW5kb21JbnQoMCwgcmVwbGF5Lmxlbmd0aC0xKV07XG4gICAgcmVwbGF5RGlzcGxheSA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS53aWR0aC8yLCB0aGlzLmdhbWUuaGVpZ2h0LzIsIHJlcGxheVRleHQpO1xuICAgIHJlcGxheURpc3BsYXkuYWxwaGEgPSAwO1xuICAgIHJlcGxheURpc3BsYXkudGludCA9IDB4ZmYwMDAwO1xuICAgIHJlcGxheURpc3BsYXkuYW5jaG9yLnggPSBNYXRoLnJvdW5kKHJlcGxheVRleHQud2lkdGggKiAwLjUpIC8gcmVwbGF5VGV4dC53aWR0aDtcbiAgICByZXBsYXlEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgLy8gU291bmRcbiAgICB2YXIgcHVua0xvb3AgPSB0aGlzLmFkZC5hdWRpbygncHVua0xvb3AnKTtcbiAgICB2YXIgcGlja3VwID0gdGhpcy5hZGQuYXVkaW8oJ3BpY2t1cCcpO1xuICAgIHZhciBncnVudDEgPSB0aGlzLmFkZC5hdWRpbygnZ3J1bnQxJyk7XG4gICAgdmFyIGdydW50MiA9IHRoaXMuYWRkLmF1ZGlvKCdncnVudDInKTtcbiAgICB0aGlzLnNvdW5kcyA9IFtwdW5rTG9vcCwgcGlja3VwLCBncnVudDEsIGdydW50Ml07XG4gICAgaWYgKCFNVVNJQykgdGhpcy5zb3VuZHNbMF0udm9sdW1lID0gMDtcbiAgICBpZiAoIVNPVU5EKSB0aGlzLnNvdW5kLnZvbHVtZSA9IDA7XG5cbn1cblxuXG5mdW5jdGlvbiBnYW1lVXBkYXRlICh0ZXN0KSB7XG4gICAgaWYgKCF0aGlzLnNvdW5kc1swXS5pc1BsYXlpbmcgJiYgTVVTSUMgJiYgU09VTkQpIHRoaXMuc291bmRzWzBdLmxvb3BGdWxsKDEpO1xuICAgIC8vIENvbGxpc2lvbnNcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBmbG9vcik7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGNvcHosIGZsb29yKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoZW1pdHRlciwgZmxvb3IsIGZ1bmN0aW9uIChhLGIpIHtcbiAgICAgICAgYS5ib2R5LnZlbG9jaXR5LnggPSBhLmJvZHkudmVsb2NpdHkueSA9IDA7XG4gICAgICAgIGIuYm9keS52ZWxvY2l0eS54ID0gYi5ib2R5LnZlbG9jaXR5LnkgPSAwO1xuICAgIH0pO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIGNvaW56LCBjb2xsZWN0Q29pbiwgbnVsbCwgdGhpcyk7XG4gICAgaWYgKCFHQU1FX09WRVIpIHtcbiAgICAgICAgLy8gUGxheWVyXG4gICAgICAgIHBsYXllck1vdmVtZW50LmJpbmQodGhpcykocGxheWVyLCBjdXJzb3JzKTtcblxuICAgICAgICAvLyBDb3B6XG4gICAgICAgIHZhciB3bHZsID0gd2FudGVkTGV2ZWwuYmluZCh0aGlzKShwbGF5ZXIpO1xuICAgICAgICBpZiAoY2FuU3Bhd25Db3B6LmJpbmQodGhpcykoY29weiwgd2x2bCkpIHtcbiAgICAgICAgICAgIGlmICggKHRoaXMudGltZS5ub3cgLSBMQVNUX1NQQVdOKSA+ICgzMDAwL3dsdmwpICkge1xuICAgICAgICAgICAgICAgIGNvcHouYWRkKGNyZWF0ZUNvcC5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgICAgICAgICAgICAgTEFTVF9TUEFXTiA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAoY29wei5sZW5ndGggPiA1MCkgY29wei5jaGlsZHJlblswXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzO1xuICAgICAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICAgICAgY29wTW92ZW1lbnQoY29wLCBwbGF5ZXIpO1xuICAgICAgICAgICAgaWYgKCAoZ2FtZS50aW1lLm5vdyAtIExBU1RfSElUKSA+IDY2NiApIHtcbiAgICAgICAgICAgICAgICB2YXIgaGl0ID0gY29wQXR0YWNrKGNvcCwgcGxheWVyLCBlbWl0dGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlQnVyc3QoZW1pdHRlciwgcGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zb3VuZHNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIpICsgMildLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgTEFTVF9ISVQgPSBnYW1lLnRpbWUubm93O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBsYXllci5qdW1wcyA+IDApIHtcbiAgICAgICAgICAgIC8vIHdhbnRlZFRleHQuZmlsbCA9ICcjZmZmJztcbiAgICAgICAgICAgIC8vIHdhbnRlZFRleHQudGV4dCA9ICdXYW50ZWQgbGV2ZWw6ICcgKyB3bHZsO1xuICAgICAgICAgICAgaHBUZXh0LnRleHQgPSBwbGF5ZXIuaGVhbHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAocHVua3NreS5hbHBoYSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkLnR3ZWVuKHB1bmtza3kpLnRvKCB7IGFscGhhOiAxIH0sIDEwMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluT3V0LCB0cnVlLCAwLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2NvcmVUZXh0LnRleHQgPSAnJyArIHBsYXllci5zY29yZTtcbiAgICAgICAgc2hvd1dhbnRlZC5iaW5kKHRoaXMpKHNwcml0ZXMsIHdsdmwpO1xuXG4gICAgICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgICAgICBpZiAoY29wLmJvZHkueCA8IGdhbWUuY2FtZXJhLnZpZXcubGVmdCAtIDIwMCB8fCBjb3AuYm9keS54ID4gZ2FtZS5jYW1lcmEudmlldy5yaWdodCArIDIwMCApIGNvcC5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb2luei5mb3JFYWNoKGZ1bmN0aW9uIChjb2luKSB7XG4gICAgICAgICAgICBpZiAoY29pbi5ib2R5LnggPCBnYW1lLmNhbWVyYS52aWV3LmxlZnQgLSAyMDAgfHwgY29pbi5ib2R5LnggPiBnYW1lLmNhbWVyYS52aWV3LnJpZ2h0ICsgMjAwICkgY29pbi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjb2luei5sZW5ndGggPCB3bHZsKSB7XG4gICAgICAgICAgICBjb2luei5hZGQoY3JlYXRlQ29pbi5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGxheWVyLmhlYWx0aCA8IDEpIHtcbiAgICAgICAgICAgIEdBTUVfT1ZFUiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXllci54ID4gNDYyNSAmJiBwbGF5ZXIuanVtcHMgPT09IDApIEdBTUVfT1ZFUiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR0FNRSBPVkVSXG4gICAgICAgIGlmICghcGxheWVyLmRlYWQpIHtcbiAgICAgICAgICAgIHBsYXllci5kZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgIHBsYXllci5raWxsKCk7XG4gICAgICAgICAgICBkZWF0aCA9IHRoaXMuYWRkLmVtaXR0ZXIoMCwgMCwgMSk7XG4gICAgICAgICAgICBkZWF0aC5tYWtlUGFydGljbGVzKHBsYXllci5rZXkpO1xuICAgICAgICAgICAgZGVhdGguZ3Jhdml0eSA9IDEwMDtcbiAgICAgICAgICAgIGRlYXRoLnggPSBwbGF5ZXIuYm9keS54ICsgcGxheWVyLmJvZHkud2lkdGgvMjtcbiAgICAgICAgICAgIGRlYXRoLnkgPSBwbGF5ZXIuYm9keS55ICsgcGxheWVyLmJvZHkuaGVpZ2h0LzI7XG4gICAgICAgICAgICBkZWF0aC5zdGFydCh0cnVlLCA1MDAwMDAwMCwgbnVsbCwgMSk7XG4gICAgICAgICAgICB0aGlzLmFkZC50d2VlbihnYW1lb3ZlckRpc3BsYXkpLnRvKCB7IGFscGhhOiAwLjc1IH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDAsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuYWRkLnR3ZWVuKHJlcGxheURpc3BsYXkpLnRvKCB7IGFscGhhOiAwLjc1IH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDI1MCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5hZGQudHdlZW4oc2hhZGUpLnRvKCB7IGFscGhhOiAxIH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDE1MDAsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIHJlcGxheURpc3BsYXkuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcGxheURpc3BsYXkuZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZC5zdG9wQWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICByZXBsYXlEaXNwbGF5LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlcGxheURpc3BsYXkuYWxwaGEgPSAxO1xuICAgICAgICAgICAgfSwgcmVwbGF5RGlzcGxheSk7XG4gICAgICAgICAgICByZXBsYXlEaXNwbGF5LmV2ZW50cy5vbklucHV0T3V0LmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVwbGF5RGlzcGxheS5hbHBoYSA9IDAuNzU7XG4gICAgICAgICAgICB9LCByZXBsYXlEaXNwbGF5KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnZGVidWcnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShwbGF5ZXIpO1xuICAgICAgICAgICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShjb3ApO1xuICAgICAgICAgICAgfSwgdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcudGV4dCh0aGlzLmdhbWUudGltZS5mcHMgKycgZnBzJyB8fCAnLS0nLCAyLCAxNCwgXCIjMDBmZjAwXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsb2FkaW5nID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoLzIsIDAsICdsb2FkaW5nJyk7XG4gICAgICAgIGxvYWRpbmcuYW5jaG9yLnggPSBNYXRoLnJvdW5kKGxvYWRpbmcud2lkdGggKiAwLjUpIC8gbG9hZGluZy53aWR0aDtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc2V0UHJlbG9hZFNwcml0ZShsb2FkaW5nKTtcblxuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AxJywgJ2Fzc2V0cy9pbWcvcHVuazEucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AyJywgJ2Fzc2V0cy9pbWcvcHVuazIucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AzJywgJ2Fzc2V0cy9pbWcvcHVuazMucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3A0JywgJ2Fzc2V0cy9pbWcvcHVuazQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMScsICdhc3NldHMvaW1nL2NvcDEucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDInLCAnYXNzZXRzL2ltZy9jb3AyLnBuZycsIDYxLjgsIDg2KTtcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AzJywgJ2Fzc2V0cy9pbWcvY29wMy5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wNCcsICdhc3NldHMvaW1nL2NvcDQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnY29pbicsICdhc3NldHMvaW1nL2FuYXJjaHljb2luLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3dhbnRlZCcsICdhc3NldHMvaW1nL3dhbnRlZC5wbmcnKTtcblxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvYmctbmV3LnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JsdWVza3knLCAnYXNzZXRzL2ltZy9ibHVlc2t5LnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3B1bmtza3knLCAnYXNzZXRzL2ltZy9wdW5rc2t5LnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NwJywgJ2Fzc2V0cy9pbWcvc3BhY2VyLmdpZicpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JsJywgJ2Fzc2V0cy9pbWcvYmxvb2QuZ2lmJyk7XG5cbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdzaWduJywgJ2Fzc2V0cy9pbWcvc2lnbi5wbmcnKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdyYW1wJywgJ2Fzc2V0cy9pbWcvcmFtcC5wbmcnKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdiaW4nLCAnYXNzZXRzL2ltZy9iaW4ucG5nJyk7XG5cbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdwdW5rTG9vcCcsICdhc3NldHMvc291bmQvcHVua2xvb3AubXAzJyk7XG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygncGlja3VwJywgJ2Fzc2V0cy9zb3VuZC9hbHJpZ2h0Lm1wMycpO1xuICAgICAgICB0aGlzLmxvYWQuYXVkaW8oJ2dydW50MScsICdhc3NldHMvc291bmQvZ3J1bnQxLm1wMycpO1xuICAgICAgICB0aGlzLmxvYWQuYXVkaW8oJ2dydW50MicsICdhc3NldHMvc291bmQvZ3J1bnQyLm1wMycpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbnVtYmVycycsICdhc3NldHMvaW1nL251bWJlcnMucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnZm9udCcsICdhc3NldHMvaW1nL2ZvbnQucG5nJyk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdhbWUuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9XG59O1xuIl19
