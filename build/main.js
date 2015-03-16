(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/dan/Dropbox/htdocs/punkjam/src/main.js":[function(require,module,exports){
console.log('#punkjam');

// Game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

// States
game.state.add('game', require('./states/game'));

// Start
game.state.start('game');

},{"./states/game":"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js"}],"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js":[function(require,module,exports){
// game.js

function gamePreload () {
    this.load.spritesheet('dude', 'assets/img/dude.png', 36, 36);
    this.load.image('bg', 'assets/img/longstreet.gif');
    this.load.image('sp', 'assets/img/spacer.gif');
    this.load.spritesheet('city_sheet', 'assets/img/city_sheet.gif');
}

function gameCreate () {

    // enable physics
    this.physics.startSystem(Phaser.Physics.ARCADE);

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
    // player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('run', [37, 38], 6, true);
    player.animations.add('jump', [39], 1, true);
    player.animations.add('idle', [3], 1, true);
    player.animations.play('idle');

    // controls
    cursors = this.input.keyboard.createCursorKeys();

}

function gameUpdate () {
    this.physics.arcade.collide(player, floor);

  //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.scale.x = -Math.abs(player.scale.x);
        player.animations.play('run');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
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
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -1000;
    }


}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{}]},{},["/Users/dan/Dropbox/htdocs/punkjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnNvbGUubG9nKCcjcHVua2phbScpO1xuXG4vLyBHYW1lXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg5NjAsIDU0MCwgUGhhc2VyLkFVVE8sICdnYW1lJyk7XG5cbi8vIFN0YXRlc1xuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCByZXF1aXJlKCcuL3N0YXRlcy9nYW1lJykpO1xuXG4vLyBTdGFydFxuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuIiwiLy8gZ2FtZS5qc1xuXG5mdW5jdGlvbiBnYW1lUHJlbG9hZCAoKSB7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdkdWRlJywgJ2Fzc2V0cy9pbWcvZHVkZS5wbmcnLCAzNiwgMzYpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnYXNzZXRzL2ltZy9sb25nc3RyZWV0LmdpZicpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnc3AnLCAnYXNzZXRzL2ltZy9zcGFjZXIuZ2lmJyk7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdjaXR5X3NoZWV0JywgJ2Fzc2V0cy9pbWcvY2l0eV9zaGVldC5naWYnKTtcbn1cblxuZnVuY3Rpb24gZ2FtZUNyZWF0ZSAoKSB7XG5cbiAgICAvLyBlbmFibGUgcGh5c2ljc1xuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4gICAgLy8gZG9udCBzbW9vdGggYXJ0XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIGJhY2tncm91bmRcbiAgICBiZyA9IHRoaXMuYWRkLnRpbGVTcHJpdGUoMCwgMCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS53aWR0aCwgdGhpcy5jYWNoZS5nZXRJbWFnZSgnYmcnKS5oZWlnaHQsICdiZycpO1xuICAgIGJnLnNjYWxlLnNldFRvKDIsMik7XG5cbiAgICAvLyBhZGQgZmxvb3JcbiAgICBmbG9vciA9IHRoaXMuYWRkLnNwcml0ZSgwLCB0aGlzLndvcmxkLmhlaWdodC05MCwgJ3NwJyk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5lbmFibGUoZmxvb3IpO1xuICAgIGZsb29yLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbiAgICBmbG9vci5ib2R5LmFsbG93R3Jhdml0eSA9IGZhbHNlO1xuICAgIGZsb29yLndpZHRoID0gdGhpcy53b3JsZC53aWR0aDtcblxuICAgIC8vIGFkZCBwbGF5ZXJcbiAgICAvLyBUaGUgcGxheWVyIGFuZCBpdHMgc2V0dGluZ3NcbiAgICBwbGF5ZXIgPSB0aGlzLmFkZC5zcHJpdGUoMzIsIHRoaXMud29ybGQuaGVpZ2h0IC0gMjAwLCAnZHVkZScpO1xuICAgIHBsYXllci50aW50ID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgIHBsYXllci5zY2FsZS5zZXRUbygyKTtcbiAgICBwbGF5ZXIuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuICAgIHBsYXllci5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG5cbiAgICAvLyAgUGxheWVyIHBoeXNpY3MgcHJvcGVydGllcy4gR2l2ZSB0aGUgbGl0dGxlIGd1eSBhIHNsaWdodCBib3VuY2UuXG4gICAgLy8gcGxheWVyLmJvZHkuYm91bmNlLnkgPSAwLjI7XG4gICAgcGxheWVyLmJvZHkuZ3Jhdml0eS55ID0gMjAwMDtcbiAgICAvLyBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgLy8gIE91ciB0d28gYW5pbWF0aW9ucywgd2Fsa2luZyBsZWZ0IGFuZCByaWdodC5cbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ3J1bicsIFszNywgMzhdLCA2LCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMzldLCAxLCB0cnVlKTtcbiAgICBwbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnLCBbM10sIDEsIHRydWUpO1xuICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcblxuICAgIC8vIGNvbnRyb2xzXG4gICAgY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG59XG5cbmZ1bmN0aW9uIGdhbWVVcGRhdGUgKCkge1xuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGZsb29yKTtcblxuICAvLyAgUmVzZXQgdGhlIHBsYXllcnMgdmVsb2NpdHkgKG1vdmVtZW50KVxuICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwO1xuXG4gICAgaWYgKGN1cnNvcnMubGVmdC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgbGVmdFxuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gLTE1MDtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSAtTWF0aC5hYnMocGxheWVyLnNjYWxlLngpO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IDE1MDtcbiAgICAgICAgcGxheWVyLnNjYWxlLnggPSBNYXRoLmFicyhwbGF5ZXIuc2NhbGUueCk7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ3J1bicpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAvLyAgU3RhbmQgc3RpbGxcbiAgICAgICAgcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuXG4gICAgfVxuXG4gICAgaWYgKCFwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSB7XG4gICAgICAgIHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2p1bXAnKTtcbiAgICB9XG5cbiAgICAvLyAgQWxsb3cgdGhlIHBsYXllciB0byBqdW1wIGlmIHRoZXkgYXJlIHRvdWNoaW5nIHRoZSBncm91bmQuXG4gICAgaWYgKGN1cnNvcnMudXAuaXNEb3duICYmIHBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLTEwMDA7XG4gICAgfVxuXG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVsb2FkOiBnYW1lUHJlbG9hZCxcbiAgICBjcmVhdGU6ICBnYW1lQ3JlYXRlLFxuICAgIHVwZGF0ZTogIGdhbWVVcGRhdGVcbn07XG4iXX0=
