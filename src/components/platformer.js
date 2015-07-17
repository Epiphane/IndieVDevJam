require([
   './src/engine/lib/SAT.js'
]);

Juicy.Component.create('Physics', {
   constructor: function() {
      this.bounding = new SAT.Box(new SAT.Vector(0, 0), 0, 0);
   
      this.dx = this.dy = 0;
      this.onGround = false;
   },
   jump: function() {
      if (this.onGround) {
         this.dy = -1000;
         this.onGround = false;
      }
   },
   update: function(dt, input) {
      this.dy += 5000 * dt;

      var transform = this.entity.transform;

      var next = {
         x: transform.position.x + this.dx * dt,
         y: transform.position.y + this.dy * dt
      };

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].getComponent('Obstacle').bounding;
      
         var isLeft  = obstacle.pos.x >= next.x + transform.width;
         var isRight = obstacle.pos.x + obstacle.w <= next.x;
         var isAbove = obstacle.pos.y >= next.y + transform.height;
         var isBelow = obstacle.pos.y + obstacle.h <= next.y;

         if (!isLeft && !isRight && !isAbove && !isBelow) {
            var wasLeft  = obstacle.pos.x >= transform.position.x + transform.width;
            var wasRight = obstacle.pos.x + obstacle.w <= transform.position.x;
            var wasAbove = obstacle.pos.y >= transform.position.y + transform.height;
            var wasBelow = obstacle.pos.y + obstacle.h <= transform.position.y;

            if (wasAbove) {
               next.y = obstacle.pos.y - transform.height;
               this.dy = 0;
               this.onGround = true;
            }
            else if (wasLeft) {
               next.x = obstacle.pos.x - transform.width;
            }
            else if (wasBelow) {
               next.y = obstacle.pos.y + obstacle.h;
               this.dy = 0;
            }
            else if (wasRight) {
               next.x = obstacle.pos.x + obstacle.w;
            }
         }
      }

      transform.position.x = next.x;
      transform.position.y = next.y;

      this.dx = 0;

      return;

      this.bounding.pos.x = this.entity.transform.position.x;
      this.bounding.pos.y = this.entity.transform.position.y;
      this.bounding.w = this.entity.transform.width;
      this.bounding.h = this.entity.transform.height;

      var me = this.bounding.toPolygon();

      var obstacles = this.entity.scene.obstacles;
      var collision = new SAT.Response();
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].getComponent('Obstacle').bounding;

         // Test collision
         var verticalMatch = obstacle.pos.x < this.bounding.pos.x + this.bounding.w
                          && obstacle.pos.x + obstacle.w > this.bounding.pos.x;
         var horizontalMatch = obstacle.pos.y < this.bounding.pos.y + this.bounding.h
                            && obstacle.pos.y + obstacle.h > this.bounding.pos.y;

         if (verticalMatch && horizontalMatch) {
            // Test horizontal match
            if (this.bounding.pos.x < obstacle.pos.x) {
               this.bounding.pos.x = obstacle.pos.x - this.bounding.w;
            }
            // Below it
            // else {
            //    this.bounding.pos.x = obstacle.pos.x + obstacle.w;
            // }
            // Vertical collision
            else {
               // On top of it
               if (this.bounding.pos.y < obstacle.pos.y) {
                  this.bounding.pos.y = obstacle.pos.y - this.bounding.h;
               }
               // Below it
               else {
                  this.bounding.pos.y = obstacle.pos.y + obstacle.h;
               }
               this.dy = 0;
            }
         }

         // if (SAT.testPolygonPolygon(me, obstacle.toPolygon(), collision)) {
         //    // this.bounding.pos.x += collision.overlapV.x;
         //    // this.bounding.pos.y += collision.overlapV.y;
         //    // console.log(collision.overlapV.y);
         //    // if (this.bounding.pos.y > obstacle.pos.y)
         //       console.log(collision.a.pos);

         //    if (collision.overlapV.y < 0)
         //       this.dy = 0;
         // }
      }

      this.entity.transform.position.x = this.bounding.pos.x;
      this.entity.transform.position.y = this.bounding.pos.y;
   },
   render: function(context) {
   }
});

Juicy.Component.create('Obstacle', {
   constructor: function() {
      this.bounding = new SAT.Box(new SAT.Vector(0, 0), 0, 0);
   },
   setBounds: function(x, y, w, h) {
      this.bounding.pos.x = this.entity.transform.position.x = x;
      this.bounding.pos.y = this.entity.transform.position.y = y;
      this.bounding.w     = this.entity.transform.width      = w;
      this.bounding.h     = this.entity.transform.height     = h;
   }
});