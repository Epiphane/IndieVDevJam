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
      var tileManager = this.entity.scene.tileManager.getComponent('LevelTiles');

      var transform = this.entity.transform;

      var ray;
      if (this.dx > 0) {
         // Moving right
         var top = tileManager.raycast(transform.position.x + transform.width, transform.position.y, this.dx * dt, 0);
         var bot = tileManager.raycast(transform.position.x + transform.width, transform.position.y + transform.height, this.dx * dt, 0);

         if (Math.abs(top.dx) > Math.abs(bot.dx)) ray = bot;
         else ray = top;
      }
      else {
         // Moving left
         var top = tileManager.raycast(transform.position.x, transform.position.y, this.dx * dt, 0);
         var bot = tileManager.raycast(transform.position.x, transform.position.y + transform.height, this.dx * dt, 0);
      
         if (Math.abs(top.dx) > Math.abs(bot.dx)) ray = bot;
         else ray = top;
      }
      transform.position.x += ray.dx;

      this.life -= dt;
      if (Math.abs(ray.dx) < 0.1 || this.life < 0) {
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

      var objects = this.entity.scene.objects;
      for (var i = 0; i < objects.length; i ++) {
         if (this.entity !== objects[i] && this.entity.transform.testCollision(objects[i].transform)) {
            if (objects[i].getComponent('Destructible')) {
                objects[i].getComponent('Destructible').health -= 30;
                
                this.deathParticles(objects[i].transform.width);
                
                this.entity.dead = true;
                return;
            }
         }
      }
   }
});