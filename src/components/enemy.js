Juicy.Component.create('Enemy', {
   constructor: function() {
      this.direction = 1;

      this.health = 100;
      this.speed = 8;
      this.slow = 0;
   },
   update: function(dt, input) {
      var speed = this.speed;
      if (this.slow >= 0) {
        this.slow -= dt;
        speed /= 2;
      }

      if (this.health <= 0) {
          this.entity.dead = true;
          this.entity.scene.player.getComponent('Score').eventOccurred('killedEnemy');
      }

      var physics = this.entity.getComponent('PatrollingPhysics');
      if (!physics)
         return;

      physics.dy += 240 * dt;
      physics.dx = speed * this.direction;
   }
});
