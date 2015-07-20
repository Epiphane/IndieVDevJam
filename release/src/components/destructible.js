Juicy.Component.create('Destructible', {
    constructor: function(health) {
        this.health = health || 0;

        this.destroyed = false;
    },
    update: function(dt) {
        if (this.destroyed)
            return;

        if (this.health <= 0) {
            if (this.ondestroy) {
                this.ondestroy();

                this.destroyed = true;
            }
            else {
                this.entity.dead = true;
            }
        }
    }
});