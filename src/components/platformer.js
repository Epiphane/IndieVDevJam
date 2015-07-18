Juicy.Component.create('Physics', {
    constructor: function() {
        this.dx = this.dy = 0;
        this.onGround = false;
    },

    jump: function() {
        if (this.onGround) {
            this.dy = -60;
            this.onGround = false;

            var animator = this.entity.getComponent('Animations');
            if (animator) {
                animator.play(xScaleAnimation(0.4, 1.0, 0.5, 0.2), "horizontal_squish");
            }


			var butt = {
				x: this.entity.transform.position.x,
				y: this.entity.transform.position.y + this.entity.transform.height - 0.3
			}

			this.entity.scene.particles.getComponent('ParticleManager').spawnParticles(butt, "butts.jpg", 5, function(particle) {
				particle.dx = Math.random() * 1 - 0.5;
				particle.dy = -0.01;
				particle.startY = butt.y;
			}, function(particle) {
				particle.x += particle.dx;
				particle.y += particle.dy;
				particle.dx *= 0.83;
				particle.dy *= 1.11;
			});

        }
    },

    update: function(dt, input) {
      var tileManager = this.entity.scene.tileManager.getComponent('LevelTiles');
      
      var transform = this.entity.transform;

      var dx = this.dx * dt;
      var dy = this.dy * dt;

      var tl = tileManager.raycast(transform.position.x,                   transform.position.y, dx, dy);
      var tr = tileManager.raycast(transform.position.x + transform.width, transform.position.y, dx, dy);
      // TODO: Middle feelers
      var bl = tileManager.raycast(transform.position.x,                   transform.position.y + transform.height, dx, dy);
      var br = tileManager.raycast(transform.position.x + transform.width, transform.position.y + transform.height, dx, dy);

      var mindx = tl.dx;
      var mindy = tl.dy;
      if (Math.abs(tr.dx) < Math.abs(mindx)) mindx = tr.dx;
      if (Math.abs(tr.dy) < Math.abs(mindy)) mindy = tr.dy;
      if (Math.abs(br.dx) < Math.abs(mindx)) mindx = br.dx;
      if (Math.abs(br.dy) < Math.abs(mindy)) mindy = br.dy;
      if (Math.abs(bl.dx) < Math.abs(mindx)) mindx = bl.dx;
      if (Math.abs(bl.dy) < Math.abs(mindy)) mindy = bl.dy;

      var ray = tl;
      if (tr.dist < ray.dist || tr.hit.y) {
        ray = tr;
      }
      if (br.dist < ray.dist || br.hit.y) {
        ray = br;
      }
      if (bl.dist < ray.dist || bl.hit.y) {
        ray = bl;
      }

      // Walk across all the tiles
      transform.position.x += mindx;
      transform.position.y += mindy;

      if (dy > 0 && Math.abs(mindy) < 0.01) {
        this.dy = 0;
        this.onGround = true;
      }
      else {
        this.onGround = false;
      }

      return;

      var prev = {
        x: transform.position.x,
        y: transform.position.y
      };

      transform.position.x += dx;
      transform.position.y += dy;

      var obstacles = tileManager.getObstacles(transform.position.x, transform.position.y, transform.width, transform.height);
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i];

         if (transform.testCollision(obstacle)) {
            var wasLeft  = obstacle.position.x >= prev.x + transform.width;
            var wasRight = obstacle.position.x + obstacle.width <= prev.x;
            var wasAbove = obstacle.position.y >= prev.y + transform.height;
            var wasBelow = obstacle.position.y + obstacle.height <= prev.y;

            if (wasAbove) {
               if (this.onGround == false) {
                  var animator = this.entity.getComponent('Animations');
                  if (animator) {
                     animator.play(yScaleAnimation(0.7, 1.0, 1.0, 0.2));
                  }
               }

               transform.position.y = obstacle.position.y - transform.height;
               console.log(transform.position.y);
               this.dy = 0;
               this.onGround = true;
            }
            else if (wasLeft) {
               transform.position.x = obstacle.position.x - transform.width;
            }
            else if (wasBelow) {
               transform.position.y = obstacle.position.y + obstacle.height;
               this.dy = 0;
               
               var animator = this.entity.getComponent('Animations');
               if (animator) {
                  animator.play(yScaleAnimation(0.7, 1.0, 0.0, 0.2), "vertical_squish");
               }
            }
            else if (wasRight) {
               transform.position.x = obstacle.position.x + obstacle.width;
            }
         }
      }

      if (transform.position.x + transform.width < 0)
         transform.position.x += this.entity.scene.width + 1;
      if (transform.position.x > this.entity.scene.width)
         transform.position.x -= this.entity.scene.width + 1;

      this.dx = 0;
      if (Math.abs(this.dy) >= 0.1)
         this.onGround = false;


   },


    render: function(context) {}
});