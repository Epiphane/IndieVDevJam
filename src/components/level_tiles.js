Juicy.Component.create('LevelTiles', {
   SECTION_HEIGHT: 30,
   SECTION_WIDTH: 40,
   SPAWN: 0,
   GOAL: 1,
   ANY: 2,
   EMPTY: ' ',
   PLATFORM: '-',
   WALL: 'X',
   ENEMYSPAWN: 'E',
   BOOK: '%',
   PLAYER: '^',
   SHRINE: '&',
   SPIKE: 'M',
   HEART: 'H',
   SPAWNABLE: /%|E|H|\^|&/,
   constructor: function() {
      this.loadImages();
   },
   
   imagesLoaded: function() {
      if(
         this.tile1rdy &&
         this.tile2rdy &&
         this.bgRdy &&
         this.spikeRdy &&
         this.heartRdy
      ) {
         return true;
      }
      
      return false;
   },
   
   getTile: function(x, y) {
      var sector_x = Math.floor(x / this.SECTION_WIDTH);
      var sector_y = Math.floor(y / this.SECTION_HEIGHT);

      var config = this.tiles[sector_x][sector_y];
      var tile_x = x % this.SECTION_WIDTH;
      var tile_y = y % this.SECTION_HEIGHT;

      return config[tile_x + tile_y * this.SECTION_WIDTH];
   },
   isTileBlocking: function(x, y) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
      return this.getTile(x, y) !== this.EMPTY && this.getTile(x, y) !== this.SPIKE;
   },
   getObstacles: function(x, y, w, h) {
      var obstacles = [];

      x = Math.floor(x);
      y = Math.floor(y);
      w = Math.ceil(w);
      h = Math.ceil(h);

      for (var i = x; i < x + w; i ++) {
         for (var j = y; j < y + h; j ++) {
            if (!this.isTileBlocking(i, j))
               continue;

            obstacles.push({
               position: {
                  x: i,
                  y: j
               },
               width: 1,
               height: 1
            });
         }
      }

      return obstacles;
   },
   canMove: function(x, y, dx, dy) {
      return !this.isTileBlocking(Math.floor(x + dx), Math.floor(y + dy));
   },
   raycast: function(x, y, dx, dy) {
      var total_dist = Math.sqrt(dx * dx + dy * dy);

      var _y = y;
      var _x = x;

      var PAD = 0.1;
      var hit_y = false, hit_x = false;

      if (dy !== 0) { // Vertical
         var dist = Math.abs(dy);
         var step_dy = dy / dist;
         while (dist > 0 && this.canMove(x, y, 0, step_dy)) {
            y += step_dy;
            dist --;
         }

         if (dist < 0) {
            // Went too far. Backtrack!
            if (dy > 0)
               y += dist;
            else
               y -= dist;
         }
         else {
            // Hit a block oh no...
            if (step_dy > 0) 
               y = Math.ceil(y) - 0.1;
            else
               y = Math.floor(y) + 0.1;

            hit_y = true;
         }
      }

      if (dx !== 0) {
         var dist = Math.abs(dx);
         var step_dx = dx / dist;
         while (dist > 0 && this.canMove(x, y, step_dx, 0)) {
            x += step_dx;
            dist --;
         }

         if (dist < 0) {
            // Went too far. Backtrack!
            if (dx > 0)
               x += dist;
            else
               x -= dist;
         }
         else {
            // Hit a block oh no...
            if (step_dx > 0)
               x = Math.ceil(x) - 0.1;
            else
               x = Math.floor(x) + 0.1;

            hit_x = true;
         }
      }

      var dx = x - _x;
      var dy = y - _y;
      dist = Math.sqrt(dx * dx + dy * dy);

      return {
         dx: dx, 
         dy: dy,
         hit: { y: hit_y, x: hit_x },
         dist: total_dist - dist
      };
   },
   render: function(context, x, y, w, h) {
      context.drawImage(this.imageCanvas, 0, 0, this.width, this.height);
   },
   build: function(width, height) {
      var limitedUses = {
         spawn: 1,
         treasure: 1,
         goal: 0
      };

      this.tiles = []; // Array of room configurations
      this.width = width * this.SECTION_WIDTH;
      this.height = height * this.SECTION_HEIGHT;
      
      this.imageCanvas.width = this.width * 20;
      this.imageCanvas.height = this.height * 20;

      this.spawns = [];

      for (var i = 0; i < width; i ++) {
         this.tiles.push([]);

         for (var j = 0; j < height; j ++) {
            var type = 'spawn';
            if (i > 0 || j > 0) {
               var keys = Object.keys(this.sections);

               while (limitedUses[type] === 0) {
                  type = keys[Juicy.rand(keys.length)];                  
               }
            }
            if (i === width - 1 && j === height - 1) {
               type = 'goal';
            }

            var config = this.sections[type];
            var cfg = this.parse(config, i === 0, i === width - 1, j === height - 1);

            // Get spawns
            var spawn = config.search(this.SPAWNABLE);
            var found = spawn;
            while (found >= 0) {
               var x = i * this.SECTION_WIDTH + spawn % this.SECTION_WIDTH;
               var y = j * this.SECTION_HEIGHT + Math.floor(spawn / this.SECTION_WIDTH);

               var sptype = '';
               if (cfg[spawn] === this.ENEMYSPAWN)
                  sptype = 'enemy';
               if (cfg[spawn] === this.BOOK)
                  sptype = 'book';
               if (cfg[spawn] === this.PLAYER)
                  sptype = 'player';
               if (cfg[spawn] === this.SHRINE)
                  sptype = 'shrine';
               if (cfg[spawn] === this.HEART)
                  sptype = 'heart';

               this.spawns.push({
                  type: sptype,
                  x: x,
                  y: y 
               });

               cfg[spawn] = this.EMPTY;
               found = config.substring(spawn + 1).search(this.SPAWNABLE);
               spawn += found + 1;
            }

            // Register that we've used this type of room
            if (limitedUses[type]) {
               limitedUses[type] --;
            }

            this.tiles[i].push(cfg);
         }
      }
   },
   
   renderCanvas: function() {
      if(!this.imagesLoaded()) {
         return;
      }
      
      var context = this.imageCanvas.getContext('2d');
      
      // background image!
      context.drawImage(this.bg, 0, 0);
      
      // tiles!
      
      x = 0;
      y = 0;
      w = 40;
      h = 30;

      for (var i = x; i < this.width; i ++) {
         for (var j = y; j < this.height; j ++) {
            switch (this.getTile(i, j)) {
               case this.PLATFORM:
                  this.renderNormalTile(context, i * 20, j * 20, 20, 20);
                  break;
               case this.WALL:
                  this.renderNormalTile(context, i * 20, j * 20, 20, 20);
                  break;
               case this.SPIKE:
                  this.renderSpike(context, i * 20, j * 20, 20, 20);
                  break;
               case this.HEART:
                  this.renderHeart(context, i * 20, j * 20, 20, 20);
                  break;
            }
         }
      }
   },
   
   renderNormalTile: function(context, x, y, width, height) {
      var rand = Math.floor((Math.random() * 9) + 1);
      var img;
      switch (rand) {
         case 1: 
            img = this.tileImg2;
            break;
         default:
            img = this.tileImg;
            break;
      }
      context.drawImage(img, x, y, width, height);
   },
   
   renderSpike: function(context, x, y, width, height) {
      context.drawImage(this.spikeImg, x, y, width, height);
   },
   
   renderHeart: function(context, x, y, width, height) {
      context.drawImage(this.heartImg, x, y, width, height);
   },
   
   parse: function(config, leftWall, rightWall, bottomWall) {
      if (config.length !== this.SECTION_HEIGHT * this.SECTION_WIDTH)
         throw "Section length is not the right size.";

      var cfg = config.split('');

      if (bottomWall)
         for (var i = (this.SECTION_HEIGHT - 1) * this.SECTION_WIDTH; i < cfg.length; i ++)
            cfg[i] = this.PLATFORM;

      if (leftWall)
         for (var i = 0; i < cfg.length; i += this.SECTION_WIDTH)
            cfg[i] = this.WALL;

      if (rightWall)
         for (var i = this.SECTION_WIDTH - 1; i < cfg.length; i += this.SECTION_WIDTH)
            cfg[i] = this.WALL;

      return cfg;
   },
   sections: {
      spawn: '----------------------------------------'
           + '---------------------                   '
           + '--------------                          '
           + '------------                            '
           + '------------                            '
           + '--      ---                             '
           + '-   ^                                   '
           + '-                              %        '
           + '-            ----      -----------------'
           + '--      ----                            '
           + '--------- -                             '
           + '--------                                '
           + '----------                              '
           + '----------        H                     '
           + '--  -------    ----------        E    E '
           + '--- -------                             '
           + '---- -------                ------------'
           + '-----------                             '
           + '------ ---                              '
           + '-----------                             '
           + '--  ------M                             '
           + '-- --------                    E E      '
           + '------ ------M                          '
           + '-----  -------            --------------'
           + '----------                              '
           + '                                        '
           + '                                        '
           + '                                        '
           + '--------     MMMM                       '
           + '-----      --------                     ',
      treasure: 'X-------------------' + '---------------     '
              + 'X                  -' + '        ------X     '
              + 'X                  -' + '          --- X     '
              + '          H        -' + '              X     '
              + '          --       -' + '             -X     '
              + '          --       -' + '              X     '
              + '                   -' + '              X     '
              + '                   -' + '              X     '
              + 'XXXX              - ' + '              XXXXXX'
              + 'X                -  ' + '    -------        X'
              + 'X               -   ' + '    -              X'
              + 'X               -   ' + '    -              X'
              + 'X               -   ' + '    -              X'
              + 'X               -   ' + '    -              X'
              + 'X     %         -   ' + '%   -              X'
              + 'X    --         -  ' + '     -              X'
              + 'X                ---' + '-----              X'
              + 'X                   ' + '               -   X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '          -        X'
              + 'X        M          ' + '                   X'
              + 'X      -----     -  ' + '   --              X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '                    '
              + 'X                   ' + '                    '
              + 'X                   ' + '                    '
              + 'X M     HHH       M ' + '                    '
              + 'X-------------------' + '-------------------X',
      room0:    '-----               ' + '                    '
              + '-----               ' + '                    '
              + '---            %    ' + '                    '
              + '--          --------' + '----                '
              + '---                 ' + '                    '
              + '--                  ' + '                    '
              + '---                 ' + '        -------     '
              + ' --                 ' + 'E     ---      -    '
              + '- ------            ' + '     ---   H   -  --'
              + '--  %  -----     ---' + '---------------    -'
              + '------        EEEE  ' + '   E                '
              + '--                  ' + '                    '
              + '--          --------' + '--------            '
              + '--                  ' + '        ------------'
              + '-----               ' + '          ----------'
  
              + '- -- -          E  E' + 'E               ----'
              + '-----               ' + '            -------'
              + ' --          -------' + '----       ----  -- '
              + '---           ------' + '--          --- ----'
              + '- -           E    E' + '              ----- '
              + '---                 ' + '               --- -'
              + '--------------------' + '----          ------'
              + '---    ----  -------' + '-               ----'
              + '------ ---- -       ' + '      -----    ---- '
              + '                    ' + '              - ----'
              + '                    ' + '              -  ---'
              + '               -----' + '------              '
              + '                    ' + '                    '
              + '                    ' + '                    '
              + '       ------       ' + '        ------      ',
      room1:    '-----               ' + '                    '
              + '-----               ' + '                    '
              + '---                 ' + '                    '
              + '--          --------' + '----                '
              + '---                 ' + '                    '
              + '--                  ' + '                    '
              + '----                ' + '        -------     '
              + ' -----              ' + 'E     ----------    '
              + '- ------            ' + '     -----------  --'
              + '--               ---' + '---------------    -'
              + '--            ----- ' + '                    '
              + '                    ' + '                    '
              + '                    ' + '                    '
              + '--                  ' + '        ------------'
              + '-----               ' + '          ----------'
  
              + '- -- -         -----' + '                ----'
              + '-----         ------' + '--            ------'
              + ' --          -------' + '----       ----  -- '
              + '---                 ' + '            --- ----'
              + '- -           E    E' + '              ----- '
              + '---                 ' + '    -          --- -'
              + '--          --------' + '----          ------'
              + '---          -------' + '-               ----'
              + '------              ' + '               ---- '
              + '                    ' + '              - ----'
              + '                    ' + '              -  ---'
              + '               -----' + '------              '
              + '           ----     ' + '                    '
              + '         ------     ' + '                    '
              + '       -------      ' + '                    ',
      room2:    '-----               ' + '                    '
              + '--                  ' + '          E  E  E  -'
              + '--          M       ' + '     M             -'
              + '--         ---------' + '---------        ---'
              + '--                  ' + '               -----'
              + '--     --           ' + '             -------'
              + '--                  ' + '           ---------'
              + '---------         E ' + 'E  E  E  -----------'
              + '------              ' + '         ----      -'
              + '--               ---' + '-------------    % -'
              + '--             -----' + ' -- - - -- -    ----'
              + '                    ' + '                    '
              + '          -----     ' + '               M    '
              + '--  M   M           ' + '        ------------'
              + '--------------------' + '     ---------------'
  
              + '- -- -         -----' + '                ----'
              + '-----         ------' + '--            ------'
              + ' --          -------' + '----       ----  -- '
              + '---                 ' + '            --- ----'
              + '- -           E    E' + '  E           ----- '
              + '---                 ' + '    -          --- -'
              + '--          --------' + '----          ------'
              + '---          -------' + '-               ----'
              + '------              ' + '               ---- '
              + '                    ' + '              - ----'
              + '                 E  ' + ' M  E         -  ---'
              + '            M  -----' + '------              '
              + '           ----     ' + '                    '
              + '         ------     ' + '                    '
              + '       -------      ' + '                    ',
      goal:     '                    ' + '                    '
              + '                    ' + '                    '
              + '                    ' + '                    '
              + '                    ' + '                    '
              + '-              E  E ' + '  E E E E           '
              + '                    ' + '                    '
              + '         -----------' + '-----------         '
              + '      ---------   --' + '-------             '
              + '-                   ' + '-                   '
              + '--                  ' + '                    '
              + '------              ' + '                    '
              + '-------------       ' + '                    '
              + ' -------            ' + '                    '
              + '                 ---' + '------              '
              + '                    ' + '                    '

              + '                    ' + '                    '
              + '                    ' + '                    '
              + '            -----   ' + '   -----            '
              + '           -        ' + '        -           '
              + '          -         ' + '&        -          '
              + '           -        ' + '        -           '
              + '            ----    ' + '    ----            '
              + '                    ' + '                    '
              + '                   -' + '--                  '
              + '                  --' + '---                 '
              + '                  --' + '---                 '
              + '  XXX            ---' + '----         XXX    '
              + '  XXX    E      ----' + '-----    E   XXX    '
              + '  XXX         ------' + '------       XXX    '
              + '--------------------' + '--------------------'
   },
   
   // hidden down here so you dont have to see my sloppy code :)
   loadImages: function() {
      var self = this;
      
      this.tileImg = new Image();
      this.tileImg.src = 'img/tile.png';
      this.tileImg.onload = function() {
         self.tile1rdy = true;
         self.renderCanvas();
      }
      
      this.tileImg2 = new Image();
      this.tileImg2.src = 'img/tile2.png';
      this.tileImg2.onload = function() {
         self.tile2rdy = true;
         self.renderCanvas();
      };
      
      this.bg = new Image();
      this.bg.src = 'img/bg.png';
      this.bg.onload = function() {
         self.bgRdy = true;
         self.renderCanvas();
      }
      
      this.spikeImg = new Image();
      this.spikeImg.src = 'img/spike.png';
      this.spikeImg.onload = function() {
         self.spikeRdy = true;
         self.renderCanvas();
      }
      
      this.heartImg = new Image();
      this.heartImg.src = 'img/heart.png';
      this.heartImg.onload = function() {
         self.heartRdy = true;
         self.renderCanvas();
      }
      
      this.imageCanvas = document.createElement('canvas');
   }
});
