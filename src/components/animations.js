function xScaleAnimation(startScale, endScale, anchor, duration) {
    return {
        type: "scaleX",
        begin: startScale,
        end: endScale,
        duration: duration,

		/** Scale-specific */
        anchor: anchor,

        nextAnimation: null,

        currTime: 0
    }
}

function yScaleAnimation(startScale, endScale, anchor, duration) {
    return {
        type: "scaleY",
        begin: startScale,
        end: endScale,
        duration: duration,

		/** Scale-specific */
        anchor: anchor,

        nextAnimation: null,

        currTime: 0
    }
}

function bounceAnimation(startScale, endScale, duration) {
    return {
        type: "bounce",
        begin: startScale,
        end: endScale,
        duration: duration,

        nextAnimation: null,

        currTime: 0
    }
}

function rotateAnimation(startRot, endRot, anchorX, anchorY, duration) {
    return {
        type: "rotate",
        begin: startRot,
        end: endRot,
        duration: duration,

		anchorX: anchorX,
		anchorY: anchorY,

        nextAnimation: null,

        currTime: 0
    }
}


Juicy.Component.create('Animations', {
    constructor: function() {
        this.currAnimations = {};

        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleAnchorX = 0.5;
        this.scaleAnchorY = 0;

		this.rotate = 0;
        this.rotateAnchorX = 0;
        this.rotateAnchorY = 0;
    },

    update: function(dt, input) {
        var keys = Object.keys(this.currAnimations);
        for (var i = 0; i < keys.length; i++) {
            var anim = this.currAnimations[keys[i]];
            this.updateAnimation(anim, dt);

            if (anim.done) {
                var nextAnim = anim.nextAnimation;

                delete this.currAnimations[keys[i]];

                if (nextAnim != null) {
                    this.currAnimations[keys[i]] = nextAnim;
                    nextAnim.currTime = 0;
                    nextAnim.done = false;
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
            this.scaleAnchorX = anim.anchor;
        } else if (anim.type == "scaleY") {
            this.scaleY = currValue;
            this.scaleAnchorY = anim.anchor;
        } else if (anim.type == "bounce") {
            var timeLeft = anim.duration - anim.currTime;
            var frequency = (Math.sin(anim.currTime * 12 * PI) + 1) / 2;
            var amplitude = timeLeft * anim.end;
            var bounceFactor = frequency * amplitude + anim.begin;
            this.scaleX = this.scaleY = bounceFactor;

            this.scaleAnchorX = this.scaleAnchorY = 0.5;
        } else if (anim.type == "rotate") {
			this.rotate = currValue;
			this.rotateAnchorX = anim.anchorX;
			this.rotateAnchorY = anim.anchorY;
		} else {
			console.log("Whaaa?  Unkown animation type " + anim.type);
		}

        anim.currTime += dt;
        if (anim.currTime > anim.duration) {
            anim.done = true;
        }
    },

    play: function(anim, key) {
        this.currAnimations[key] = anim;
    },

    stop: function(key) {
		this.currAnimations[key].done = true;
	},

    currScale: function() {
        return this.currScale;
    },

    render: function(context) {},

    /**
     * Transform the canvas based on what the current animation says we should do 
     */
    transformCanvas: function(context) {
		var scaleAnchorAdjustX = this.entity.transform.width * this.scaleAnchorX;
		var scaleAnchorAdjustY = this.entity.transform.height * this.scaleAnchorY;
    	 
		context.translate(scaleAnchorAdjustX, scaleAnchorAdjustY);
		context.scale(this.scaleX, this.scaleY);
		context.translate(-scaleAnchorAdjustX, -scaleAnchorAdjustY);

		var rotateAnchorAdjustX = this.entity.transform.width * this.rotateAnchorX;
		var rotateAnchorAdjustY = this.entity.transform.height * this.rotateAnchorY;
    	 
		context.translate(rotateAnchorAdjustX, rotateAnchorAdjustY);
		context.rotate(this.rotate);
		context.translate(-rotateAnchorAdjustX, -rotateAnchorAdjustY);
    },
});