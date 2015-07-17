Juicy.Component.create('Booklet', {
   constructor: function() {
      this.dx = 0;
      this.life = 2;
   },
   update: function(dt, input) {
      this.entity.transform.position.x += this.dx;
   
      this.life -= dt;
      if (this.life < 0)
         this.entity.dead = true;
   }
});