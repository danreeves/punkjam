// canSpawnCopz.js

module.exports = function (copz, wantedLevel) {
    if (wantedLevel === 0) return false;

    var maxCopz = (wantedLevel === 1) ?
                    5 : (wantedLevel === 2) ?
                    10 : (wantedLevel === 3) ?
                    15 : (wantedLevel === 4) ?
                    25 : (wantedLevel === 5) ?
                    50 : (wantedLevel === 6) ?
                    100 : 0;

    if (copz.length >= maxCopz) return false;

    return true;
};
