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
