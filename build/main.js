(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/danr/Dropbox/htdocs/punkjam/src/main.js":[function(require,module,exports){
console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');

},{"./states/game":"/Users/danr/Dropbox/htdocs/punkjam/src/states/game.js"}],"/Users/danr/Dropbox/htdocs/punkjam/src/modules/canSpawnCopz.js":[function(require,module,exports){
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

    if (maxCopz >= copz.length) return false;

    return false;
};

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/modules/copMovement.js":[function(require,module,exports){
// copMovement.js

module.exports = function (cop) {

};

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/modules/playerMovement.js":[function(require,module,exports){
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

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/modules/wantedLevel.js":[function(require,module,exports){
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

},{}],"/Users/danr/Dropbox/htdocs/punkjam/src/states/game.js":[function(require,module,exports){
// game.js

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
    // Collisions
    this.physics.arcade.collide(player, floor);
    this.physics.arcade.collide(copz, floor);

    // Player
    playerMovement.bind(this)(player, cursors);

    // Copz
    var wlvl = wantedLevel.bind(this)(player);
    if (canSpawnCopz.bind(this)(copz, wlvl)) {
        copz.add(createCop.bind(this)(this.camera));
    }
    copz.forEach(function (cop) {
        copMovement(cop, player);
    });


    // lol
    player.tint = Math.random() * 0xffffff;
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{"../modules/canSpawnCopz":"/Users/danr/Dropbox/htdocs/punkjam/src/modules/canSpawnCopz.js","../modules/copMovement":"/Users/danr/Dropbox/htdocs/punkjam/src/modules/copMovement.js","../modules/playerMovement":"/Users/danr/Dropbox/htdocs/punkjam/src/modules/playerMovement.js","../modules/wantedLevel":"/Users/danr/Dropbox/htdocs/punkjam/src/modules/wantedLevel.js","../objects/cop":"/Users/danr/Dropbox/htdocs/punkjam/src/objects/cop.js","../objects/floor":"/Users/danr/Dropbox/htdocs/punkjam/src/objects/floor.js","../objects/player":"/Users/danr/Dropbox/htdocs/punkjam/src/objects/player.js"}]},{},["/Users/danr/Dropbox/htdocs/punkjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tb2R1bGVzL2NhblNwYXduQ29wei5qcyIsInNyYy9tb2R1bGVzL2NvcE1vdmVtZW50LmpzIiwic3JjL21vZHVsZXMvcGxheWVyTW92ZW1lbnQuanMiLCJzcmMvbW9kdWxlcy93YW50ZWRMZXZlbC5qcyIsInNyYy9vYmplY3RzL2NvcC5qcyIsInNyYy9vYmplY3RzL2Zsb29yLmpzIiwic3JjL29iamVjdHMvcGxheWVyLmpzIiwic3JjL3N0YXRlcy9nYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc29sZS5sb2coJyNwdW5ramFtJyk7XG5cbi8vIEdhbWVcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDk2MCwgNTQwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuLy8gU3RhdGVzXG5nYW1lLnN0YXRlLmFkZCgnZ2FtZScsIHJlcXVpcmUoJy4vc3RhdGVzL2dhbWUnKSk7XG5cbi8vIFN0YXJ0XG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4iLCIvLyBjYW5TcGF3bkNvcHouanNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29weiwgd2FudGVkTGV2ZWwpIHtcbiAgICBpZiAod2FudGVkTGV2ZWwgPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIHZhciBtYXhDb3B6ID0gKHdhbnRlZExldmVsID09PSAxKSA/XG4gICAgICAgICAgICAgICAgICAgIDUgOiAod2FudGVkTGV2ZWwgPT09IDIpID9cbiAgICAgICAgICAgICAgICAgICAgMTAgOiAod2FudGVkTGV2ZWwgPT09IDMpID9cbiAgICAgICAgICAgICAgICAgICAgMTUgOiAod2FudGVkTGV2ZWwgPT09IDQpID9cbiAgICAgICAgICAgICAgICAgICAgMjUgOiAod2FudGVkTGV2ZWwgPT09IDUpID9cbiAgICAgICAgICAgICAgICAgICAgNTAgOiAod2FudGVkTGV2ZWwgPT09IDYpID9cbiAgICAgICAgICAgICAgICAgICAgMTAwIDogMDtcblxuICAgIGlmIChtYXhDb3B6ID49IGNvcHoubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLy8gY29wTW92ZW1lbnQuanNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29wKSB7XG5cbn07XG4iLCJ2YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIsIGN1cnNvcnMpIHtcblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIGxlZnRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSAtTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcblxuICAgIH1cblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikge1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggKiBBSVJfREVDRUw7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oQUlSX0RSQUcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRkxPT1JfRFJBRywgMCk7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1NYXRoLmFicyhKVU1QX1YpO1xuICAgICAgICBwbGF5ZXIuanVtcHMrKztcbiAgICAgICAgaWYgKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkge1xuICAgICAgICAgICAgcGxheWVyLmZpcnN0SnVtcCA9IHRoaXMudGltZS5ub3c7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG4iLCIvLyB3YW50ZWRMZXZlbC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIpIHtcblxuICAgIHZhciB3YW50ZWRMZXZlbCA9IDAsXG4gICAgdGltZVNpbmNlRmlyc3RKdW1wID0gKHBsYXllci5maXJzdEp1bXAgPT0gbnVsbCkgPyAwIDogTWF0aC5mbG9vcigodGhpcy50aW1lLm5vdyAtIHBsYXllci5maXJzdEp1bXApLzEwMDApLFxuICAgIHRvdGFsSnVtcHMgPSBwbGF5ZXIuanVtcHM7XG5cbiAgICBpZiAodG90YWxKdW1wcyA+IDApIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAxO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gNSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDI7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTUgfHwgdGltZVNpbmNlRmlyc3RKdW1wID4gMTUpIHtcbiAgICAgICAgd2FudGVkTGV2ZWwgPSAzO1xuICAgIH1cbiAgICBpZiAodG90YWxKdW1wcyA+IDMwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDMwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNDtcbiAgICB9XG4gICAgaWYgKHRvdGFsSnVtcHMgPiA0MCAmJiB0aW1lU2luY2VGaXJzdEp1bXAgPiA0NSkge1xuICAgICAgICB3YW50ZWRMZXZlbCA9IDU7XG4gICAgfVxuICAgIGlmICh0b3RhbEp1bXBzID4gMTAwICYmIHRpbWVTaW5jZUZpcnN0SnVtcCA+IDYwKSB7XG4gICAgICAgIHdhbnRlZExldmVsID0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2FudGVkTGV2ZWw7XG59O1xuIiwiLy8gY29wLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDAsXG4gICAgV09STERfT1ZFUkZMT1c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNhbWVyYSkge1xuICAgIFdPUkxEX09WRVJGTE9XID0gMzIqMjtcbiAgICB2YXIgY29wO1xuICAgIHZhciBzcGF3bkxvY2F0aW9ucyA9IFtdO1xuXG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5sZWZ0IC0gMzIsXG4gICAgICAgICAgICAtV09STERfT1ZFUkZMT1dcbiAgICAgICAgKVxuICAgICk7XG4gICAgc3Bhd25Mb2NhdGlvbnMucHVzaChcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICBjYW1lcmEudmlldy5yaWdodCArIDMyLFxuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLndpZHRoK1dPUkxEX09WRVJGTE9XXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgY29wID0gdGhpcy5hZGQuc3ByaXRlKHNwYXduTG9jYXRpb25zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyKV0sIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCAnZHVkZScpO1xuICAgIGNvcC5zY2FsZS5zZXRUbygyKTtcbiAgICBjb3AuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIGNvcC5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIGNvcFxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGNvcCk7XG5cbiAgICAvLyAgY29wIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gY29wLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgY29wLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICAvLyBjb3AuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgY29wLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oTUFYX1NQRUVELCBNQVhfU1BFRUQgKiAxMCk7XG4gICAgY29wLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMzcsIDM4XSwgNiwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzM5XSwgMSwgdHJ1ZSk7XG4gICAgY29wLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzNdLCAxLCB0cnVlKTtcbiAgICBjb3AuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cblxuICAgIHJldHVybiBjb3A7XG59O1xuIiwiLy8gZmxvb3IuanNcbnZhciBXT1JMRF9PVkVSRkxPVztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgV09STERfT1ZFUkZMT1cgPSB0aGlzLmNhY2hlLmdldEltYWdlKCdkdWRlJykud2lkdGgqMjtcbiAgICB2YXIgZmxvb3I7XG5cbiAgICBmbG9vciA9IHRoaXMuYWRkLnNwcml0ZSgtV09STERfT1ZFUkZMT1csIHRoaXMud29ybGQuaGVpZ2h0LTkwLCAnc3AnKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShmbG9vcik7XG4gICAgZmxvb3IuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuICAgIGZsb29yLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgZmxvb3Iud2lkdGggPSB0aGlzLndvcmxkLndpZHRoICsgV09STERfT1ZFUkZMT1c7XG5cbiAgICByZXR1cm4gZmxvb3I7XG59O1xuIiwiLy8gcGxheWVyLmpzXG52YXIgREVBRFpPTkVfV0lEVEggPSA0MDAsXG4gICAgTUFYX1NQRUVEID0gMzUwLFxuICAgIEFDQ0VMRVJBVElPTiA9IDEwMDAsXG4gICAgRFJBRyA9IDEwMDAsXG4gICAgR1JBVklUWSA9IDIwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gVGhlIHBsYXllciBhbmQgaXRzIHNldHRpbmdzXG4gICAgdmFyIHBsYXllcjtcbiAgICBwbGF5ZXIgPSB0aGlzLmFkZC5zcHJpdGUoMzIsIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCAnZHVkZScpO1xuICAgIHBsYXllci5zY2FsZS5zZXRUbygyKTtcbiAgICBwbGF5ZXIuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIHBsYXllci5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG5cbiAgICAvLyAgUGxheWVyIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gcGxheWVyLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgcGxheWVyLmJvZHkuZ3Jhdml0eS55ID0gR1JBVklUWTtcbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgcGxheWVyLmJvZHkubWF4VmVsb2NpdHkuc2V0VG8oTUFYX1NQRUVELCBNQVhfU1BFRUQgKiAxMCk7XG4gICAgcGxheWVyLmJvZHkuZHJhZy5zZXRUbyhEUkFHLCAwKTtcblxuICAgIC8vICBPdXIgdHdvIGFuaW1hdGlvbnMsIHdhbGtpbmcgbGVmdCBhbmQgcmlnaHQuXG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbMzcsIDM4XSwgNiwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzM5XSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMuYWRkKCdpZGxlJywgWzNdLCAxLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cbiAgICAvLyBtaXNjXG4gICAgcGxheWVyLmZpcnN0SnVtcCA9IG51bGw7XG4gICAgcGxheWVyLmp1bXBzID0gMDtcblxuICAgIC8vIGNhbWVyYVxuICAgIHRoaXMuY2FtZXJhLmZvbGxvdyhwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTik7XG4gICAgdGhpcy5jYW1lcmEuZGVhZHpvbmUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShcbiAgICAgICAgdGhpcy5nYW1lLndpZHRoLzIgLSBERUFEWk9ORV9XSURUSC8yLFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0LFxuICAgICAgICBERUFEWk9ORV9XSURUSCxcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodFxuICAgICk7XG5cbiAgICByZXR1cm4gcGxheWVyO1xufTtcbiIsIi8vIGdhbWUuanNcblxuLy8gQ3JlYXRlXG52YXIgY3JlYXRlUGxheWVyID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9wbGF5ZXInKSxcbiAgICBjcmVhdGVDb3AgICA9IHJlcXVpcmUoJy4uL29iamVjdHMvY29wJyksXG4gICAgY3JlYXRlRmxvb3IgPSByZXF1aXJlKCcuLi9vYmplY3RzL2Zsb29yJyk7XG5cbi8vIFVwZGF0ZVxudmFyIHBsYXllck1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9wbGF5ZXJNb3ZlbWVudCcpLFxuICAgIGNvcE1vdmVtZW50ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3BNb3ZlbWVudCcpLFxuICAgIHdhbnRlZExldmVsID0gcmVxdWlyZSgnLi4vbW9kdWxlcy93YW50ZWRMZXZlbCcpLFxuICAgIGNhblNwYXduQ29weiA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY2FuU3Bhd25Db3B6Jyk7XG5cbi8vIEdsb2JhbHNcblxudmFyIHBsYXllciwgZmxvb3IsIGN1cnNvcnMsIGNvcHosXG4gICAgTUFYX0NPUFogPSAyMDA7XG5cbmZ1bmN0aW9uIGdhbWVQcmVsb2FkICgpIHtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2R1ZGUnLCAnYXNzZXRzL2ltZy9kdWRlLnBuZycsIDM2LCAzNik7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdiZycsICdhc3NldHMvaW1nL2xvbmdzdHJlZXQuZ2lmJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdzcCcsICdhc3NldHMvaW1nL3NwYWNlci5naWYnKTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2NpdHlfc2hlZXQnLCAnYXNzZXRzL2ltZy9jaXR5X3NoZWV0LmdpZicpO1xufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcblxuICAgIC8vIGVuYWJsZSBwaHlzaWNzXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICAvLyB3b3JsZCBib3VuZHNcbiAgICB0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoKjIsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICB0aGlzLmFkZC50aWxlU3ByaXRlKDAsIDAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykuaGVpZ2h0LCAnYmcnKS5zY2FsZS5zZXRUbygyLDIpO1xuXG4gICAgLy8gYWRkIGZsb29yXG4gICAgZmxvb3IgPSBjcmVhdGVGbG9vci5iaW5kKHRoaXMpKCk7XG5cbiAgICAvLyBhZGQgcGxheWVyXG4gICAgcGxheWVyID0gY3JlYXRlUGxheWVyLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGNvbnRyb2xzXG4gICAgY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG4gICAgLy8gY29welxuICAgIGNvcHogPSB0aGlzLmFkZC5ncm91cCgpO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKHRlc3QpIHtcbiAgICAvLyBDb2xsaXNpb25zXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZmxvb3IpO1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShjb3B6LCBmbG9vcik7XG5cbiAgICAvLyBQbGF5ZXJcbiAgICBwbGF5ZXJNb3ZlbWVudC5iaW5kKHRoaXMpKHBsYXllciwgY3Vyc29ycyk7XG5cbiAgICAvLyBDb3B6XG4gICAgdmFyIHdsdmwgPSB3YW50ZWRMZXZlbC5iaW5kKHRoaXMpKHBsYXllcik7XG4gICAgaWYgKGNhblNwYXduQ29wei5iaW5kKHRoaXMpKGNvcHosIHdsdmwpKSB7XG4gICAgICAgIGNvcHouYWRkKGNyZWF0ZUNvcC5iaW5kKHRoaXMpKHRoaXMuY2FtZXJhKSk7XG4gICAgfVxuICAgIGNvcHouZm9yRWFjaChmdW5jdGlvbiAoY29wKSB7XG4gICAgICAgIGNvcE1vdmVtZW50KGNvcCwgcGxheWVyKTtcbiAgICB9KTtcblxuXG4gICAgLy8gbG9sXG4gICAgcGxheWVyLnRpbnQgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlbG9hZDogZ2FtZVByZWxvYWQsXG4gICAgY3JlYXRlOiAgZ2FtZUNyZWF0ZSxcbiAgICB1cGRhdGU6ICBnYW1lVXBkYXRlXG59O1xuIl19
