Juicy.Component.create('Booklet', {
   constructor: function() {
      this.dx = 0;
      this.life = 2;
   },

   deathParticles: function(posX) {
      var self = this;

      this.entity.scene.particles.getComponent('ParticleManager').spawnParticles("255, 0, 0, ", 0.15, 8, function(particle, ndx) {
          return 0;
      },
       function(particle) {
          particle.x = posX;
          particle.y = self.entity.transform.position.y;
          particle.dx = -self.dx * (Math.random() * 0.8 + 0.2) * 9;
          particle.dy = (Math.random() - 0.5) * 10;
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

   },

   update: function(dt, input) {
      var transform = this.entity.transform;
      transform.position.x += this.dx;
   
      this.life -= dt;
      if (this.life < 0) {
         this.entity.dead = true;
         return;
      }

      var enemies = this.entity.scene.enemies;
      for (var i = 0; i < enemies.length; i ++) {
         if (this.entity.transform.testCollision(enemies[i].transform)) {
            enemies[i].getComponent('Enemy').health -= 30;
            
            this.entity.dead = true;
            return;
         }
      }

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         if (this.entity.transform.testCollision(obstacles[i].transform)) {
            var x = obstacles[i].transform.position.x;
            if (this.dx < 0) {
                x += obstacles[i].transform.width;
            }

            this.deathParticles(x);
            this.entity.dead = true;
            return;
         }
      }
   }
});