var Level = Juicy.State.extend({
   tilesize: 20,
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics', 'Animations']);
      this.player.transform.width = 1.4;
      this.player.transform.height = 1.8;

      this.player.getComponent('Box').fillStyle = 'green';

      this.obstacles = [];

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

      this.tileManager = new Juicy.Entity(this, ['LevelTiles']);
      this.tileManager.getComponent('LevelTiles').build(3, 2);

      this.player.transform.position.x = this.tileManager.getComponent('LevelTiles').SECTION_WIDTH / 2;
      this.player.transform.position.y = 1;
   },
   init: function() {
      var self = this;
      this.game.input.on('key', 'ESC', function() {
         self.game.setState(new Pause(self));
      });
      // this.game.input.on('key', 'A', function() {
      //    self.paused = false
      // });
   },
   addObject: function(obj) {
      this.objects.push(obj);
   },
   update: function(dt, input) {
      // if (this.paused)
      //    return;

      // this.paused = true;

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

      // this.spawnCooldown -= dt;
      // if (this.spawnCooldown <= 0) {
      //    this.spawnCooldown = this.spawnTime;

      //    var enemy = new Juicy.Entity(this, ['Box', 'Enemy', 'Physics', 'Animations']);
      //    enemy.getComponent('Box').fillStyle = 'red';
      //    enemy.transform.width = 1.4;
      //    enemy.transform.height = 1.8;
      //    if (Juicy.rand(2) === 1) {
      //       enemy.getComponent('Enemy').direction = 1;
      //    }
      //    else {
      //       enemy.getComponent('Enemy').direction = -1;
      //       enemy.transform.position.x = this.width - enemy.transform.width;
      //    }
      //    this.enemies.push(enemy);
      // }

      return this.paused;
   },
   render: function(context) {
      context.save();
      var sc = this.tilesize;
      context.scale(sc, sc);
      context.translate(-this.camera.x, -this.camera.y);

      this.tileManager.render(context, this.camera.x, this.camera.y, GAME_WIDTH / this.tilesize, GAME_HEIGHT / this.tilesize);

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
   }
});
