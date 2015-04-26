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

// Google Font
WebFontConfig = {
    google: {
      families: ['Frijole']
    }
};

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

    // text
    // wantedText = this.add.text(16, 16, 'Wanted Level: 0', { fontSize: '32px', fill: 'transparent' });
    // wantedText.fixedToCamera = true;

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

    hpText = this.add.retroFont('numbers', 36, 54, '0123456789', 10, 0, 0);
    hpText.text = player.health.toString();
    hpDisplay = this.add.image(this.game.width - 120, 16, hpText);
    // hpDisplay.scale.setTo(0.1);
    hpDisplay.tint = 0xff0000;
    hpDisplay.fixedToCamera = true;

    // scoreText = this.add.text(this.game.width - 200, 16, '0', { fontSize: '32px', fill: '#ff0' });
    // scoreText.fixedToCamera = true;
    scoreText = this.add.retroFont('numbers', 36, 54, '0123456789', 10, 0, 0);
    scoreText.text = player.health.toString();
    scoreDisplay = this.add.image(this.game.width - 250, 16, scoreText);
    // scoreDisplay.scale.setTo(0.1);
    scoreDisplay.tint = 0xffff00;
    scoreDisplay.fixedToCamera = true;

    gameoverText = this.add.text(this.game.width/2, this.game.height/3, 'YOU LOSE', { fontSize: '62px', fill: '#f00' });
    gameoverText.alpha = 0;
    gameoverText.font = 'Frijole';
    gameoverText.anchor.x = Math.round(gameoverText.width * 0.5) / gameoverText.width;
    gameoverText.fixedToCamera = true;

    replayText = this.add.text(this.game.width/2, this.game.height/2, 'Restart?', { fontSize: '32px', fill: '#f00' });
    replayText.alpha = 0;
    replayText.font = 'Frijole';
    replayText.anchor.x = Math.round(replayText.width * 0.5) / replayText.width;
    replayText.fixedToCamera = true;

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
            this.add.tween(gameoverText).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.add.tween(replayText).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 250, 0, false);
            replayText.inputEnabled = true;
            replayText.events.onInputDown.add(function () {
                this.sound.stopAll();
                this.state.start('game');
            }, this);
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

        this.load.image('coin', 'assets/img/anarchy.png');
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
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },
    create: function () {
        var game = this;
        setTimeout(function () {
            game.game.state.start('game');
        }, 1000);
    }
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kdWxlcy9jYW5TcGF3bkNvcHouanMiLCJzcmMvbW9kdWxlcy9jb2xsZWN0LmpzIiwic3JjL21vZHVsZXMvY29wQXR0YWNrLmpzIiwic3JjL21vZHVsZXMvY29wTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudC5qcyIsInNyYy9tb2R1bGVzL3dhbnRlZERpc3BsYXkuanMiLCJzcmMvbW9kdWxlcy93YW50ZWRMZXZlbC5qcyIsInNyYy9vYmplY3RzL2NvaW4uanMiLCJzcmMvb2JqZWN0cy9jb3AuanMiLCJzcmMvb2JqZWN0cy9mbG9vci5qcyIsInNyYy9vYmplY3RzL3BsYXllci5qcyIsInNyYy9zdGF0ZXMvYm9vdC5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgbm93ID0gcmVxdWlyZSgnZGF0ZS1ub3cnKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAqIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gKlxuICogQHNvdXJjZSB1bmRlcnNjb3JlLmpzXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSl7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgaWYgKG51bGwgPT0gd2FpdCkgd2FpdCA9IDEwMDtcblxuICBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IG5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXN0YW1wID0gbm93KCk7XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IG5vd1xuXG5mdW5jdGlvbiBub3coKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG59XG4iLCJjb25zb2xlLmxvZygnI3B1bmtqYW0nKTtcblxuLy8gR2FtZVxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoOTYwLCA1NDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpO1xuXG4vLyBHb29nbGUgRm9udFxuV2ViRm9udENvbmZpZyA9IHtcbiAgICBnb29nbGU6IHtcbiAgICAgIGZhbWlsaWVzOiBbJ0ZyaWpvbGUnXVxuICAgIH1cbn07XG5cbi8vIFN0YXRlc1xuZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL3N0YXRlcy9ib290JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWQnLCByZXF1aXJlKCcuL3N0YXRlcy9sb2FkJykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCByZXF1aXJlKCcuL3N0YXRlcy9nYW1lJykpO1xuXG4vLyBTdGFydFxuZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuIiwiLy8gY2FuU3Bhd25Db3B6LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcHosIHdhbnRlZExldmVsKSB7XG4gICAgaWYgKHdhbnRlZExldmVsID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgbWF4Q29weiA9ICh3YW50ZWRMZXZlbCA9PT0gMSkgP1xuICAgICAgICAgICAgICAgICAgICA1IDogKHdhbnRlZExldmVsID09PSAyKSA/XG4gICAgICAgICAgICAgICAgICAgIDEwIDogKHdhbnRlZExldmVsID09PSAzKSA/XG4gICAgICAgICAgICAgICAgICAgIDE1IDogKHdhbnRlZExldmVsID09PSA0KSA/XG4gICAgICAgICAgICAgICAgICAgIDI1IDogKHdhbnRlZExldmVsID09PSA1KSA/XG4gICAgICAgICAgICAgICAgICAgIDUwIDogKHdhbnRlZExldmVsID09PSA2KSA/XG4gICAgICAgICAgICAgICAgICAgIDEwMCA6IDA7XG5cbiAgICBpZiAoY29wei5sZW5ndGggPj0gbWF4Q29weikgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbGxlY3QgKHBsYXllciwgY29pbikge1xuICAgIHRoaXMuc291bmRzWzFdLnBsYXkoKTtcbiAgICBwbGF5ZXIuc2NvcmUrKztcbiAgICBjb2luLmRlc3Ryb3koKTtcbn1cbiIsInZhciBEQU1BR0UgPSAxMCwgS05PQ0tCQUNLID0gMTAwMCwgS05PQ0tVUCA9IDI1MDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3BBdHRhY2sgKGNvcCwgcGxheWVyLCBlbWl0dGVyKSB7XG5cbiAgICB2YXIgaGl0ID0gZmFsc2U7XG5cbiAgICBpZiAocGxheWVyLmJvZHkueCA8IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSBsZWZ0XG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKGNvcC5ib2R5LngpIC0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSA8IDEwKVxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcihjb3AuYm9keS55KSA9PT0gTWF0aC5mbG9vcihwbGF5ZXIuYm9keS55KSkge1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1LTk9DS1VQO1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC1LTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihwbGF5ZXIuYm9keS54KSAtIE1hdGguZmxvb3IoY29wLmJvZHkueCkgPCAxMClcbiAgICAgICAgICAgICYmIE1hdGguZmxvb3IoY29wLmJvZHkueSkgPT09IE1hdGguZmxvb3IocGxheWVyLmJvZHkueSkpIHtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtS05PQ0tVUDtcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSBLTk9DS0JBQ0s7XG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoID0gcGxheWVyLmhlYWx0aCAtIERBTUFHRTtcbiAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGl0O1xuXG59O1xuIiwiLy8gY29wTW92ZW1lbnQuanNcbnZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIE1BWF9TUEVFRCA9IDI1MCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwKjI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvcCwgcGxheWVyKSB7XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZC8zLCBjb3AubWF4U3BlZWQgKiAxMCk7XG4gICAgZWxzZSBjb3AuYm9keS5tYXhWZWxvY2l0eS5zZXRUbyhjb3AubWF4U3BlZWQsIGNvcC5tYXhTcGVlZCAqIDEwKTtcblxuICAgIGlmIChwbGF5ZXIuYm9keS54IDwgY29wLmJvZHkueCkge1xuICAgICAgICAvLyBwbGF5ZXIgaXMgdG8gdGhlIGxlZnRcbiAgICAgICAgY29wLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgY29wLnNjYWxlLnggPSAtTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVyLmJvZHkueCA+IGNvcC5ib2R5LngpIHtcbiAgICAgICAgLy8gcGxheWVyIGlzIHRvIHRoZSByaWdodFxuICAgICAgICBjb3AuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIGNvcC5zY2FsZS54ID0gTWF0aC5hYnMoY29wLnNjYWxlLngpO1xuICAgICAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcbiAgICB9XG5cblxufTtcbiIsInZhciBSVU5fU1BFRUQgPSAzNTAwLFxuICAgIEpVTVBfViA9IDEwMDAsXG4gICAgQUlSX0RFQ0VMID0gMC4zMyxcbiAgICBBSVJfRFJBRyA9IDAsXG4gICAgRkxPT1JfRFJBRyA9IDUwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllciwgY3Vyc29ycykge1xuXG4gICAgaWYgKGN1cnNvcnMubGVmdC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgbGVmdFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IC1NYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IC1NYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAgIC8vICBNb3ZlIHRvIHRoZSByaWdodFxuICAgICAgICBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCA9IE1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIHBsYXllci5zY2FsZS54ID0gTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgLy8gIFN0YW5kIHN0aWxsXG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAwO1xuXG4gICAgfVxuXG4gICAgaWYgKCFwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSB7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2p1bXAnKTtcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBwbGF5ZXIuYm9keS5hY2NlbGVyYXRpb24ueCAqIEFJUl9ERUNFTDtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhBSVJfRFJBRywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhGTE9PUl9EUkFHLCAwKTtcbiAgICB9XG5cbiAgICAvLyAgQWxsb3cgdGhlIHBsYXllciB0byBqdW1wIGlmIHRoZXkgYXJlIHRvdWNoaW5nIHRoZSBncm91bmQuXG4gICAgaWYgKGN1cnNvcnMudXAuaXNEb3duICYmIHBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLU1hdGguYWJzKEpVTVBfVik7XG4gICAgICAgIHBsYXllci5qdW1wcysrO1xuICAgICAgICBpZiAocGxheWVyLmZpcnN0SnVtcCA9PSBudWxsKSB7XG4gICAgICAgICAgICBwbGF5ZXIuZmlyc3RKdW1wID0gdGhpcy50aW1lLm5vdztcbiAgICAgICAgfVxuICAgIH1cblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwbGF5V2FudGVkIChzcHJpdGVzLCB3bHZsKSB7XG5cbiAgICBzcHJpdGVzLmZvckVhY2goZnVuY3Rpb24gKHYsaSkge1xuICAgICAgICBpZiAoaSA8IHdsdmwpIHYuYWxwaGEgPSAxO1xuICAgIH0pO1xuXG4gICAgaWYgKHdsdmwgPCA2KSB7XG4gICAgICAgIHNwcml0ZXNbNV0uYWxwaGEgPSAwO1xuICAgIH1cblxufVxuIiwiLy8gd2FudGVkTGV2ZWwuanNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVyKSB7XG5cbiAgICB2YXIgd2FudGVkTGV2ZWwgPSAwLFxuICAgIHRpbWVTaW5jZUZpcnN0SnVtcCA9IChwbGF5ZXIuZmlyc3RKdW1wID09IG51bGwpID8gMCA6IE1hdGguZmxvb3IoKHRoaXMudGltZS5ub3cgLSBwbGF5ZXIuZmlyc3RKdW1wKS8xMDAwKSxcbiAgICB0b3RhbEp1bXBzID0gcGxheWVyLmp1bXBzO1xuXG4gICAgaWYgKHRvdGFsSnVtcHMgPiAwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMTtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiA1IHx8IHRpbWVTaW5jZUZpcnN0SnVtcCA+IDUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAyO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDE1IHx8IHRpbWVTaW5jZUZpcnN0SnVtcCA+IDE1KSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gMztcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiAzMCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiAzMCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDQ7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gNDAgJiYgdGltZVNpbmNlRmlyc3RKdW1wID4gNDUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSA1O1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDEwMCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiA2MCkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdhbnRlZExldmVsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVDb2luIChjYW1lcmEsc2V0eCxzZXR5KSB7XG5cbiAgICB2YXIgeCA9IGdldFJhbmRvbUludChjYW1lcmEudmlldy5sZWZ0ICsgMTUwLCBjYW1lcmEudmlldy5yaWdodCAtIDE1MCk7XG4gICAgdmFyIHkgPSBnZXRSYW5kb21JbnQoMTUwLCAzMDApO1xuICAgIHZhciBjb2luID0gdGhpcy5hZGQuc3ByaXRlKHNldHggfHwgeCwgc2V0eSB8fCB5LCAnY29pbicpO1xuICAgIGNvaW4uc2NhbGUuc2V0VG8oMC4xKTtcblxuICAgIHJldHVybiBjb2luO1xufVxuXG5cbmZ1bmN0aW9uIGdldFJhbmRvbUludChtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbn1cbiIsIi8vIGNvcC5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwLFxuICAgIFdPUkxEX09WRVJGTE9XO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjYW1lcmEpIHtcbiAgICBXT1JMRF9PVkVSRkxPVyA9IDMyKjI7XG4gICAgdmFyIGNvcDtcbiAgICB2YXIgc3Bhd25Mb2NhdGlvbnMgPSBbXTtcblxuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWF4KFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcubGVmdCAtIDMyLFxuICAgICAgICAgICAgLVdPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuICAgIHNwYXduTG9jYXRpb25zLnB1c2goXG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgY2FtZXJhLnZpZXcucmlnaHQgKyAzMixcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC53aWR0aCtXT1JMRF9PVkVSRkxPV1xuICAgICAgICApXG4gICAgKTtcblxuICAgIHNwcml0ZU5hbWUgPSAnY29wJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpLnRvU3RyaW5nKCk7XG4gICAgY29wID0gdGhpcy5hZGQuc3ByaXRlKHNwYXduTG9jYXRpb25zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyKV0sIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCBzcHJpdGVOYW1lKTtcbiAgICBjb3AubGlmZXNwYW4gPSA2MDAwMDtcbiAgICBjb3AuZXZlbnRzLm9uS2lsbGVkLmFkZChmdW5jdGlvbiAoc3ByaXRlKXtcbiAgICAgICAgc3ByaXRlLmRlc3Ryb3koKTtcbiAgICB9KVxuICAgIC8vIGNvcC5zY2FsZS5zZXRUbygyKTtcbiAgICBjb3AuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIGNvcC5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIGNvcFxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGNvcCk7XG4gICAgY29wLmJvZHkuc2V0U2l6ZSgyNSw1MCwtMi41LDYpO1xuXG4gICAgLy8gIGNvcCBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIGNvcC5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIGNvcC5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgLy8gY29wLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICAvLyAocGFyc2VGbG9hdCgoTWF0aC5yYW5kb20oKSAqIDEpLnRvRml4ZWQoMiksIDEwKVxuICAgIHZhciBzcGVlZHMgPSBbNTAsIDEwMCwgMTUwLCAyMDAsIDI1MF07XG4gICAgY29wLm1heFNwZWVkID0gTWF0aC5taW4oTUFYX1NQRUVEICsgc3BlZWRzW01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA1KSldLCAzNDUpO1xuICAgIGNvcC5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKGNvcC5tYXhTcGVlZCwgY29wLm1heFNwZWVkICogMTApO1xuICAgIGNvcC5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIGNvcC5hbmltYXRpb25zLmFkZCgncnVuJywgWzAsIDFdLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA3KSArIDMsIHRydWUpO1xuICAgIGNvcC5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cblxuICAgIHJldHVybiBjb3A7XG59O1xuIiwiLy8gZmxvb3IuanNcbnZhciBXT1JMRF9PVkVSRkxPVztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgV09STERfT1ZFUkZMT1cgPSB0aGlzLmNhY2hlLmdldEltYWdlKCdwMScpLndpZHRoKjI7XG4gICAgdmFyIGZsb29yO1xuXG4gICAgZmxvb3IgPSB0aGlzLmFkZC5zcHJpdGUoLVdPUkxEX09WRVJGTE9XLCB0aGlzLndvcmxkLmhlaWdodC02MCwgJ3NwJyk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoZmxvb3IpO1xuICAgIGZsb29yLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbiAgICBmbG9vci5ib2R5LmFsbG93R3Jhdml0eSA9IGZhbHNlO1xuICAgIGZsb29yLndpZHRoID0gdGhpcy53b3JsZC53aWR0aCArIFdPUkxEX09WRVJGTE9XO1xuXG4gICAgcmV0dXJuIGZsb29yO1xufTtcbiIsIi8vIHBsYXllci5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHZhciBwbGF5ZXI7XG4gICAgc3ByaXRlTmFtZSA9ICdwJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDEpLnRvU3RyaW5nKCk7XG4gICAgcGxheWVyID0gdGhpcy5hZGQuc3ByaXRlKDMyLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgc3ByaXRlTmFtZSk7XG4gICAgLy8gcGxheWVyLnNjYWxlLnNldFRvKDIpO1xuICAgIHBsYXllci5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgcGxheWVyLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgcGxheWVyXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUocGxheWVyKTtcbiAgICBwbGF5ZXIuYm9keS5zZXRTaXplKDI1LDUwLC0yLjUsNik7XG5cbiAgICAvLyAgUGxheWVyIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gcGxheWVyLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgcGxheWVyLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgcGxheWVyLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oTUFYX1NQRUVELCBNQVhfU1BFRUQgKiAxMCk7XG4gICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMCwgMV0sIDYsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnanVtcCcsIFsyXSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzMsIDMsIDRdLCAyLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cbiAgICAvLyBtaXNjXG4gICAgcGxheWVyLmZpcnN0SnVtcCA9IG51bGw7XG4gICAgcGxheWVyLmp1bXBzID0gMDtcbiAgICBwbGF5ZXIuaGVhbHRoID0gMTAwO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnZ29kJykgPiAtMSkgcGxheWVyLmhlYWx0aCA9IEluZmluaXR5O1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ2hwJykgPiAtMSkgcGxheWVyLmhlYWx0aCA9IHBhcnNlSW50KHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gubWF0Y2goL2hwPShcXGQrKS8pWzFdLCAxMCk7XG4gICAgfSBjYXRjaCAoZSl7fVxuICAgIHBsYXllci5zY29yZSA9IDA7XG4gICAgcGxheWVyLmRlYWQgPSBmYWxzZTtcblxuICAgIC8vIGNhbWVyYVxuICAgIHRoaXMuY2FtZXJhLmZvbGxvdyhwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTik7XG4gICAgdGhpcy5jYW1lcmEuZGVhZHpvbmUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShcbiAgICAgICAgdGhpcy5nYW1lLndpZHRoLzIgLSBERUFEWk9ORV9XSURUSC8yLFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0LFxuICAgICAgICBERUFEWk9ORV9XSURUSCxcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodFxuICAgICk7XG5cbiAgICByZXR1cm4gcGxheWVyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgnbG9hZGluZycsICdhc3NldHMvaW1nL3RpdGxlLnBuZycpO1xuICAgIH0sXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbG9hZCcpO1xuICAgIH1cbn07XG4iLCIvLyBnYW1lLmpzXG5cbi8vIEV4dGVybmFsXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG4vLyBDcmVhdGVcbnZhciBjcmVhdGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL3BsYXllcicpLFxuICAgIGNyZWF0ZUNvcCAgID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb3AnKSxcbiAgICBjcmVhdGVDb2luID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9jb2luJyksXG4gICAgY3JlYXRlRmxvb3IgPSByZXF1aXJlKCcuLi9vYmplY3RzL2Zsb29yJyk7XG5cbi8vIFVwZGF0ZVxudmFyIHBsYXllck1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudCcpLFxuICAgIGNvcE1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3BNb3ZlbWVudCcpLFxuICAgIGNvcEF0dGFjayA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29wQXR0YWNrJyksXG4gICAgd2FudGVkTGV2ZWwgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3dhbnRlZExldmVsJyksXG4gICAgY29sbGVjdENvaW4gPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvbGxlY3QnKSxcbiAgICBzaG93V2FudGVkID0gcmVxdWlyZSgnLi4vbW9kdWxlcy93YW50ZWREaXNwbGF5JyksXG4gICAgY2FuU3Bhd25Db3B6ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jYW5TcGF3bkNvcHonKTtcblxuLy8gR2xvYmFsc1xuXG52YXIgcGxheWVyLCBmbG9vciwgY3Vyc29ycywgY29weiwgc3ByaXRlcyxcbiAgICBMQVNUX1NQQVdOID0gMCwgTUFYX0NPUFogPSAyMDAsIExBU1RfSElUID0gMCxcbiAgICBNQVhfQ09JTlogPSAxLFxuICAgIE1VU0lDID0gdHJ1ZSwgU09VTkQgPSB0cnVlLFxuICAgIEdBTUVfT1ZFUiA9IGZhbHNlO1xuXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2VhcmNoKCdub211c2ljJykgPiAtMSkge1xuICAgICAgICBNVVNJQyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ25vc291bmQnKSA+IC0xKSB7XG4gICAgICAgIE1VU0lDID0gU09VTkQgPSBmYWxzZTtcbiAgICB9XG5cbmZ1bmN0aW9uIHBhcnRpY2xlQnVyc3QoZW1pdHRlciwgcGxheWVyKSB7XG5cbiAgICAvLyAgUG9zaXRpb24gdGhlIGVtaXR0ZXIgd2hlcmUgdGhlIG1vdXNlL3RvdWNoIGV2ZW50IHdhc1xuICAgIGVtaXR0ZXIueCA9IHBsYXllci5ib2R5LnggKyBwbGF5ZXIuYm9keS53aWR0aC8yO1xuICAgIGVtaXR0ZXIueSA9IHBsYXllci5ib2R5LnkgKyBwbGF5ZXIuYm9keS5oZWlnaHQvMjtcblxuICAgIC8vICBUaGUgZmlyc3QgcGFyYW1ldGVyIHNldHMgdGhlIGVmZmVjdCB0byBcImV4cGxvZGVcIiB3aGljaCBtZWFucyBhbGwgcGFydGljbGVzIGFyZSBlbWl0dGVkIGF0IG9uY2VcbiAgICAvLyAgVGhlIHNlY29uZCBnaXZlcyBlYWNoIHBhcnRpY2xlIGEgMjAwMG1zIGxpZmVzcGFuXG4gICAgLy8gIFRoZSB0aGlyZCBpcyBpZ25vcmVkIHdoZW4gdXNpbmcgYnVyc3QvZXhwbG9kZSBtb2RlXG4gICAgLy8gIFRoZSBmaW5hbCBwYXJhbWV0ZXIgKDEwKSBpcyBob3cgbWFueSBwYXJ0aWNsZXMgd2lsbCBiZSBlbWl0dGVkIGluIHRoaXMgc2luZ2xlIGJ1cnN0XG4gICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAwMDAwMCwgbnVsbCwgMTAwKTtcblxufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcbiAgICBHQU1FX09WRVIgPSBmYWxzZVxuICAgIC8vIGVuYWJsZSBwaHlzaWNzXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICAvLyB3b3JsZCBib3VuZHNcbiAgICB0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICAvLyB0aGlzLmFkZC50aWxlU3ByaXRlKDAsIC05MCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCoyLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLmhlaWdodCwgJ2JnJyk7XG4gICAgdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKTtcblxuICAgIC8vIGFkZCBmbG9vclxuICAgIGZsb29yID0gY3JlYXRlRmxvb3IuYmluZCh0aGlzKSgpO1xuXG4gICAgLy8gYWRkIHNpZ25cbiAgICB0aGlzLmFkZC5pbWFnZSgxMzAsIHRoaXMuZ2FtZS5oZWlnaHQgLSAxNjAsICdzaWduJyk7XG4gICAgdmFyIHggPSAxMDtcbiAgICB2YXIgZGl2ID0gdGhpcy53b3JsZC53aWR0aC94O1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHg7IGkrKykge1xuICAgICAgICB0aGlzLmFkZC5pbWFnZShcbiAgICAgICAgICAgIGdldFJhbmRvbUludChcbiAgICAgICAgICAgICAgICBNYXRoLm1heCgyNTAsIGRpdippKSxcbiAgICAgICAgICAgICAgICAoaSA9PT0gMSkgPyBNYXRoLm1pbihkaXYqKGkrMSksIDgwMCk6IGRpdiooaSsxKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5oZWlnaHQgLSA2MCxcbiAgICAgICAgICAgIChNYXRoLnJhbmRvbSgpPC4zMykgPyAncmFtcCcgOiAnYmluJ1xuICAgICAgICApO1xuICAgIH07XG5cblxuICAgIC8vIGVtaXR0ZXJcbiAgICBlbWl0dGVyID0gdGhpcy5hZGQuZW1pdHRlcigwLCAwLCAyMDAwKTtcbiAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ2JsJyk7XG4gICAgZW1pdHRlci5ncmF2aXR5ID0gOTAwO1xuXG4gICAgLy8gYWRkIHBsYXllclxuICAgIHBsYXllciA9IGNyZWF0ZVBsYXllci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBjb250cm9sc1xuICAgIGN1cnNvcnMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcblxuICAgIC8vIGNvcHpcbiAgICBjb3B6ID0gdGhpcy5hZGQuZ3JvdXAoKTtcblxuICAgIC8vIGNvaW56XG4gICAgY29pbnogPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgIGNvaW56LmVuYWJsZUJvZHkgPSB0cnVlO1xuICAgIGNvaW56LmFkZChjcmVhdGVDb2luLmJpbmQodGhpcykodGhpcy5jYW1lcmEsIDI1MCwgMjUwKSk7XG5cbiAgICAvLyB0ZXh0XG4gICAgLy8gd2FudGVkVGV4dCA9IHRoaXMuYWRkLnRleHQoMTYsIDE2LCAnV2FudGVkIExldmVsOiAwJywgeyBmb250U2l6ZTogJzMycHgnLCBmaWxsOiAndHJhbnNwYXJlbnQnIH0pO1xuICAgIC8vIHdhbnRlZFRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICB2YXIgc3ByaXRlV2lkdGggPSB0aGlzLmNhY2hlLmdldEltYWdlKCd3YW50ZWQnKS53aWR0aCAqIDAuMDc1O1xuXG4gICAgdmFyIHcxID0gdGhpcy5hZGQuc3ByaXRlKDE2LCAxNiwgJ3dhbnRlZCcpO1xuICAgIHZhciB3MiA9IHRoaXMuYWRkLnNwcml0ZSgxNiArIHNwcml0ZVdpZHRoICogMSwgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzMgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDIsIDE2LCAnd2FudGVkJyk7XG4gICAgdmFyIHc0ID0gdGhpcy5hZGQuc3ByaXRlKDE2ICsgc3ByaXRlV2lkdGggKiAzLCAxNiwgJ3dhbnRlZCcpO1xuICAgIHZhciB3NSA9IHRoaXMuYWRkLnNwcml0ZSgxNiArIHNwcml0ZVdpZHRoICogNCwgMTYsICd3YW50ZWQnKTtcbiAgICB2YXIgdzYgPSB0aGlzLmFkZC5zcHJpdGUoMTYgKyBzcHJpdGVXaWR0aCAqIDUsIDE2LCAnd2FudGVkJyk7XG5cbiAgICBzcHJpdGVzID0gW3cxLHcyLHczLHc0LHc1LHc2XTtcbiAgICBzcHJpdGVzLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdi5hbHBoYSA9IDA7XG4gICAgICAgIHYuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgICAgIHYuc2NhbGUuc2V0VG8oMC4wNzUpO1xuICAgIH0pO1xuXG4gICAgaHBUZXh0ID0gdGhpcy5hZGQucmV0cm9Gb250KCdudW1iZXJzJywgMzYsIDU0LCAnMDEyMzQ1Njc4OScsIDEwLCAwLCAwKTtcbiAgICBocFRleHQudGV4dCA9IHBsYXllci5oZWFsdGgudG9TdHJpbmcoKTtcbiAgICBocERpc3BsYXkgPSB0aGlzLmFkZC5pbWFnZSh0aGlzLmdhbWUud2lkdGggLSAxMjAsIDE2LCBocFRleHQpO1xuICAgIC8vIGhwRGlzcGxheS5zY2FsZS5zZXRUbygwLjEpO1xuICAgIGhwRGlzcGxheS50aW50ID0gMHhmZjAwMDA7XG4gICAgaHBEaXNwbGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgLy8gc2NvcmVUZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGggLSAyMDAsIDE2LCAnMCcsIHsgZm9udFNpemU6ICczMnB4JywgZmlsbDogJyNmZjAnIH0pO1xuICAgIC8vIHNjb3JlVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICBzY29yZVRleHQgPSB0aGlzLmFkZC5yZXRyb0ZvbnQoJ251bWJlcnMnLCAzNiwgNTQsICcwMTIzNDU2Nzg5JywgMTAsIDAsIDApO1xuICAgIHNjb3JlVGV4dC50ZXh0ID0gcGxheWVyLmhlYWx0aC50b1N0cmluZygpO1xuICAgIHNjb3JlRGlzcGxheSA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS53aWR0aCAtIDI1MCwgMTYsIHNjb3JlVGV4dCk7XG4gICAgLy8gc2NvcmVEaXNwbGF5LnNjYWxlLnNldFRvKDAuMSk7XG4gICAgc2NvcmVEaXNwbGF5LnRpbnQgPSAweGZmZmYwMDtcbiAgICBzY29yZURpc3BsYXkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICBnYW1lb3ZlclRleHQgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCB0aGlzLmdhbWUuaGVpZ2h0LzMsICdZT1UgTE9TRScsIHsgZm9udFNpemU6ICc2MnB4JywgZmlsbDogJyNmMDAnIH0pO1xuICAgIGdhbWVvdmVyVGV4dC5hbHBoYSA9IDA7XG4gICAgZ2FtZW92ZXJUZXh0LmZvbnQgPSAnRnJpam9sZSc7XG4gICAgZ2FtZW92ZXJUZXh0LmFuY2hvci54ID0gTWF0aC5yb3VuZChnYW1lb3ZlclRleHQud2lkdGggKiAwLjUpIC8gZ2FtZW92ZXJUZXh0LndpZHRoO1xuICAgIGdhbWVvdmVyVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIHJlcGxheVRleHQgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCB0aGlzLmdhbWUuaGVpZ2h0LzIsICdSZXN0YXJ0PycsIHsgZm9udFNpemU6ICczMnB4JywgZmlsbDogJyNmMDAnIH0pO1xuICAgIHJlcGxheVRleHQuYWxwaGEgPSAwO1xuICAgIHJlcGxheVRleHQuZm9udCA9ICdGcmlqb2xlJztcbiAgICByZXBsYXlUZXh0LmFuY2hvci54ID0gTWF0aC5yb3VuZChyZXBsYXlUZXh0LndpZHRoICogMC41KSAvIHJlcGxheVRleHQud2lkdGg7XG4gICAgcmVwbGF5VGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgIC8vIFNvdW5kXG4gICAgdmFyIHB1bmtMb29wID0gdGhpcy5hZGQuYXVkaW8oJ3B1bmtMb29wJyk7XG4gICAgdmFyIHBpY2t1cCA9IHRoaXMuYWRkLmF1ZGlvKCdwaWNrdXAnKTtcbiAgICB2YXIgZ3J1bnQxID0gdGhpcy5hZGQuYXVkaW8oJ2dydW50MScpO1xuICAgIHZhciBncnVudDIgPSB0aGlzLmFkZC5hdWRpbygnZ3J1bnQyJyk7XG4gICAgdGhpcy5zb3VuZHMgPSBbcHVua0xvb3AsIHBpY2t1cCwgZ3J1bnQxLCBncnVudDJdO1xuICAgIGlmICghTVVTSUMpIHRoaXMuc291bmRzWzBdLnZvbHVtZSA9IDA7XG4gICAgaWYgKCFTT1VORCkgdGhpcy5zb3VuZC52b2x1bWUgPSAwO1xuXG59XG5cblxuZnVuY3Rpb24gZ2FtZVVwZGF0ZSAodGVzdCkge1xuICAgIGlmICghdGhpcy5zb3VuZHNbMF0uaXNQbGF5aW5nICYmIE1VU0lDICYmIFNPVU5EKSB0aGlzLnNvdW5kc1swXS5sb29wRnVsbCgxKTtcbiAgICAvLyBDb2xsaXNpb25zXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShjb3B6LCBmbG9vcik7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGVtaXR0ZXIsIGZsb29yLCBmdW5jdGlvbiAoYSxiKSB7XG4gICAgICAgIGEuYm9keS52ZWxvY2l0eS54ID0gYS5ib2R5LnZlbG9jaXR5LnkgPSAwO1xuICAgICAgICBiLmJvZHkudmVsb2NpdHkueCA9IGIuYm9keS52ZWxvY2l0eS55ID0gMDtcbiAgICB9KTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAocGxheWVyLCBjb2lueiwgY29sbGVjdENvaW4sIG51bGwsIHRoaXMpO1xuICAgIGlmICghR0FNRV9PVkVSKSB7XG4gICAgLy8gUGxheWVyXG4gICAgcGxheWVyTW92ZW1lbnQuYmluZCh0aGlzKShwbGF5ZXIsIGN1cnNvcnMpO1xuXG4gICAgLy8gQ29welxuICAgIHZhciB3bHZsID0gd2FudGVkTGV2ZWwuYmluZCh0aGlzKShwbGF5ZXIpO1xuICAgIGlmIChjYW5TcGF3bkNvcHouYmluZCh0aGlzKShjb3B6LCB3bHZsKSkge1xuICAgICAgICBpZiAoICh0aGlzLnRpbWUubm93IC0gTEFTVF9TUEFXTikgPiAoMzAwMC93bHZsKSApIHtcbiAgICAgICAgICAgIGNvcHouYWRkKGNyZWF0ZUNvcC5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgICAgICAgICBMQVNUX1NQQVdOID0gdGhpcy50aW1lLm5vdztcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoY29wei5sZW5ndGggPiA1MCkgY29wei5jaGlsZHJlblswXS5kZXN0cm95KCk7XG4gICAgfVxuICAgIHZhciBnYW1lID0gdGhpcztcbiAgICBjb3B6LmZvckVhY2goZnVuY3Rpb24gKGNvcCkge1xuICAgICAgICBjb3BNb3ZlbWVudChjb3AsIHBsYXllcik7XG4gICAgICAgIGlmICggKGdhbWUudGltZS5ub3cgLSBMQVNUX0hJVCkgPiA2NjYgKSB7XG4gICAgICAgICAgICB2YXIgaGl0ID0gY29wQXR0YWNrKGNvcCwgcGxheWVyLCBlbWl0dGVyKTtcbiAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZUJ1cnN0KGVtaXR0ZXIsIHBsYXllcik7XG4gICAgICAgICAgICAgICAgZ2FtZS5zb3VuZHNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIpICsgMildLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBMQVNUX0hJVCA9IGdhbWUudGltZS5ub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuanVtcHMgPiAwKSB7XG4gICAgICAgIC8vIHdhbnRlZFRleHQuZmlsbCA9ICcjZmZmJztcbiAgICAgICAgLy8gd2FudGVkVGV4dC50ZXh0ID0gJ1dhbnRlZCBsZXZlbDogJyArIHdsdmw7XG4gICAgICAgIGhwVGV4dC50ZXh0ID0gcGxheWVyLmhlYWx0aC50b1N0cmluZygpO1xuICAgIH1cbiAgICBzY29yZVRleHQudGV4dCA9ICcnICsgcGxheWVyLnNjb3JlO1xuICAgIHNob3dXYW50ZWQuYmluZCh0aGlzKShzcHJpdGVzLCB3bHZsKTtcblxuICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgIGlmIChjb3AuYm9keS54IDwgZ2FtZS5jYW1lcmEudmlldy5sZWZ0IC0gMjAwIHx8IGNvcC5ib2R5LnggPiBnYW1lLmNhbWVyYS52aWV3LnJpZ2h0ICsgMjAwICkgY29wLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICBjb2luei5mb3JFYWNoKGZ1bmN0aW9uIChjb2luKSB7XG4gICAgICAgIGlmIChjb2luLmJvZHkueCA8IGdhbWUuY2FtZXJhLnZpZXcubGVmdCAtIDIwMCB8fCBjb2luLmJvZHkueCA+IGdhbWUuY2FtZXJhLnZpZXcucmlnaHQgKyAyMDAgKSBjb2luLmRlc3Ryb3koKTtcbiAgICB9KTtcblxuICAgIGlmIChjb2luei5sZW5ndGggPCB3bHZsKSB7XG4gICAgICAgIGNvaW56LmFkZChjcmVhdGVDb2luLmJpbmQodGhpcykodGhpcy5jYW1lcmEpKTtcbiAgICB9XG5cbiAgICBpZiAocGxheWVyLmhlYWx0aCA8IDEpIHtcbiAgICAgICAgR0FNRV9PVkVSID0gdHJ1ZTtcbiAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR0FNRSBPVkVSXG4gICAgICAgIGlmICghcGxheWVyLmRlYWQpIHtcbiAgICAgICAgICAgIHBsYXllci5kZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgIHBsYXllci5raWxsKCk7XG4gICAgICAgICAgICBkZWF0aCA9IHRoaXMuYWRkLmVtaXR0ZXIoMCwgMCwgMSk7XG4gICAgICAgICAgICBkZWF0aC5tYWtlUGFydGljbGVzKHBsYXllci5rZXkpO1xuICAgICAgICAgICAgZGVhdGguZ3Jhdml0eSA9IDEwMDtcbiAgICAgICAgICAgIGRlYXRoLnggPSBwbGF5ZXIuYm9keS54ICsgcGxheWVyLmJvZHkud2lkdGgvMjtcbiAgICAgICAgICAgIGRlYXRoLnkgPSBwbGF5ZXIuYm9keS55ICsgcGxheWVyLmJvZHkuaGVpZ2h0LzI7XG4gICAgICAgICAgICBkZWF0aC5zdGFydCh0cnVlLCA1MDAwMDAwMCwgbnVsbCwgMSk7XG4gICAgICAgICAgICB0aGlzLmFkZC50d2VlbihnYW1lb3ZlclRleHQpLnRvKCB7IGFscGhhOiAxIH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDAsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuYWRkLnR3ZWVuKHJlcGxheVRleHQpLnRvKCB7IGFscGhhOiAxIH0sIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUsIDI1MCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgcmVwbGF5VGV4dC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVwbGF5VGV4dC5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdW5kLnN0b3BBbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNlYXJjaCgnZGVidWcnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShwbGF5ZXIpO1xuICAgICAgICAgICAgY29wei5mb3JFYWNoKGZ1bmN0aW9uIChjb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keShjb3ApO1xuICAgICAgICAgICAgfSwgdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcudGV4dCh0aGlzLmdhbWUudGltZS5mcHMgKycgZnBzJyB8fCAnLS0nLCAyLCAxNCwgXCIjMDBmZjAwXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsb2FkaW5nID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoLzIsIDAsICdsb2FkaW5nJyk7XG4gICAgICAgIGxvYWRpbmcuYW5jaG9yLnggPSBNYXRoLnJvdW5kKGxvYWRpbmcud2lkdGggKiAwLjUpIC8gbG9hZGluZy53aWR0aDtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc2V0UHJlbG9hZFNwcml0ZShsb2FkaW5nKTtcblxuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AxJywgJ2Fzc2V0cy9pbWcvcHVuazEucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AyJywgJ2Fzc2V0cy9pbWcvcHVuazIucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3AzJywgJ2Fzc2V0cy9pbWcvcHVuazMucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3A0JywgJ2Fzc2V0cy9pbWcvcHVuazQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wMScsICdhc3NldHMvaW1nL2NvcDEucG5nJywgNjEuOCwgODYpO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NvcDInLCAnYXNzZXRzL2ltZy9jb3AyLnBuZycsIDYxLjgsIDg2KTtcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjb3AzJywgJ2Fzc2V0cy9pbWcvY29wMy5wbmcnLCA2MS44LCA4Nik7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29wNCcsICdhc3NldHMvaW1nL2NvcDQucG5nJywgNjEuOCwgODYpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnY29pbicsICdhc3NldHMvaW1nL2FuYXJjaHkucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnd2FudGVkJywgJ2Fzc2V0cy9pbWcvd2FudGVkLnBuZycpO1xuXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnYXNzZXRzL2ltZy9iZy1uZXcucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnc3AnLCAnYXNzZXRzL2ltZy9zcGFjZXIuZ2lmJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYmwnLCAnYXNzZXRzL2ltZy9ibG9vZC5naWYnKTtcblxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NpZ24nLCAnYXNzZXRzL2ltZy9zaWduLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3JhbXAnLCAnYXNzZXRzL2ltZy9yYW1wLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JpbicsICdhc3NldHMvaW1nL2Jpbi5wbmcnKTtcblxuICAgICAgICB0aGlzLmxvYWQuYXVkaW8oJ3B1bmtMb29wJywgJ2Fzc2V0cy9zb3VuZC9wdW5rbG9vcC5tcDMnKTtcbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdwaWNrdXAnLCAnYXNzZXRzL3NvdW5kL2FscmlnaHQubXAzJyk7XG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygnZ3J1bnQxJywgJ2Fzc2V0cy9zb3VuZC9ncnVudDEubXAzJyk7XG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygnZ3J1bnQyJywgJ2Fzc2V0cy9zb3VuZC9ncnVudDIubXAzJyk7XG5cblxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ251bWJlcnMnLCAnYXNzZXRzL2ltZy9udW1iZXJzLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWQuc2NyaXB0KCd3ZWJmb250JywgJy8vYWpheC5nb29nbGVhcGlzLmNvbS9hamF4L2xpYnMvd2ViZm9udC8xLjQuNy93ZWJmb250LmpzJyk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdhbWUuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9XG59O1xuIl19
