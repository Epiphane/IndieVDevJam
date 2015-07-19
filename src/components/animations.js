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

/**
 * Does whatever you tell it in the function (called once).  Should mostly just use to 
 *  set flags or change states or something I guess.
 *
 *  Still doesn't call nextAnimation until after it's duration.
 */
function customFunctionAnimation(func, duration) {
	return {
		type: "doFunction",
		func: func,

		nextAnimation: null,

		currTime: 0,
        duration: duration
	}
}

function WOWOWOWOWOW(X_GOOD_JOB, Y_U_DID_IT, HOW_LONG_DUNKY) {
    return {
        type: "WOW",
        begin: X_GOOD_JOB,
        end: Y_U_DID_IT,
        duration: HOW_LONG_DUNKY,

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

	this.translateX = 0;
	this.translateY = 0;
    },

    update: function(dt, input) {
        this.done = true;

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
            else {
                this.done = false;
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
		} else if (anim.type == "WOW") {
			this.translateX = Math.random() * anim.begin;
			this.translateY = Math.random() * anim.end;
		} else if (anim.type == "doFunction") {
			if (anim.duration !== 0 || anim.currTime === 0) {
				anim.func();
			}
        } else {
            console.log("Whaaa?  Unkown animation type " + anim.type);
        }

        anim.currTime += dt;
        if (anim.currTime > anim.duration) {
            anim.done = true;
            this.finishAnimation(anim);
        }
    },

	/**
	 * We don't always end RIGHT when currTime == duration.
	 *  Set the element to anim.end if appropriate.
	 */
	finishAnimation: function(anim) {
		if (anim.type == "scaleX") {
            this.scaleX = anim.end;
        } else if (anim.type == "scaleY") {
            this.scaleY = anim.end;
        } else if (anim.type == "bounce") {
            this.scaleX = this.scaleY = anim.end;
            this.scaleAnchorX = this.scaleAnchorY = 0.5;
        } else if (anim.type == "rotate") {
            this.rotate = anim.end;
            this.rotateAnchorX = anim.anchorX;
            this.rotateAnchorY = anim.anchorY;
		} else if (anim.type == "WOW") {
			this.translateX = 0;
			this.translateY = 0;
		} else if (anim.type == "doFunction") {
			//nothin
        } else {
            console.log("Whaaa?  Unkown animation type " + anim.type);
        }
    },

    play: function(anim, key) {
        this.currAnimations[key] = anim;
    },

    stop: function(key) {
        if (this.currAnimations[key]) {
            this.currAnimations[key].done = true;
        }
    },

    abortAll: function() {
        this.currAnimations = {};
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

	context.translate(this.translateX, this.translateY);
    },
});
