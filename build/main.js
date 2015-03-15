(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/dan/Dropbox/htdocs/punkjam/src/main.js":[function(require,module,exports){
console.log('#punkjam');

var game = require('./states/game');

var game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');

game.state.add('game', game);
game.state.start('game');

},{"./states/game":"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js"}],"/Users/dan/Dropbox/htdocs/punkjam/src/states/game.js":[function(require,module,exports){
// game.js

function gamePreload () {

}

function gameCreate () {

}

function gameUpdate () {
    console.log('updating')
}


module.exports = {
    preload: gamePreload,
    create:  gameCreate,
    update:  gameUpdate
};

},{}]},{},["/Users/dan/Dropbox/htdocs/punkjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9zdGF0ZXMvZ2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc29sZS5sb2coJyNwdW5ramFtJyk7XG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi9zdGF0ZXMvZ2FtZScpO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg5NjAsIDU0MCwgUGhhc2VyLkFVVE8sICdnYW1lJyk7XG5cbmdhbWUuc3RhdGUuYWRkKCdnYW1lJywgZ2FtZSk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4iLCIvLyBnYW1lLmpzXG5cbmZ1bmN0aW9uIGdhbWVQcmVsb2FkICgpIHtcblxufVxuXG5mdW5jdGlvbiBnYW1lQ3JlYXRlICgpIHtcblxufVxuXG5mdW5jdGlvbiBnYW1lVXBkYXRlICgpIHtcbiAgICBjb25zb2xlLmxvZygndXBkYXRpbmcnKVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWxvYWQ6IGdhbWVQcmVsb2FkLFxuICAgIGNyZWF0ZTogIGdhbWVDcmVhdGUsXG4gICAgdXBkYXRlOiAgZ2FtZVVwZGF0ZVxufTtcbiJdfQ==
