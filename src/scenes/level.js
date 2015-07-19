var Level = Juicy.State.extend({
   height: 15,
   width: 20,
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics', 'Particles']);
      this.player.transform.width = 0.7;
      this.player.transform.height = 0.9;
      this.player.getComponent('Box').fillStyle = 'green';

      this.player.getComponent('Particles').setParticleType("butts", 5, function(particle) {
         particle.life--;
         particle.x += Math.random() - 0.5;
         particle.y += Math.random();
      });

      this.obstacles = [];
      this.addPlatforms();

      this.objects = [];

      this.enemies = [];
      this.spawnTime = 2;
      this.spawnCooldown = 2;
      this.waveTime = 10;
      this.waveCooldown = 10;
   },
   init: function() {
      var self = this;
      this.game.input.on('key', 'ESC', function() {
         self.game.setState(new Pause(self));
      });
   },
   addObject: function(obj) {
      this.objects.push(obj);
   },
   update: function(dt, input) {
      var original = {
         x: this.player.transform.position.x,
         y: this.player.transform.position.y
      };
      this.player.update(dt);

      for (var i = 0; i < this.objects.length; i ++) {
         this.objects[i].update(dt);
         if (this.objects[i].dead) {
            this.objects.splice(i, 1);
            i --;
         }
      }

      for (var i = 0; i < this.enemies.length; i ++) {
         this.enemies[i].update(dt);
         if (this.enemies[i].dead) {
            this.enemies.splice(i, 1);
            i --;
         }
      }

      this.spawnCooldown -= dt;
      if (this.spawnCooldown <= 0) {
         this.spawnCooldown = this.spawnTime;

         var enemy = new Juicy.Entity(this, ['Box', 'Enemy', 'Physics']);
         enemy.getComponent('Box').fillStyle = 'red';
         enemy.transform.width = 0.7;
         enemy.transform.height = 0.9;
         if (Juicy.rand(2) === 1) {
            enemy.getComponent('Enemy').direction = 1;
         }
         else {
            enemy.getComponent('Enemy').direction = -1;
            enemy.transform.position.x = this.width - enemy.transform.width;
         }
         this.enemies.push(enemy);
      }

      return this.paused;
   },
   render: function(context) {
      context.save();
      var sc = GAME_HEIGHT / this.height;
      context.scale(sc, sc);

      this.player.render(context);

      for (var i = 0; i < this.obstacles.length; i ++) {
         this.obstacles[i].render(context);
      }

      for (var i = 0; i < this.objects.length; i ++) {
         this.objects[i].render(context);
      }

      for (var i = 0; i < this.enemies.length; i ++) {
         this.enemies[i].render(context);
      }

      context.restore();
   },
   addPlatform: function(x, y, w, h) {
      var platform = new Juicy.Entity(this, ['Box']);
          platform.transform.position.x = x;
          platform.transform.position.y = y;
          platform.transform.width = w;
          platform.transform.height = h;

      this.obstacles.push(platform);
   },
   addPlatforms: function() {
      // Base
      this.addPlatform(-1, this.height - 1, this.width + 2, 1);

      var platformh = 0.5;

      // Sides
      var platformw = 7;
      this.addPlatform(-1, 11, platformw, platformh);
      this.addPlatform(this.width - platformw + 1, 11, platformw, platformh);

      platformw = 4;
      this.addPlatform(-1, 8, platformw, platformh);
      this.addPlatform(this.width - platformw + 1, 8, platformw, platformh);

      // Middle
      platformw = 8;      
      this.addPlatform((this.width - platformw) / 2, 7, platformw, platformh);

      // Sides
      platformw = 9;  
      this.addPlatform(-1, 4, platformw, platformh);
      this.addPlatform(this.width - platformw + 1, 4, platformw, platformh);

      return;
   }
});
