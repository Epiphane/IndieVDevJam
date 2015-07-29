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
      this.dodgeSound = newBuzzSound( "audio/fx_dodge", {
         formats: [ "wav"]
      });

      this.powerups = {};

      this.health = 4;
      this.maxhealth = 4;

      this.speed = 14;
      this.damage = 30;

      this.bigHurt = false;

      this.auraTime = 0;
      this.roulette = 4;
   },
   takeDamage: function(damage) {
      damage = damage || 0.5;

      this.health -= damage;
      if (this.dodge) {
         if (Math.random() > 0.60) {
            this.health += damage;
            this.dodgeSound.play();
         }
      }

      if (damage >= 0) {
         this.invincible = 2;

         if (this.health <= 0) {
            this.entity.dead = true;
         }
         else if (this.health > 4) {
            this.health = 4;
         }
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

      if (this.rouletteEnabled) {
         this.roulette--;
         if (this.roulette <= 0) {
            var pows = ["ice", "fire", "explosive"];
            this.roulette = 3;
            var randPowerup = pows[Math.floor(Math.random() * pows.length)];
            powers.push(randPowerup);
         }
      }

      var comp = booklet.getComponent('Booklet');

      comp.damage = this.damage * (this.bigHurt ? (4 - this.health)*0.7 : 1);

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

      if (this.aura) {
        var enemies = this.entity.scene.enemies;
        for (var i = 0; i < enemies.length; i ++) {
            if (this.entity.transform.distanceTo(enemies[i].transform) < 10) {
                  console.log(this.entity.transform.distanceTo(enemies[i].transform));

                  enemies[i].getComponent('Enemy').health -= ((15 - this.entity.transform.distanceTo(enemies[i].transform)) * 0.035);
            }
        }
      }
      
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

            var heart = object.getComponent('Heart');
            if (heart && this.health < 4) {
               this.takeDamage(-1);
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
               if (this.stomp) {
                  if (this.entity.transform.position.y < enemies[i].transform.position.y-0.35) {
                     enemies[i].getComponent('Enemy').health = 0;
                  }
                  else {
                     this.takeDamage(0.5);
                     this.hitSound.play();
                     this.entity.scene.shake();
                  }
               }  
               else {
                  this.takeDamage(0.5);
                  this.hitSound.play();
                  this.entity.scene.shake();
               }

               this.bounceBack(enemy, this.entity.transform.position.x, 1.0);
            }
         }
      }

      this.entity.getComponent('Sprite').advanceAnimation(Math.abs(physics.dx));
   },

   render: function(context) {
      if (this.aura) {
         context.beginPath();
         context.arc(this.entity.transform.width/2, this.entity.transform.height/2, this.auraTime, 0, 2 * Math.PI, false);
         context.lineWidth = 5;
         context.strokeStyle = 'rgba(255, 0, 0, ' + (10-this.auraTime)/40 + ')';
         context.stroke();

         this.auraTime += 0.07;

         if (this.auraTime > 10) {
            this.auraTime = 0;
         }
      }
   },

   bounceBack: function(sender) {
      var physics = this.entity.getComponent('Physics');
      physics.bounceBack(sender.transform.position.x, this.entity.transform.position.x, 1.0);
      this.doingRecoil = true;
   }
});
