
Juicy.Component.create('Physics', {
   constructor: function() {
      this.bounding = new SAT.Box(new SAT.Vector(0, 0), 0, 0);
   
      this.dx = this.dy = 0;
   },
   update: function(dt, input) {
      this.dy += 100 * dt;

      this.entity.transform.position.y += this.dy * dt;

      this.bounding.pos.x = this.entity.transform.position.x;
      this.bounding.pos.y = this.entity.transform.position.y;
      this.bounding.w = this.entity.transform.width;
      this.bounding.h = this.entity.transform.height;

      var me = this.bounding.toPolygon();

      var obstacles = this.entity.scene.obstacles;
      var collision = new SAT.Response();
      for (var i = 0; i < obstacles.length; i ++) {
         var obstacle = obstacles[i].getComponent('Obstacle').bounding;

         if (SAT.testPolygonPolygon(me, obstacle.toPolygon(), collision)) {
            this.bounding.pos.x += collision.overlapV.x;
            this.bounding.pos.y += collision.overlapV.y;

            if (collision.overlapV.y < 0)
               this.dy = 0;
         }
      }

      this.entity.transform.position.x = this.bounding.pos.x;
      this.entity.transform.position.y = this.bounding.pos.y;
   },
   render: function(context) {
   }
});

Juicy.Component.create('Obstacle', {
   constructor: function() {
      this.bounding = new SAT.Box(new SAT.Vector(0, 0), 0, 0);
   },
   setBounds: function(x, y, w, h) {
      this.bounding.pos.x = this.entity.transform.position.x = x;
      this.bounding.pos.y = this.entity.transform.position.y = y;
      this.bounding.w     = this.entity.transform.width      = w;
      this.bounding.h     = this.entity.transform.height     = h;
   }
});
