Juicy.Component.create('Booklet', {
   constructor: function() {
      this.dx = 0;
      this.life = 2;
   },
   update: function(dt, input) {
      var transform = this.entity.transform;
      transform.position.x += this.dx;
   
      this.life -= dt;
      if (this.life < 0) {
         this.entity.dead = true;
         return;
      }

      var enemies = this.entity.scene.enemies;
      for (var i = 0; i < enemies.length; i ++) {
         if (this.entity.transform.testCollision(enemies[i].transform)) {
            enemies[i].getComponent('Enemy').health -= 30;

            this.entity.dead = true;
            return;
         }
      }

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         if (this.entity.transform.testCollision(obstacles[i].transform)) {
            this.entity.dead = true;
            return;
         }
      }
   }
});