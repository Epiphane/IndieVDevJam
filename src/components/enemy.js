Juicy.Component.create('Enemy', {
   constructor: function() {
      this.direction = 1;
   },
   update: function(dt, input) {
      var speed = 8;

      var physics = this.entity.getComponent('Physics');
      if (!physics)
         return;

      physics.dx = speed * this.direction;
   }
});