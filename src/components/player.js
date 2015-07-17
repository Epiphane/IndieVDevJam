Juicy.Component.create('Player', {
   update: function(dt, input) {
      var speed = 500;

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
   }
});