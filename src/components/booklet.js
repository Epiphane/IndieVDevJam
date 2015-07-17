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
         var enemy = enemies[i].transform;
      
         var isLeft  = enemy.position.x >= transform.position.x + transform.width;
         var isRight = enemy.position.x + enemy.width <= transform.position.x;
         var isAbove = enemy.position.y >= transform.position.y + transform.height;
         var isBelow = enemy.position.y + enemy.height <= transform.position.y;

         if (!isLeft && !isRight && !isAbove && !isBelow) {
            enemies[i].getComponent('Enemy').health -= 30;

            this.entity.dead = true;
            return;
         }
      }

      var obstacles = this.entity.scene.obstacles;
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].transform;
      
         var isLeft  = obstacle.position.x >= transform.position.x + transform.width;
         var isRight = obstacle.position.x + obstacle.width <= transform.position.x;
         var isAbove = obstacle.position.y >= transform.position.y + transform.height;
         var isBelow = obstacle.position.y + obstacle.height <= transform.position.y;

         if (!isLeft && !isRight && !isAbove && !isBelow) {
            this.entity.dead = true;
            return;
         }
      }
   }
});