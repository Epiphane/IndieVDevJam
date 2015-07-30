Juicy.Component.create('Enemy', {
   constructor: function() {
      this.direction = 1;

      this.health = 75;
      this.speed = 7;
      this.slow = 0;

      this.doingRecoil = false;
   },
   update: function(dt, input) {
      var speed = this.speed;
      if (this.slow >= 0) {
        this.slow -= dt;
        speed /= 2;
      }

     if (this.poison >= 0) {
            this.health -= 0.4;
            this.poison -= dt;
            if (this.poison < 0) {
                this.unpoison();
            }
        }

      if (this.health <= 0) {
          var scoreComponent =  this.entity.scene.player.getComponent('Score');
          scoreComponent.eventOccurred('killedEnemy');
          var scoreDisplayEntity = new Juicy.Entity(this.entity.scene, ['ScoreDisplay']);
          var scoreDisplayComponent = scoreDisplayEntity.getComponent('ScoreDisplay');
          this.entity.scene.objects.push(scoreDisplayEntity); // lets display those dank points
          scoreDisplayComponent.setText('+' + scoreComponent.events['killedEnemy']);
          scoreDisplayComponent.setPosition(this.entity.transform.position.x, this.entity.transform.position.y, false);
          
          this.entity.dead = true;

         this.entity.scene.player.getComponent('Player').killedEnemy();

         var self = this;
         
         self.entity.scene.particles.getComponent('ParticleManager').spawnParticles("255, 0, 0, ", 0.5, 50, function(particle, ndx) {
               return Math.random() * 2;
         },
         function(particle) {
             particle.x = self.entity.transform.position.x + 0.8 + Math.random();
             particle.y = self.entity.transform.position.y + 0.4 + Math.random();
             particle.dx = Math.random() * 16 - 8;
             particle.dy = -21 + Math.random()*20;
             particle.startLife = 100;
             particle.life = particle.startLife;
          }, function(particle) {
             particle.x += particle.dx * 0.03;
             particle.y += particle.dy * 0.03;
             particle.dy += 0.9;

             if (particle.life > particle.startLife) {
                 particle.alpha = 1;
             }
             else {
                 particle.alpha = particle.life / particle.startLife;
             }
          });
      }

      var physics = this.entity.getComponent('PatrollingPhysics');
      if (!physics)
         return;
      physics.dy += 240 * dt;
      if (!this.doingRecoil) {
         physics.dx = speed * this.direction;
      }
      else if (physics.onGround) {
         this.doingRecoil = false;
      }
   },

   bounceBack: function(dx, dy) {
      var physics = this.entity.getComponent('PatrollingPhysics');
      physics.dx = dx * physics.direction;
      physics.dy = dy;
      this.doingRecoil = true;
   },

    poisonMe: function() {
            this.entity.getComponent('Sprite').runAnimation(4,7,0.25,true);
    },

    unpoison: function() {
            this.entity.getComponent('Sprite').runAnimation(0,3,0.25,true);
    },
});
