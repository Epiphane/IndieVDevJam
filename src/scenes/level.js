var Level = Juicy.State.extend({
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics']);
      this.player.transform.width = 40;
      this.player.transform.height = 40;
      this.player.getComponent('Box').fillStyle = 'green';

      this.obstacles = [];

      var tilesize = GAME_HEIGHT / 16; // 48
      this.addPlatform(0, GAME_HEIGHT - tilesize, GAME_WIDTH, tilesize);

      // Add some random platforms
      var available = [];
      for (var row = 0; row < GAME_HEIGHT / tilesize; row ++) {
         var cells = [];
         for (var c = 0; c < GAME_WIDTH / tilesize; c ++) {
            cells.push(1);
         }
         available.push(cells);
      }

      // Fill bottom row with 0, since you can't spawn platforms there
      for (var c = 0; c < GAME_WIDTH / tilesize; c ++)
         available[available.length - 1][c] = 0;

      var platformy = Juicy.rand(0, available.length - 1);
      for (var platformx = 0; platformx < available[0].length; platformx ++) {
         var platformw = Juicy.rand(2, 6);

         var x = platformx * tilesize;
         var y = platformy * tilesize;
         var w = platformw * tilesize;
         var h = tilesize;

         var avail = true;
         for (var col = platformx; avail && col < platformx + platformw; col ++) {
               if (!available[platformy][col]) {
               avail = false;
            }
         }

         if (avail) {
            this.addPlatform(x, y, w, h);

            for (var col = platformx - 2; avail && col <= platformx + platformw + 1; col ++) {
               for (var row = platformy; avail && row <= platformy; row ++) {
                  if (col < 0 || col >= available[0].length || row < 0 || row > available.length)
                     continue;
            
                  available[row][col] = 0;
               }
            }            
         }

         platformy += Juicy.rand(-6, 7);
         if (platformy < 3) platformy = 3;
         if (platformy >= available.length) platformy = available.length - 1;
      }
   },
   addPlatform: function(x, y, w, h) {
      var platform = new Juicy.Entity(this, ['Box', 'Obstacle']);
          platform.getComponent('Obstacle').setBounds(x, y, w, h);

      this.obstacles.push(platform);
   },
   update: function(dt, input) {
      var original = {
         x: this.player.transform.position.x,
         y: this.player.transform.position.y
      };
      this.player.update(dt);

      return original.x === this.player.transform.position.x
          && original.y === this.player.transform.position.y;
   },
   render: function(context) {
      this.player.render(context);

      for (var i = 0; i < this.obstacles.length; i ++) {
         this.obstacles[i].render(context);
      }
   }
});