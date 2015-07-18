var Level = Juicy.State.extend({
   height: 16,
   width: 40,
   tilesize: 48,
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics', 'Particles', 'Animations']);
      this.player.transform.width = 0.7;
      this.player.transform.height = 0.9;
      this.player.getComponent('Box').fillStyle = 'green';

      this.player.getComponent('Particles').setParticleType("butts", 5, function(particle) {
         particle.life--;
         particle.x += Math.random() - 0.5;
         particle.y += Math.random();
      });

      this.obstacles = [];
      this.buildLevel();

      this.objects = [];

      this.enemies = [];
      this.spawnTime = 2;
      this.spawnCooldown = 2;
      this.waveTime = 10;
      this.waveCooldown = 10;

      // Positive = move down or right
      this.camera = {
         x: 1,
         y: 1,
         give_x: 4,
         give_y: 0,
         dx: 0,
         dy: 0
      }
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
      this.player.update(dt);

      var player_input = this.player.getComponent('Player');

      var screen_w = GAME_WIDTH / this.tilesize;
      var dx = (this.player.transform.position.x + player_input.direction * this.camera.give_x - screen_w / 2) - this.camera.x;

      this.camera.x += dx * 2 * dt;
      this.camera.y = this.player.transform.position.y;
      if (this.camera.x < 0) 
         this.camera.dx = this.camera.x = 0;
      if (this.camera.x * this.tilesize + GAME_WIDTH > this.width * this.tilesize) {
         this.camera.dx = 0;
         this.camera.x = this.width - GAME_WIDTH / this.tilesize;
      }
      if (this.camera.y < 0)
         this.camera.dy = this.camera.y = 0;
      if (this.camera.y * this.tilesize + GAME_HEIGHT > this.height * this.tilesize) {
         this.camera.dy = 0;
         this.camera.y = this.height - GAME_HEIGHT / this.tilesize;
      }

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

         var enemy = new Juicy.Entity(this, ['Box', 'Enemy', 'Physics', 'Animations']);
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
      var sc = this.tilesize;
      context.scale(sc, sc);
      context.translate(-this.camera.x, -this.camera.y);

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
      var platformw = 12;
      this.addPlatform(-1, this.height - 4, platformw, platformh);
      this.addPlatform(this.width - platformw + 1, this.height - 4, platformw, platformh);

      platformw = 10;
      this.addPlatform(-1, this.height - 7, platformw, platformh);
      this.addPlatform(this.width - platformw + 1, this.height - 7, platformw, platformh);

      // Middle
      platformw = 16;      
      this.addPlatform((this.width - platformw) / 2, this.height - 8, platformw, platformh);

      // Sides
      platformw = 18;  
      this.addPlatform(-1, this.height - 11, platformw, platformh);
      this.addPlatform(this.width - platformw + 1, this.height - 11, platformw, platformh);

      return;
   },
   buildLevel: function() {
      this.height = 16; // Just enough to fill up the level

      this.addPlatforms();
   }
});
