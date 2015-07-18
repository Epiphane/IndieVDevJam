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
   SPAWNABLE: /%|E|\^|&/,
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
      return this.getTile(x, y) !== ' ';
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
      x = Math.floor(x);
      y = Math.floor(y);
      w = Math.ceil(w);
      h = Math.ceil(h);

      for (var i = x; i <= x + w && i < this.width; i ++) {
         for (var j = y; j <= y + h && j < this.height; j ++) {
            if (this.getTile(i, j) === this.PLATFORM) {
               context.fillStyle = 'blue';
               context.fillRect(i, j, 1, 1);
            }
            if (this.getTile(i, j) === this.WALL) {
               context.fillStyle = 'green';
               context.fillRect(i, j, 1, 1);
            }
         }
      }
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
           + '-                                       '
           + '-            ----      -----------------'
           + '--      ----                            '
           + '--------- -                             '
           + '--------                                '
           + '----------                              '
           + '----------                              '
           + '--  -------    ----------        E    E '
           + '--- -------                             '
           + '---- -------                ------------'
           + '-----------                             '
           + '------ ---                              '
           + '-----------                             '
           + '--  ------                              '
           + '-- --------                    E E      '
           + '------ ------                           '
           + '-----  -------            --------------'
           + '----------                              '
           + '                                        '
           + '                                        '
           + '                                        '
           + '--------                                '
           + '-----                                   ',
      treasure: 'X-------------------' + '---------------     '
              + 'X                  -' + '        ------X     '
              + 'X                  -' + '          --- X     '
              + '                   -' + '              X     '
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
              + 'X               -   ' + '%   -              X'
  
              + 'X    --         -  ' + '     -              X'
              + 'X                ---' + '-----              X'
              + 'X                   ' + '               -   X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '          -        X'
              + 'X                   ' + '                   X'
              + 'X      -----     -  ' + '   --              X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '                   X'
              + 'X                   ' + '                    '
              + 'X                   ' + '                    '
              + 'X                   ' + '                    '
              + 'X                   ' + '                    '
              + 'X-------------------' + '-------------------X',
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
      goal:     '                    ' + '                    '
              + '                    ' + '                    '
              + '                    ' + '                    '
              + '                    ' + '                    '
              + '               E  E ' + '  E E E E           '
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
   }
});