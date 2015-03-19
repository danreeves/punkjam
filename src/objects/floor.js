// floor.js
var WORLD_OVERFLOW;

module.exports = function () {
    WORLD_OVERFLOW = this.cache.getImage('dude').width*2;
    var floor;

    floor = this.add.sprite(-WORLD_OVERFLOW, this.world.height-90, 'sp');
    this.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.width = this.world.width + WORLD_OVERFLOW;

    return floor;
};
