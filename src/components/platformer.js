Juicy.Component.create('Physics', {
   constructor: function() {
      this.dx = this.dy = 0;
      this.onGround = false;
   },
   jump: function() {
      if (this.onGround) {
         this.dy = -20;
         this.onGround = false;
      }
   },
   update: function(dt, input) {
      this.dy += 75 * dt;

      var transform = this.entity.transform;

      var next = {
         x: transform.position.x + this.dx * dt,
         y: transform.position.y + this.dy * dt
      };

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].transform;
      
         var isLeft  = obstacle.position.x >= next.x + transform.width;
         var isRight = obstacle.position.x + obstacle.width <= next.x;
         var isAbove = obstacle.position.y >= next.y + transform.height;
         var isBelow = obstacle.position.y + obstacle.height <= next.y;

         if (!isLeft && !isRight && !isAbove && !isBelow) {
            var wasLeft  = obstacle.position.x >= transform.position.x + transform.width;
            var wasRight = obstacle.position.x + obstacle.width <= transform.position.x;
            var wasAbove = obstacle.position.y >= transform.position.y + transform.height;
            var wasBelow = obstacle.position.y + obstacle.height <= transform.position.y;

            if (wasAbove) {
               next.y = obstacle.position.y - transform.height;
               this.dy = 0;
               this.onGround = true;
            }
            else if (wasLeft) {
               next.x = obstacle.position.x - transform.width;
            }
            else if (wasBelow) {
               next.y = obstacle.position.y + obstacle.height;
               this.dy = 0;
            }
            else if (wasRight) {
               next.x = obstacle.position.x + obstacle.width;
            }
         }
      }

      transform.position.x = next.x;
      transform.position.y = next.y;

      this.dx = 0;
      if (Math.abs(this.dy) >= 10)
         this.onGround = false;
   },
   render: function(context) {
   }
});
