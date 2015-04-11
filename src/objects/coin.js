'use strict';

module.exports = function createCoin (camera,setx,sety) {

    var x = Math.floor( (Math.random() * camera.view.right - 150) + camera.view.left + 150 );
    var y = Math.floor( (Math.random() * 300) + 150 );
    var coin = this.add.sprite(setx || x, sety || y, 'coin');
    coin.scale.setTo(0.1);

    return coin;
}
