Juicy.Component.create('Player', {
   update: function(dt, input) {
      var speed = 500;

      if (input.keyDown('UP')) {
         this.entity.transform.position.y -= speed * dt;
      }
      if (input.keyDown('DOWN')) {
         this.entity.transform.position.y += speed * dt;
      }
      if (input.keyDown('LEFT')) {
         this.entity.transform.position.x -= speed * dt;
      }
      if (input.keyDown('RIGHT')) {
         this.entity.transform.position.x += speed * dt;
      }
   }
});