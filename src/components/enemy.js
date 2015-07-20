Juicy.Component.create('Enemy', {
   constructor: function() {
      this.direction = 1;

      this.health = 100;
      this.speed = 8;
      this.slow = 0;

      this.doingRecoil = false;
   },
   update: function(dt, input) {
      var speed = this.speed;
      if (this.slow >= 0) {
        this.slow -= dt;
        speed /= 2;
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
   }
});
