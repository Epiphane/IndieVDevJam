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


			var self = this;

			var butt = {
				x: this.entity.transform.position.x,
				y: this.entity.transform.position.y + this.entity.transform.height
			}

			this.entity.scene.particles.getComponent('ParticleManager').spawnParticles(butt, "", 8, function(particle, ndx) {
				if (ndx > 1) {
					return ndx - 1;
				}
				else {
					return 0;
				}
			},
			 function(particle) {
			 	particle.x = self.entity.transform.position.x + self.entity.transform.width/2 * (Math.random() * 2);
			 	particle.y = self.entity.transform.position.y + self.entity.transform.height + 0.7;
				particle.dx = self.dx + Math.random() * 4 - 2;
				particle.dy = self.dy / 8;
				particle.startY = butt.y;
				particle.startLife = 30;
				particle.life = particle.startLife;
			}, function(particle) {
				particle.x += particle.dx * 0.01;
				particle.y += particle.dy * 0.01;
				particle.dx *= 0.9;
				particle.dy *= 0.9;

				if (particle.life > particle.startLife) {
					particle.alpha = 1;
				}
				else {
					particle.alpha = particle.life / particle.startLife;
				}
			});

        }
    },

update: function(dt, input) {
      this.dy += 240 * dt;

      var transform = this.entity.transform;

      var prev = {
         x: transform.position.x,
         y: transform.position.y
      };

      transform.position.x += this.dx * dt
      transform.position.y += this.dy * dt

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].transform;

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
      if (Math.abs(this.dy) >= 10)
         this.onGround = false;
   },


    render: function(context) {}
});