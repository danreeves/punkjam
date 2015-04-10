'use strict';

module.exports = function createCoin (camera) {

    var x = Math.floor( (Math.random() * camera.view.right - 150) + camera.view.left + 150 );
    var coin = this.add.sprite(x, 250, 'coin');
    coin.scale.setTo(0.1);

    return coin;
}
