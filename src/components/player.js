Juicy.Component.create('Player', {
   constructor: function() {
      this.direction = 1;
      this.firingRate = 0.1;
      this.cooldown = 0;

      this.powerups = {};
   },
   availablePowerups: function() {
      return ['fire', 'ice', 'explosive'];
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
      booklet.transform.position.y = this.entity.transform.position.y + (this.entity.transform.height - booklet.transform.height) / 2;

      var powers = Object.keys(this.powerups);
      for (var i = 0; i < powers.length; i ++) {
         this.powerups[powers[i]] --;
         if (this.powerups[powers[i]] <= 0)
            delete this.powerups[powers[i]];
      }

      var comp = booklet.getComponent('Booklet');
      comp.dx = this.direction * 100;
//       comp.setPowers(powers);

      this.entity.scene.addObject(booklet);

      this.updateGUI();
   },
   update: function(dt, input) {
      var speed = 16;

      var physics = this.entity.getComponent('Physics');
      if (!physics)
         return;
      
      physics.dx = 0;
      physics.dy += 240 * dt;

      if (input.keyDown('UP')) {
         physics.jump();
      }
      if (input.keyDown('LEFT')) {
         physics.dx = -speed;
      }
      if (input.keyDown('RIGHT')) {
         physics.dx = speed;
      }

      if (physics.dx !== 0)
         this.direction = physics.dx > 0 ? 1 : -1;
   
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
               this.setPowerup(powerup.power, powerup.mana);

               objects[i].dead = true;
            }
         }
      }
   }
});
