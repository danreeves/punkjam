'use strict';

module.exports = {
    preload: function () {
        this.game.load.image('loading', 'assets/img/anarchy.png');
    },
    create: function () {
        this.game.state.start('load');
    }
};
