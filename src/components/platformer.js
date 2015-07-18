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
            
			ga('send', 'event', 'player', 'jump', 'non-upgraded');

			var self = this;

			var butt = {
				x: this.entity.transform.position.x,
				y: this.entity.transform.position.y + this.entity.transform.height
			}

			this.entity.scene.particles.getComponent('ParticleManager').spawnParticles("100, 200, 200, ", 0.3,  8, function(particle, ndx) {
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
         if (!tileManager.canMove(transform.position.x, transform.position.y + transform.height, 0, 1)) {
            this.dy = 0;
            this.onGround = true;
         }
      }
      else {
        this.onGround = false;
      }
   },


   render: function(context) {}
});