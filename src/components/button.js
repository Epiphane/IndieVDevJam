var BUTTON_STATE_IDLE = 0;
var BUTTON_STATE_MOUSEOVER = 1;
var BUTTON_STATE_MOUSEDOWN = 2; // Only set to this if the mouse is clicking down ON this button
var BUTTON_STATE_DISABLED = 3;


Juicy.Component.create('Button', {
    constructor: function() {
        this.state = BUTTON_STATE_IDLE;
    },

    checkMouseOver: function(mousePoint) {
        if (this.state == BUTTON_STATE_DISABLED) {
            return;
        }

        if (this.entity.transform.contains(mousePoint.x, mousePoint.y)) {
            if (this.state == BUTTON_STATE_IDLE) {
                this.entity.getComponent('Animations').play(bounceAnimation(1.0, 1.02, 0.5), "button_bounce");

                var rotateLeft = rotateAnimation(-PI / 8, PI / 8, 0.5, 0.5, 0.5);
                var rotateRight = rotateAnimation(PI / 8, -PI / 8, 0.5, 0.5, 0.5);
                rotateLeft.nextAnimation = rotateRight;
                rotateRight.nextAnimation = rotateLeft;

                this.entity.getComponent('Animations').play(rotateLeft, "button_rotate");
            }
            this.state = BUTTON_STATE_MOUSEOVER;
        } else {
            if (this.state != BUTTON_STATE_IDLE) {
                var currRotation = this.entity.getComponent('Animations').rotate;
                var resetRotation = rotateAnimation(currRotation, 0, 0.5, 0.5, 0.13);
                this.entity.getComponent('Animations').play(resetRotation, "button_rotate");

                var currScale = this.entity.getComponent('Animations').xScale;
                this.entity.getComponent('Animations').play(xScaleAnimation(currScale, 1.0, 0.5, 0.2), "reset_scale_x");
                this.entity.getComponent('Animations').play(yScaleAnimation(currScale, 1.0, 0.5, 0.2), "reset_scale_y");
            }

            this.state = BUTTON_STATE_IDLE;
        }
    },

    checkMouseClick: function() {
        if (this.state == BUTTON_STATE_DISABLED) {
            return;
        }

        if (this.state == BUTTON_STATE_MOUSEOVER) {
            this.state = BUTTON_STATE_MOUSEDOWN

            var currRotation = this.entity.getComponent('Animations').rotate;
            var resetRotation = rotateAnimation(currRotation, 0, 0.5, 0.5, 0.13);
            this.entity.getComponent('Animations').play(resetRotation, "button_rotate");

            this.entity.getComponent('Animations').play(xScaleAnimation(1.0, 0.8, 0.5, 0.1), "what_now");
            this.entity.getComponent('Animations').play(yScaleAnimation(1.0, 0.8, 0.5, 0.1), "button_bounce_y");
        }
    },

    checkMouseUp: function() {
        if (this.state == BUTTON_STATE_DISABLED) {
            return;
        }

        if (this.state == BUTTON_STATE_MOUSEDOWN) {
            this.state = BUTTON_STATE_DISABLED;
 
            this.entity.getComponent('Animations').play(yScaleAnimation(0.8, 15, 0.5, 0.8), "hold_on_tight");
            this.entity.getComponent('Animations').play(xScaleAnimation(0.8, 15, 0.5, 0.8), "here_we_go");
            
            var FREEDOM_SPIN = rotateAnimation(0, 8 * PI, 0.5, 0.5, 0.5);
            var INTENSIFFFFY = WOWOWOWOWOW(12.0, 12.0, 0.8);
            
            var startGame = customFunctionAnimation(function() {
                buzz.all().stop();
                Game.setState(new Level());
            }, 0);

            FREEDOM_SPIN.nextAnimation = INTENSIFFFFY;
            INTENSIFFFFY.nextAnimation = startGame;

            this.entity.getComponent('Animations').play(FREEDOM_SPIN, "wow");
        }
    }
});
