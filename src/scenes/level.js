var Level = Juicy.State.extend({
   tilesize: 20,
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics', 'Animations', 'Score']);
      this.gui = new Juicy.Entity(this, ['GUI', 'Animations']);
      this.player.getComponent('Score').setGui(this.gui.getComponent('GUI'));
      var name = 'lol name here'; // set the name from a textbox before the game or some shiiiii
      this.player.getComponent('Score').setName(name);
      this.player.transform.width = 1.4;
      this.player.transform.height = 1.8;

      this.player.getComponent('Box').fillStyle = 'green';

      this.objects = [];
      this.enemies = [];

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
      this.levelTiles = this.tileManager.getComponent('LevelTiles');
      this.levelTiles.build(3, 2);

      var self = this;

      // Create enemies
      for (var i = 0; i < this.levelTiles.spawns.length; i ++) {
         var spawn = this.levelTiles.spawns[i];

         if (spawn.type === 'enemy') {
            var enemy = new Juicy.Entity(this, ['Image', 'Enemy', 'PatrollingPhysics', 'Animations']);
            enemy.getComponent('Image').setImage('./img/deck.png');
            enemy.transform.width = 1.4;
            enemy.transform.position.y = spawn.y;
            enemy.transform.position.x = spawn.x;
            enemy.transform.height = 1.8;
            if (Juicy.rand(2) === 1) {
               enemy.getComponent('Enemy').direction = 1;
            }
            else {
               enemy.getComponent('Enemy').direction = -1;
            }

            this.enemies.push(enemy);
         }
         else if (spawn.type === 'book') {
            var book = new Juicy.Entity(this, ['Image']);
            book.getComponent('Image').setImage('./img/deck.png');
            book.transform.width = 0.75;
            book.transform.height = 1;
            book.transform.position.y = spawn.y;
            book.transform.position.x = spawn.x;

            var power = new Juicy.Components.Powerup(this.player.getComponent('Player').availablePowerups());
            book.addComponent(power);

            this.objects.push(book);
         }
         else if (spawn.type === 'player') {
            this.player.transform.position.x = spawn.x;
            this.player.transform.position.y = spawn.y;
         }
         else if (spawn.type === 'shrine') {
            var shrine = new Juicy.Entity(this, ['Sprite']);
            shrine.getComponent('Sprite').setSheet('./img/shrine.png', 256, 512);
            shrine.transform.width = 3;
            shrine.transform.height = 6;
            shrine.transform.position.y = spawn.y - 1.85;
            shrine.transform.position.x = spawn.x - 1;

            var destructible = new Juicy.Components.Destructible(1000);
            destructible.ondestroy = function() {
               self.slow = true;
               self.flash = 1;
               shrine.getComponent('Sprite').runAnimation(1, 3, 0.5)
                  .oncompleteanimation = function() {};
            }
            shrine.addComponent(destructible);

            this.objects.push(shrine);
         }
         else {
            console.warn(spawn);
         }
      }

      // Create books
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
      if (!this.levelTiles.imagesLoaded()) {
         return;
      }
      if (this.slow)
         dt /= 3;

      if (this.flash) {
         this.flash -= dt;
      }

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
      if (this.camera.x * this.tilesize + GAME_WIDTH > this.levelTiles.width * this.tilesize) {
         this.camera.dx = 0;
         this.camera.x = this.levelTiles.width - GAME_WIDTH / this.tilesize;
      }
      if (this.camera.y < 0)
         this.camera.dy = this.camera.y = 0;
      if (this.camera.y * this.tilesize + GAME_HEIGHT > this.levelTiles.height * this.tilesize) {
         this.camera.dy = 0;
         this.camera.y = this.levelTiles.height - GAME_HEIGHT / this.tilesize;
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

         var enemy = new Juicy.Entity(this, ['Box', 'Enemy', 'PatrollingPhysics', 'Animations']);
         enemy.getComponent('Box').fillStyle = 'red';
         enemy.transform.width = 1.4;
         enemy.transform.position.y = 10;
         enemy.transform.position.x = 30;
         enemy.transform.height = 1.8;
         if (Juicy.rand(2) === 1) {
            enemy.getComponent('Enemy').direction = 1;
         }
         else {
            enemy.getComponent('Enemy').direction = -1;
         }
         this.enemies.push(enemy);
      }

      return this.paused;
   },
   render: function(context) {
      if (!this.levelTiles.imagesLoaded()) {
         return;
      }
      context.save();
      var sc = this.tilesize;
      context.scale(sc, sc);
      context.translate(-this.camera.x, -this.camera.y);

      var bounds = {
         position: {
            x: this.camera.x,
            y: this.camera.y
         },
         width: GAME_WIDTH / this.tilesize,
         height: GAME_HEIGHT / this.tilesize
      };

      this.tileManager.render(context, bounds.position.x, bounds.position.y, bounds.width, bounds.height);

      for (var i = 0; i < this.objects.length; i ++) {
         if (this.objects[i].transform.testCollision(bounds)) {
            this.objects[i].render(context);
         }
      }

      for (var i = 0; i < this.enemies.length; i ++) {
         if (this.enemies[i].transform.testCollision(bounds)) {
            this.enemies[i].render(context);
         }
      }

      this.player.render(context);

      this.particles.render(context);

      context.restore();
      
      this.gui.render(context);
      
      if (this.flash) {
         context.fillStyle = 'rgba(255, 255, 255, ' + this.flash + ')';
         context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }
   }
});
