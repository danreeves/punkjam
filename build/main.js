(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/dan/Dropbox/htdocs/punkjam/src/main.js":[function(require,module,exports){
console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');

},{"./states/game":"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js"}],"/Users/dan/Dropbox/htdocs/punkjam/src/modules/playerMovement.js":[function(require,module,exports){
var RUN_SPEED = 400;


module.exports = function (player, cursors) {

    // Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -Math.abs(RUN_SPEED);
        player.scale.x = -Math.abs(player.scale.x);
        player.animations.play('run');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = Math.abs(RUN_SPEED);
        player.scale.x = Math.abs(player.scale.x);
        player.animations.play('run');
    }
    else
    {
        //  Stand still
        player.animations.play('idle');

    }

    if (!player.body.touching.down) {
        player.animations.play('jump');
        player.body.velocity.x = player.body.velocity.x/4*3;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -1000;
    }
};

},{}],"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js":[function(require,module,exports){
// game.js
var playerMovement = require('../modules/playerMovement'),
DEADZONE_WIDTH = 400;

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
    bg = this.add.tileSprite(0, 0, this.cache.getImage('bg').width, this.cache.getImage('bg').height, 'bg');
    bg.scale.setTo(2,2);

    // add floor
    floor = this.add.sprite(0, this.world.height-90, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width;

    // add player
    // The player and its settings
    player = this.add.sprite(32, this.world.height - 200, 'dude');
    player.tint = Math.random() * 0xffffff;
    player.scale.setTo(2);
    player.anchor.setTo(0.5,0.5);
    player.smoothed = false;

    //  We need to enable physics on the player
    this.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    player.body.gravity.y = 2000;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('run', [37, 38], 6, true);
    player.animations.add('jump', [39], 1, true);
    player.animations.add('idle', [3], 1, true);
    player.animations.play('idle');

    // controls
    cursors = this.input.keyboard.createCursorKeys();

    // camera
    this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
    this.camera.deadzone = new Phaser.Rectangle(
        this.game.width/2 - DEADZONE_WIDTH/2,
        this.game.height,
        DEADZONE_WIDTH,
        this.game.height
    );
    // this.camera.deadzone.fixedToCamera = true;

}

function gameUpdate () {
    this.physics.arcade.collide(player, floor);

    playerMovement(player, cursors);

}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{"../modules/playerMovement":"/Users/dan/Dropbox/htdocs/punkjam/src/modules/playerMovement.js"}]},{},["/Users/dan/Dropbox/htdocs/punkjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tb2R1bGVzL3BsYXllck1vdmVtZW50LmpzIiwic3JjL3N0YXRlcy9nYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc29sZS5sb2coJyNwdW5ramFtJyk7XG5cbi8vIEdhbWVcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDk2MCwgNTQwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuLy8gU3RhdGVzXG5nYW1lLnN0YXRlLmFkZCgnZ2FtZScsIHJlcXVpcmUoJy4vc3RhdGVzL2dhbWUnKSk7XG5cbi8vIFN0YXJ0XG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4iLCJ2YXIgUlVOX1NQRUVEID0gNDAwO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllciwgY3Vyc29ycykge1xuXG4gICAgLy8gUmVzZXQgdGhlIHBsYXllcnMgdmVsb2NpdHkgKG1vdmVtZW50KVxuICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwO1xuXG4gICAgaWYgKGN1cnNvcnMubGVmdC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgbGVmdFxuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gLU1hdGguYWJzKFJVTl9TUEVFRCk7XG4gICAgICAgIHBsYXllci5zY2FsZS54ID0gLU1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgLy8gIE1vdmUgdG8gdGhlIHJpZ2h0XG4gICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSBNYXRoLmFicyhSVU5fU1BFRUQpO1xuICAgICAgICBwbGF5ZXIuc2NhbGUueCA9IE1hdGguYWJzKHBsYXllci5zY2FsZS54KTtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vICBTdGFuZCBzdGlsbFxuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG5cbiAgICB9XG5cbiAgICBpZiAoIXBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pIHtcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnanVtcCcpO1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gcGxheWVyLmJvZHkudmVsb2NpdHkueC80KjM7XG4gICAgfVxuXG4gICAgLy8gIEFsbG93IHRoZSBwbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmIChjdXJzb3JzLnVwLmlzRG93biAmJiBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC0xMDAwO1xuICAgIH1cbn07XG4iLCIvLyBnYW1lLmpzXG52YXIgcGxheWVyTW92ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3BsYXllck1vdmVtZW50JyksXG5ERUFEWk9ORV9XSURUSCA9IDQwMDtcblxuZnVuY3Rpb24gZ2FtZVByZWxvYWQgKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZHVkZScsICdhc3NldHMvaW1nL2R1ZGUucG5nJywgMzYsIDM2KTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9pbWcvbG9uZ3N0cmVldC5naWYnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3NwJywgJ2Fzc2V0cy9pbWcvc3BhY2VyLmdpZicpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY2l0eV9zaGVldCcsICdhc3NldHMvaW1nL2NpdHlfc2hlZXQuZ2lmJyk7XG59XG5cbmZ1bmN0aW9uIGdhbWVDcmVhdGUgKCkge1xuXG4gICAgLy8gZW5hYmxlIHBoeXNpY3NcbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcblxuICAgIC8vIHdvcmxkIGJvdW5kc1xuICAgIHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIDAsIHRoaXMuY2FjaGUuZ2V0SW1hZ2UoJ2JnJykud2lkdGgqMiwgdGhpcy5nYW1lLmhlaWdodCk7XG5cbiAgICAvLyBkb250IHNtb290aCBhcnRcbiAgICB0aGlzLnN0YWdlLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgYmFja2dyb3VuZFxuICAgIGJnID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLndpZHRoLCB0aGlzLmNhY2hlLmdldEltYWdlKCdiZycpLmhlaWdodCwgJ2JnJyk7XG4gICAgYmcuc2NhbGUuc2V0VG8oMiwyKTtcblxuICAgIC8vIGFkZCBmbG9vclxuICAgIGZsb29yID0gdGhpcy5hZGQuc3ByaXRlKDAsIHRoaXMud29ybGQuaGVpZ2h0LTkwLCAnc3AnKTtcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShmbG9vcik7XG4gICAgZmxvb3IuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuICAgIGZsb29yLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgZmxvb3Iud2lkdGggPSB0aGlzLndvcmxkLndpZHRoO1xuXG4gICAgLy8gYWRkIHBsYXllclxuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHBsYXllciA9IHRoaXMuYWRkLnNwcml0ZSgzMiwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsICdkdWRlJyk7XG4gICAgcGxheWVyLnRpbnQgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgcGxheWVyLnNjYWxlLnNldFRvKDIpO1xuICAgIHBsYXllci5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgcGxheWVyLnNtb290aGVkID0gZmFsc2U7XG5cbiAgICAvLyAgV2UgbmVlZCB0byBlbmFibGUgcGh5c2ljcyBvbiB0aGUgcGxheWVyXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUocGxheWVyKTtcblxuICAgIC8vICBQbGF5ZXIgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICAvLyBwbGF5ZXIuYm9keS5ib3VuY2UueSA9IDAuMjtcbiAgICBwbGF5ZXIuYm9keS5ncmF2aXR5LnkgPSAyMDAwO1xuICAgIHBsYXllci5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG5cbiAgICAvLyAgT3VyIHR3byBhbmltYXRpb25zLCB3YWxraW5nIGxlZnQgYW5kIHJpZ2h0LlxuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgncnVuJywgWzM3LCAzOF0sIDYsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnanVtcCcsIFszOV0sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLmFkZCgnaWRsZScsIFszXSwgMSwgdHJ1ZSk7XG4gICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgLy8gY29udHJvbHNcbiAgICBjdXJzb3JzID0gdGhpcy5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cbiAgICAvLyBjYW1lcmFcbiAgICB0aGlzLmNhbWVyYS5mb2xsb3cocGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04pO1xuICAgIHRoaXMuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUoXG4gICAgICAgIHRoaXMuZ2FtZS53aWR0aC8yIC0gREVBRFpPTkVfV0lEVEgvMixcbiAgICAgICAgdGhpcy5nYW1lLmhlaWdodCxcbiAgICAgICAgREVBRFpPTkVfV0lEVEgsXG4gICAgICAgIHRoaXMuZ2FtZS5oZWlnaHRcbiAgICApO1xuICAgIC8vIHRoaXMuY2FtZXJhLmRlYWR6b25lLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKCkge1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGZsb29yKTtcblxuICAgIHBsYXllck1vdmVtZW50KHBsYXllciwgY3Vyc29ycyk7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVsb2FkOiBnYW1lUHJlbG9hZCxcbiAgICBjcmVhdGU6ICBnYW1lQ3JlYXRlLFxuICAgIHVwZGF0ZTogIGdhbWVVcGRhdGVcbn07XG4iXX0=
