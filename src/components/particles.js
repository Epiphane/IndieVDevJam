Juicy.Component.create('Particles', {
   constructor: function() {
   },

   setParticleType: function(image, howMany, updateParticle) {
      this.particleImage = image;
      this.howMany = howMany;
      this.updateFunction = updateParticle;
      this.particles = Array();
      this.image = new Image();
      this.image.src = ""
   },

   startParticles: function() {
      for (var i = 0; i < this.howMany; i++) {
         this.particles.push({
            x: 0,
            y: 0,
            life: 60   
         });
      }
   },

   update: function(dt, input) {
      for (var i = this.particles.length - 1; i >= 0; i--) {
         if (this.particles[i]) {
            this.updateFunction(this.particles[i]);
            if (this.particles[i].life < 0) {
               this.particles = Array();
            }
         }
      }
   },

   render: function(context) {
      for (var i = 0; i < this.particles.length; i++) {
         context.beginPath();
         context.rect(this.particles[i].x, this.particles[i].y, 0.1, 0.1);
         context.fillStyle = "red"; 
         context.fill();
      }
   },
});
