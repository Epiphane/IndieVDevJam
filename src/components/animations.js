function xScaleAnimation(startScale, endScale, duration) {
   return {
      type: "scaleX",
      begin: startScale,
      end:   endScale,
      duration: duration,

      nextAnimation: null,

      currTime: 0
   }
}

function yScaleAnimation(startScale, endScale, duration) {
   return {
      type: "scaleY",
      begin: startScale,
      end:   endScale,
      duration: duration,

      nextAnimation: null,

      currTime: 0
   }
}

function bounceAnimation(startScale, endScale, duration) {
   return {
      type: "bounce",
      begin: startScale,
      end:   endScale,
      duration: duration,

      nextAnimation: null,

      currTime: 0
   }
}

Juicy.Component.create('Animations', {
   constructor: function() {
      this.currAnimations = Array();
      this.scaleX = 1;
      this.scaleY = 1;
   },

   update: function(dt, input) {
      for (var i = this.currAnimations.length - 1; i >= 0; i--) {
	 this.updateAnimation(this.currAnimations[i], dt);
	 if (this.currAnimations[i].done) {
	    var nextAnim = this.currAnimations[i].nextAnimation;

	    this.currAnimations.splice(i, 1);

	    if (nextAnim != null) {
	       this.currAnimations.push(nextAnim);
	    }
	 }
      }
   },

   updateAnimation: function(anim, dt) {
      // Calculate where we are in the animation
      var fraction = anim.currTime / anim.duration;
      var currValue = anim.begin + (anim.end - anim.begin) * fraction;

      if (anim.type == "scaleX") {
	 this.scaleX = currValue;
      } 
      else if (anim.type == "scaleY") {
	 this.scaleY = currValue;
      } 
      else if (anim.type == "bounce") {
	 var timeLeft = anim.duration - anim.currTime;
	 var frequency = ( Math.sin( anim.currTime * 12 * PI) + 1 ) / 2;
	 var amplitude = timeLeft * anim.end;
	 var bounceFactor = frequency * amplitude + anim.begin;
	 this.scaleX = this.scaleY = bounceFactor;
      }

      anim.currTime += dt;
      if (anim.currTime > anim.duration) {
	 anim.done = true;
      }
   },

   currScale: function() {
      return this.currScale;
   },

   render: function(context) {
   },
});
