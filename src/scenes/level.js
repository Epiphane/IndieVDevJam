var Level = Juicy.State.extend({
   tilesize: 20,
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics', 'Animations']);
      this.player.transform.width = 1.4;
      this.player.transform.height = 1.8;

      this.player.getComponent('Box').fillStyle = 'green';

      this.obstacles = [];
      this.buildLevel(3, 2);

      this.objects = [];

      this.enemies = [];
      this.spawnTime = 2;
      this.spawnCooldown = 2;
      this.waveTime = 10;
      this.waveCooldown = 10;

      this.particles = new Juicy.Entity(this, ['ParticleManager']);

      // Positive = move down or right
      this.camera = {
         x: this.player.transform.position.x,
         y: this.player.transform.position.y,
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
      this.particles.update(dt);

      var player_input = this.player.getComponent('Player');

      var screen_w = GAME_WIDTH / this.tilesize;
      var screen_h = GAME_HEIGHT / this.tilesize;
      var dx = (this.player.transform.position.x + player_input.direction * this.camera.give_x - screen_w / 2) - this.camera.x;
      var dy = (this.player.transform.position.y - screen_h / 2) - this.camera.y;

      this.camera.x += dx * 4 * dt;
      this.camera.y += dy * 4 * dt;
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
         enemy.transform.width = 1.4;
         enemy.transform.height = 1.8;
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

      this.particles.render(context);

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
   buildLevel: function(width, height) {
      var generator = new LevelGenerator();

      this.width = generator.SECTION_WIDTH * width;
      this.height = generator.SECTION_HEIGHT * height;
      for (var i = 0; i < width; i ++) {
         for (var j = 0; j < height; j ++) {
            var type = generator.ANY;
            if (i === 0 && j === 0)
               type = generator.SPAWN;
            else if (i === width - 1 && j === height - 1)
               type = generator.GOAL;

            generator.createSection(this, type, i, j, i === 0, i === width - 1, j === height - 1);
         }
      }

      this.player.transform.position.x = generator.SECTION_WIDTH / 2;
   }
});
