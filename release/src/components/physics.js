Juicy.Component.create('Physics', {
    constructor: function() {
        this.dx = this.dy = 0;
        this.onGround = false;
        this.jumpPower = -60;

        this.collisions = {
          above: false,
          below: false,
          right: false,
          left: false
        };

        this.touchingSpike = false;
    },

    jump: function() {
        if (this.onGround) {

            this.dy = jumpPower;
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

      var tl = tileManager.raycast(transform.position.x,                       transform.position.y, dx, dy);
      var tr = tileManager.raycast(transform.position.x + transform.width,     transform.position.y, dx, dy);
      var ml = tileManager.raycast(transform.position.x,                       transform.position.y + transform.height / 2, dx, dy);
      var mr = tileManager.raycast(transform.position.x + transform.width,     transform.position.y + transform.height / 2, 1, dy);
      var bl = tileManager.raycast(transform.position.x,                       transform.position.y + transform.height, dx, dy);
      var bm = tileManager.raycast(transform.position.x + transform.width / 2, transform.position.y + transform.height, dx, dy);
      var br = tileManager.raycast(transform.position.x + transform.width,     transform.position.y + transform.height, dx, dy);

      var mindx = tl.dx;
      var mindy = tl.dy;
      if (dx > 0) {
        if (Math.abs(tr.dx) < Math.abs(mindx)) mindx = tr.dx;
        if (Math.abs(tr.dy) < Math.abs(mindy)) mindy = tr.dy;
        if (Math.abs(mr.dx) < Math.abs(mindx)) mindx = mr.dx;
      }
      if (Math.abs(br.dx) < Math.abs(mindx)) mindx = br.dx;
      if (Math.abs(br.dy) < Math.abs(mindy)) mindy = br.dy;
      if (Math.abs(bl.dx) < Math.abs(mindx)) mindx = bl.dx;
      if (Math.abs(bl.dy) < Math.abs(mindy)) mindy = bl.dy;
      if (Math.abs(bm.dy) < Math.abs(mindy)) mindy = bm.dy;
      if (Math.abs(ml.dx) < Math.abs(mindx)) mindx = ml.dx;

      // Walk across all the tiles
      transform.position.x += mindx;
      transform.position.y += mindy;

      if (dy > 0 && Math.abs(mindy) < 0.01) {
         if (!tileManager.canMove(transform.position.x, transform.position.y + transform.height, 0, 1)
          || !tileManager.canMove(transform.position.x + transform.width, transform.position.y + transform.height, 0, 1)) {

          var upgrades = this.entity.getComponent('Upgrades');
            if (this.onGround == false && upgrades) {
               if (upgrades.heavy) {
                     this.doImpactParticles();
            }
         }

         if (!this.onGround) {

            var animator = this.entity.getComponent('Animations');
            if (animator) {
              animator.play(yScaleAnimation(0.7, 1.0, 1.0, 0.2), "vertical_squish");
            }
          }

            this.dy = 0;
            this.onGround = true;

         }
      }
      else {
        this.onGround = false;
      }

      if (dx !== 0 && Math.abs(mindx) < 0.01) {
        // We hit a wall
        if (dx < 0) this.collisions.left = true;
        else this.collisions.right = true;
      }

      if (dy !== 0 && Math.abs(mindy) < 0.01) {
        // We hit a wall
        if (dy < 0) this.collisions.above = true;
        else this.collisions.below = true;

            this.dy = 0;
      }

      this.touchingSpike = false;
      for (var i = 0; i < transform.width; i ++) {
        for (var j = 0; j < transform.height; j ++) {
          var x = Math.floor(transform.position.x + i);
          var y = Math.floor(transform.position.y + j);

          if (tileManager.getTile(x, y) === tileManager.SPIKE) {
            this.touchingSpike = true;
          }
        }
      }
   },

   bounceBack: function(senderX, receiverX, scale) {
     this.dy = -30 * scale;
     if (senderX > receiverX) {
        // Launch receiver left
        this.dx = -20 * scale;
     }
     else {
        // Launch receiver right
        this.dx = 20 * scale;
     }
     ga('send', 'event', 'player', 'touched-enemy', 'non-upgraded');
  },

   doImpactParticles: function() {
        var self = this;

        this.entity.scene.particles.getComponent('ParticleManager').spawnParticles("0, 255, 0, ", 0.3, 8, function(particle, ndx) {
            return 0;
        },
         function(particle) {
            particle.x = self.entity.transform.position.x + self.entity.transform.width/2;
            particle.y = self.entity.transform.position.y + self.entity.transform.height;
            particle.dx = Math.random() * 50 - 25;
            particle.startLife = 30;
            particle.life = particle.startLife;
        }, function(particle) {
            particle.x += particle.dx * 0.01;
            particle.dx *= 0.9;
 
            if (particle.life > particle.startLife) {
                particle.alpha = 1;
            }
            else {
                particle.alpha = particle.life / particle.startLife;
            }
       });
   },

   render: function(context) {}
});
