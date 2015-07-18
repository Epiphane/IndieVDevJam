Juicy.Component.create('Enemy', {
   constructor: function() {
      this.direction = 1;

      this.health = 100;
   },
   update: function(dt, input) {
      var speed = 8;

      if (this.health <= 0) {
         this.entity.dead = true;
         
      }

      var physics = this.entity.getComponent('Physics');
      if (!physics)
         return;

      physics.dx = speed * this.direction;
   }
});