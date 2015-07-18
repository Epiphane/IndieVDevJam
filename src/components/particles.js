Juicy.Component.create('ParticleManager', {
   constructor: function() {
      this.pendingParticles = Array();
      this.particles = Array();
   },

   spawnParticles: function(where, image, howMany, timeToLive, initParticle, updateParticle) {
      this.howMany = howMany;
      this.updateFunction = updateParticle;

      for (var i = 0; i < this.howMany; i++) {
         var newParticle = {
            life: 30,
            init: initParticle,
         };
         this.pendingParticles.push(newParticle);
         this.newParticle.timeToLive = timeToLive(newParticle, i);
      }
   },

   initParticle: function(currParticle) {
          
      this.particles.push(newParticle);
   },

   update: function(dt, input) {
      for (var i = this.pendingParticles.length - 1; i >= 0; i--) {
          var currParticle = this.pendingParticles[i];
          if (currParticle.timeToLive < 0) {
              this.initParticle(currParticle, i);
              this.pendingParticles.splice(i, 1);
          }
      }

      for (var i = this.particles.length - 1; i >= 0; i--) {
         if (this.particles[i]) {
            this.updateFunction(this.particles[i], i);
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
         context.fillStyle = "rgba(100, 200, 200, " + this.particles[i].alpha + ")"; 
         context.fill();
      }
   },
});
