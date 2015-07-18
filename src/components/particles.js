Juicy.Component.create('ParticleManager', {
   constructor: function() {
      this.particles = Array();
   },

   spawnParticles: function(where, image, howMany, initParticle, updateParticle) {
      this.particleImage = image;
      this.howMany = howMany;
      this.updateFunction = updateParticle;
      
      this.image = new Image();
      this.image.src = ""

      for (var i = 0; i < this.howMany; i++) {
         var newParticle = {
            x: where.x,
            y: where.y,
            life: 30
         };
         
         this.particles.push(newParticle);
         initParticle(newParticle);
      }
   },

   update: function(dt, input) {
      for (var i = this.particles.length - 1; i >= 0; i--) {
         if (this.particles[i]) {
            this.updateFunction(this.particles[i]);
            this.particles[i].life--;

            if (this.particles[i].life < 0) {
               this.particles.splice(i, 1);
            }
         }
      }
   },

   render: function(context) {
      for (var i = 0; i < this.particles.length; i++) {
         context.beginPath();
         context.rect(this.particles[i].x, this.particles[i].y, 0.3, 0.3);
         context.fillStyle = "rgba(100, 200, 200, " + this.particles[i].life/30 + ")"; 
         context.fill();
      }
   },
});
