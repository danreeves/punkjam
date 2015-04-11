'use strict';

module.exports = function displayWanted (sprites, wlvl) {

    sprites.forEach(function (v,i) {
        if (i < wlvl) v.alpha = 1;
    });

    if (wlvl < 6) {
        sprites[5].alpha = 0;
    }

}
