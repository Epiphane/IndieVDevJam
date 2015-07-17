Juicy.Component.create('Physics', {
   constructor: function() {
      this.dx = this.dy = 0;
      this.onGround = false;
   },
   jump: function() {
      if (this.onGround) {
         this.dy = -30;
         this.onGround = false;
         this.entity.getComponent('Particles').startParticles();
	 
	 var animator = this.entity.getComponent('Animations');
	 if (animator) {
	    animator.currAnimations.push(xScaleAnimation(0.4, 1.0, 0.2));
	 }
      }
   },
   update: function(dt, input) {
      this.dy += 120 * dt;

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
	       if (this.onGround == false) {
		  var animator = this.entity.getComponent('Animations');
		  if (animator) {
		     animator.currAnimations.push(yScaleAnimation(0.7, 1.0, 0.2));
		  }
	       }

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

      if (transform.position.x + transform.width < 0)
         transform.position.x += this.entity.scene.width + 1;
      if (transform.position.x > this.entity.scene.width)
         transform.position.x -= this.entity.scene.width + 1;

      this.dx = 0;
      if (Math.abs(this.dy) >= 10)
         this.onGround = false;
   },
   render: function(context) {
   }
});
