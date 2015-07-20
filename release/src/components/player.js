Juicy.Component.create('Player', {
   constructor: function() {
      this.direction = 1;
      this.firingRate = 0.1;
      this.cooldown = 0;
      this.doingRecoil = false;
      this.invincible = 0;
      this.jumpSound = newBuzzSound( "audio/fx_jump", {
         formats: [ "wav"]
      });
      this.hitSound = newBuzzSound( "audio/fx_playerdmg", {
         formats: [ "wav"]
      });
      this.powerupSound = newBuzzSound( "audio/fx_powerup", {
         formats: [ "wav"]
      });

      this.powerups = {};

      this.health = 4;
      this.maxhealth = 4;

      this.speed = 15;
      this.damage = 30;
   },
   takeDamage: function(damage) {
      damage = damage || 0.5;

      this.health -= damage;
      this.invincible = 2;

      if (this.health <= 0) {
         this.entity.dead = true;
      }

      this.updateGUI();
   },
   updateGUI: function() {
      var bars = [];
      var powers = Object.keys(this.powerups);
      for (var i = 0; i < powers.length; i ++) {
         bars.push({
            color: Powerup.colors[powers[i]],
            mana: this.powerups[powers[i]]
         });
      }

      this.entity.scene.gui.getComponent('GUI').setPowerBars(bars, Powerup.getColor(powers));
      this.entity.scene.gui.getComponent('GUI').setHealth(this.health, this.maxhealth);
   },
   setPowerup: function(name, mana) {
      if (this.powerups[name] && this.powerups[name] >= mana) {
         return;
      }
      else {
         this.powerups[name] = mana;
      }

      this.updateGUI();
   },
   throwBook: function() {
      var booklet = new Booklet(this.entity.scene);
      booklet.transform.position.x = this.entity.transform.position.x;
      booklet.transform.position.y = this.entity.transform.position.y + 0.1;

      var powers = Object.keys(this.powerups);
      for (var i = 0; i < powers.length; i ++) {
         this.powerups[powers[i]] --;
         if (this.powerups[powers[i]] <= 0)
            delete this.powerups[powers[i]];
      }

      var comp = booklet.getComponent('Booklet');
      comp.damage = this.damage;
      comp.dx = this.direction * 100;
      comp.setPowers(powers);

      this.entity.scene.addObject(booklet);

      this.updateGUI();
   },
   update: function(dt, input) {
      var speed = this.speed;

      var physics = this.entity.getComponent('Physics');
      if (!physics)
         return;
      
      physics.dy += 240 * dt;

      if (!this.doingRecoil)
      {
         physics.dx = 0;
         if (input.keyDown('UP')) {
            if (physics.onGround) {
               this.jumpSound.play();
            }
            physics.jump();
         }
         if (input.keyDown('LEFT')) {
            physics.dx = -speed;
            this.entity.getComponent('Sprite').flipped = false;
         }  
         if (input.keyDown('RIGHT')) {
            physics.dx = speed;
            this.entity.getComponent('Sprite').flipped = true;
         }
         
         if (physics.dx !== 0)
            this.direction = physics.dx > 0 ? 1 : -1;
      }
      else {
         if (physics.onGround) {
            this.doingRecoil = false;
         }
      }
   
      if (this.cooldown > 0)
         this.cooldown -= dt;
      if (input.keyDown('SPACE') && this.cooldown <= 0) {
         this.throwBook();

         this.cooldown = this.firingRate;

         physics.dx -= this.direction * 2;
      }

      // Test colliding with objects
      var objects = this.entity.scene.objects;
      for (var i = 0; i < objects.length; i ++) {
         var object = objects[i];

         if (this.entity.transform.testCollision(object.transform)) {
            // Collided with this object. Test whether it matters
            var powerup = object.getComponent('Powerup');
            if (powerup) {
               this.setPowerup(powerup.power, this.entity.getComponent('Upgrades').mana);
               this.powerupSound.play();
               objects[i].dead = true;
            }
         }
      }

      if (this.invincible > 0) {
         this.invincible -= dt;
         this.hide = Math.floor(this.invincible * 10) % 2 === 1;
      }
      else {
         if (physics.touchingSpike) {
            this.takeDamage(1);
            this.bounceBack({
               transform: {
                  position: { x: this.entity.transform.position.x - this.direction }
               }
            });
         }
         
         var enemies = this.entity.scene.enemies;
         for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];

            if (this.entity.transform.testCollision(enemy.transform)) {
               // Collided with enemy, have slight bouceback
               this.bounceBack(enemy, this.entity.transform.position.x, 1.0);
               this.hitSound.play();
               this.takeDamage(0.5);

               this.entity.scene.shake();
            }
         }
      }

      this.entity.getComponent('Sprite').advanceAnimation(Math.abs(physics.dx));
   },

   bounceBack: function(sender) {
      var physics = this.entity.getComponent('Physics');
      physics.bounceBack(sender.transform.position.x, this.entity.transform.position.x, 1.0);
      this.doingRecoil = true;
   }
});
