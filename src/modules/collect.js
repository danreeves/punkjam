'use strict';

module.exports = function collect (player, coin) {
    player.score++;
    coin.destroy();
}
