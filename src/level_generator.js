function LevelGenerator(sections_horiz, sections_vert) {
   this.levelsUsed = [];
}

LevelGenerator.prototype.SECTION_HEIGHT = 30;
LevelGenerator.prototype.SECTION_WIDTH = 40;
LevelGenerator.prototype.SPAWN = 0;
LevelGenerator.prototype.GOAL = 1;
LevelGenerator.prototype.ANY = 2;

LevelGenerator.prototype.EMPTY = '.';
LevelGenerator.prototype.PLATFORM = '-';
LevelGenerator.prototype.WALL = 'X';

LevelGenerator.prototype.createSection = function(level, type, i, j, leftWall, rightWall, bottomWall) {
   var config = this.sections.room;

   if (type === this.SPAWN)
      config = this.sections.spawn;

   arguments[1] = config;

   this.build.apply(this, arguments);
};

LevelGenerator.prototype.build = function(level, config, i, j, leftWall, rightWall, bottomWall) {
   if (config.length !== this.SECTION_HEIGHT * this.SECTION_WIDTH)
      throw "Section length is " + config.length;

   var min_x = i * this.SECTION_WIDTH;
   var min_y = j * this.SECTION_HEIGHT;

   var currentPlatform = false;
   for (var c = 0; c < this.SECTION_HEIGHT * this.SECTION_WIDTH; c ++) {
      var tile = config[c];
      var x = c % this.SECTION_WIDTH;
      var y = Math.floor(c / this.SECTION_WIDTH);

      if (leftWall && x === 0 || rightWall && x === this.SECTION_WIDTH - 1)
         tile = this.PLATFORM;

      if (bottomWall && y === this.SECTION_HEIGHT - 1)
         tile = this.PLATFORM;

      // Place the last platform if possible
      if (currentPlatform && (tile !== this.PLATFORM || min_y + y !== currentPlatform.y)) {
         level.addPlatform(currentPlatform.x, currentPlatform.y, currentPlatform.w, 1);

         currentPlatform = false;
      }

      if (tile === this.PLATFORM) {
         // Create or add to a platform
         if (currentPlatform)
            currentPlatform.w ++;
         else {
            currentPlatform = {
               x: min_x + x,
               y: min_y + y,
               w: 1
            };
         }
      }
   }

   if (currentPlatform) {
      level.addPlatform(currentPlatform.x, currentPlatform.y, currentPlatform.w, 1);
   }

   if (leftWall) {
      level.addPlatform(min_x, min_y, 1, this.SECTION_HEIGHT);
   }

   if (rightWall) {
      level.addPlatform(min_x + this.SECTION_WIDTH - 1, min_y, 1, this.SECTION_HEIGHT);
   }
};

// Each section is a 2D array of objects (or space)
LevelGenerator.prototype.sections = {};

LevelGenerator.prototype.sections.spawn 
   = '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '-----------------      -----------------'
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '               ----------               '
   + '                                        '
   + '------------                ------------'
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '--------------            --------------'
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '                                        '
   + '----------------------------------------';

LevelGenerator.prototype.sections.room
   = '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '               -    ' + '    -               '
   + '               -    ' + '    -               '

   + '               -    ' + '    -               '
   + '               -----' + '-----               '
   + '                    ' + '        ------      '
   + '                    ' + '             -      '
   + '                    ' + '             -      '
   + '               -----' + '----         -      '
   + '                    ' + '             ------ '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    '
   + '                    ' + '                    ';