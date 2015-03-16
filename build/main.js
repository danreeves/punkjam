(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/dan/Dropbox/htdocs/punkjam/src/main.js":[function(require,module,exports){
console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');

},{"./states/game":"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js"}],"/Users/dan/Dropbox/htdocs/punkjam/src/modules/playerMovement.js":[function(require,module,exports){
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
    }

};

},{}],"/Users/dan/Dropbox/htdocs/punkjam/src/objects/floor.js":[function(require,module,exports){
// floor.js

module.exports = function () {
    var floor;

    floor = this.add.sprite(0, this.world.height-90, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width;

    return floor;
};

},{}],"/Users/dan/Dropbox/htdocs/punkjam/src/objects/player.js":[function(require,module,exports){
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

},{}],"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js":[function(require,module,exports){
// game.js

// Create
var createPlayer = require('../objects/player'),
    createFloor = require('../objects/floor');

// Update
var playerMovement = require('../modules/playerMovement');

// Globals

var player, floor, cursors;

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

}

function gameUpdate () {
    this.physics.arcade.collide(player, floor);

    playerMovement(player, cursors);

    // lol
    player.tint = Math.random() * 0xffffff;
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{"../modules/playerMovement":"/Users/dan/Dropbox/htdocs/punkjam/src/modules/playerMovement.js","../objects/floor":"/Users/dan/Dropbox/htdocs/punkjam/src/objects/floor.js","../objects/player":"/Users/dan/Dropbox/htdocs/punkjam/src/objects/player.js"}]},{},["/Users/dan/Dropbox/htdocs/punkjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tb2R1bGVzL3BsYXllck1vdmVtZW50LmpzIiwic3JjL29iamVjdHMvZmxvb3IuanMiLCJzcmMvb2JqZWN0cy9wbGF5ZXIuanMiLCJzcmMvc3RhdGVzL2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc29sZS5sb2coJyNwdW5ramFtJyk7XG5cbi8vIEdhbWVcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDk2MCwgNTQwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuLy8gU3RhdGVzXG5nYW1lLnN0YXRlLmFkZCgnZ2FtZScsIHJlcXVpcmUoJy4vc3RhdGVzL2dhbWUnKSk7XG5cbi8vIFN0YXJ0XG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4iLCJ2YXIgUlVOX1NQRUVEID0gMzUwMCxcbiAgICBKVU1QX1YgPSAxMDAwLFxuICAgIEFJUl9ERUNFTCA9IDAuMzMsXG4gICAgQUlSX0RSQUcgPSAwLFxuICAgIEZMT09SX0RSQUcgPSA1MDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwbGF5ZXIsIGN1cnNvcnMpIHtcblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIGxlZnRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtTWF0aC5hYnMoUlVOX1NQRUVEKTtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSAtTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gMDtcblxuICAgIH1cblxuICAgIGlmICghcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikge1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICAgIHBsYXllci5ib2R5LmFjY2VsZXJhdGlvbi54ID0gcGxheWVyLmJvZHkuYWNjZWxlcmF0aW9uLnggKiBBSVJfREVDRUw7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oQUlSX0RSQUcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRkxPT1JfRFJBRywgMCk7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC1NYXRoLmFicyhKVU1QX1YpO1xuICAgIH1cblxufTtcbiIsIi8vIGZsb29yLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmbG9vcjtcblxuICAgIGZsb29yID0gdGhpcy5hZGQuc3ByaXRlKDAsIHRoaXMud29ybGQuaGVpZ2h0LTkwLCAnc3AnKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShmbG9vcik7XG4gICAgZmxvb3IuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuICAgIGZsb29yLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgZmxvb3Iud2lkdGggPSB0aGlzLndvcmxkLndpZHRoO1xuXG4gICAgcmV0dXJuIGZsb29yO1xufTtcbiIsIi8vIHBsYXllci5qc1xudmFyIERFQURaT05FX1dJRFRIID0gNDAwLFxuICAgIE1BWF9TUEVFRCA9IDM1MCxcbiAgICBBQ0NFTEVSQVRJT04gPSAxMDAwLFxuICAgIERSQUcgPSAxMDAwLFxuICAgIEdSQVZJVFkgPSAyMDAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHZhciBwbGF5ZXI7XG4gICAgcGxheWVyID0gdGhpcy5hZGQuc3ByaXRlKDMyLCB0aGlzLndvcmxkLmhlaWdodCAtIDIwMCwgJ2R1ZGUnKTtcbiAgICBwbGF5ZXIuc2NhbGUuc2V0VG8oMik7XG4gICAgcGxheWVyLmFuY2hvci5zZXRUbygwLjUsMC41KTtcbiAgICBwbGF5ZXIuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBwbGF5ZXJcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwbGF5ZXIpO1xuXG4gICAgLy8gIFBsYXllciBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIC8vIHBsYXllci5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IEdSQVZJVFk7XG4gICAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHBsYXllci5ib2R5Lm1heFZlbG9jaXR5LnNldFRvKE1BWF9TUEVFRCwgTUFYX1NQRUVEICogMTApO1xuICAgIHBsYXllci5ib2R5LmRyYWcuc2V0VG8oRFJBRywgMCk7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgncnVuJywgWzM3LCAzOF0sIDYsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnanVtcCcsIFszOV0sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszXSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgLy8gY2FtZXJhXG4gICAgdGhpcy5jYW1lcmEuZm9sbG93KHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OKTtcbiAgICB0aGlzLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKFxuICAgICAgICB0aGlzLmdhbWUud2lkdGgvMiAtIERFQURaT05FX1dJRFRILzIsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHQsXG4gICAgICAgIERFQURaT05FX1dJRFRILFxuICAgICAgICB0aGlzLmdhbWUuaGVpZ2h0XG4gICAgKTtcblxuICAgIHJldHVybiBwbGF5ZXI7XG59O1xuIiwiLy8gZ2FtZS5qc1xuXG4vLyBDcmVhdGVcbnZhciBjcmVhdGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL3BsYXllcicpLFxuICAgIGNyZWF0ZUZsb29yID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9mbG9vcicpO1xuXG4vLyBVcGRhdGVcbnZhciBwbGF5ZXJNb3ZlbWVudCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcGxheWVyTW92ZW1lbnQnKTtcblxuLy8gR2xvYmFsc1xuXG52YXIgcGxheWVyLCBmbG9vciwgY3Vyc29ycztcblxuZnVuY3Rpb24gZ2FtZVByZWxvYWQgKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZHVkZScsICdhc3NldHMvaW1nL2R1ZGUucG5nJywgMzYsIDM2KTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvbG9uZ3N0cmVldC5naWYnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NwJywgJ2Fzc2V0cy9pbWcvc3BhY2VyLmdpZicpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY2l0eV9zaGVldCcsICdhc3NldHMvaW1nL2NpdHlfc2hlZXQuZ2lmJyk7XG59XG5cbmZ1bmN0aW9uIGdhbWVDcmVhdGUgKCkge1xuXG4gICAgLy8gZW5hYmxlIHBoeXNpY3NcbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcblxuICAgIC8vIHdvcmxkIGJvdW5kc1xuICAgIHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIDAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgqMiwgdGhpcy5nYW1lLmhlaWdodCk7XG5cbiAgICAvLyBkb250IHNtb290aCBhcnRcbiAgICB0aGlzLnN0YWdlLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgYmFja2dyb3VuZFxuICAgIHRoaXMuYWRkLnRpbGVTcHJpdGUoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS5oZWlnaHQsICdiZycpLnNjYWxlLnNldFRvKDIsMik7XG5cbiAgICAvLyBhZGQgZmxvb3JcbiAgICBmbG9vciA9IGNyZWF0ZUZsb29yLmJpbmQodGhpcykoKTtcblxuICAgIC8vIGFkZCBwbGF5ZXJcbiAgICBwbGF5ZXIgPSBjcmVhdGVQbGF5ZXIuYmluZCh0aGlzKSgpO1xuXG4gICAgLy8gY29udHJvbHNcbiAgICBjdXJzb3JzID0gdGhpcy5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cbn1cblxuZnVuY3Rpb24gZ2FtZVVwZGF0ZSAoKSB7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZmxvb3IpO1xuXG4gICAgcGxheWVyTW92ZW1lbnQocGxheWVyLCBjdXJzb3JzKTtcblxuICAgIC8vIGxvbFxuICAgIHBsYXllci50aW50ID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWxvYWQ6IGdhbWVQcmVsb2FkLFxuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgdXBkYXRlOiAgZ2FtZVVwZGF0ZVxufTtcbiJdfQ==
