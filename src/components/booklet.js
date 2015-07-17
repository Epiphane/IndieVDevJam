Juicy.Component.create('Booklet', {
   constructor: function() {
      this.dx = 0;
      this.life = 2;
   },
   update: function(dt, input) {
      var transform = this.entity.transform;
      transform.position.x += this.dx;
   
      this.life -= dt;
      if (this.life < 0) {
         this.entity.dead = true;
         return;
      }

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].transform;
      
         var isLeft  = obstacle.position.x >= transform.position.x + transform.width;
         var isRight = obstacle.position.x + obstacle.width <= transform.position.x;
         var isAbove = obstacle.position.y >= transform.position.y + transform.height;
         var isBelow = obstacle.position.y + obstacle.height <= transform.position.y;

         if (!isLeft && !isRight && !isAbove && !isBelow) {
            this.entity.dead = true;
            return;
         }
      }
   }
});