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
