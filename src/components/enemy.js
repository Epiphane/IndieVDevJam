Juicy.Component.create('Enemy', {
   constructor: function() {
      this.direction = 1;

      this.health = 100;
      this.speed = 8;
   },
   update: function(dt, input) {
      if (this.health <= 0) {
         this.entity.dead = true;
         
      }

      var physics = this.entity.getComponent('PatrollingPhysics');
      if (!physics)
         return;

      physics.dy += 240 * dt;
      physics.dx = this.speed * this.direction;
   }
});