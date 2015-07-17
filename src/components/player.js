Juicy.Component.create('Player', {
   constructor: function() {
      this.direction = 1;
   },
   update: function(dt, input) {
      var speed = 8;

      var physics = this.entity.getComponent('Physics');
      if (!physics)
         return;

      if (input.keyDown('UP')) {
         physics.jump();
      }
      if (input.keyDown('LEFT')) {
         physics.dx = -speed;
      }
      if (input.keyDown('RIGHT')) {
         physics.dx = speed;
      }

      this.direction = physics.dx > 0 ? 1 : -1;
   }
});