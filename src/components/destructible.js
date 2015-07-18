Juicy.Component.create('Destructible', {
    constructor: function(health) {
        this.health = health || 0;
    },
    update: function(dt) {
        if (this.health <= 0) {
            this.entity.dead = true;
        }
    }
});