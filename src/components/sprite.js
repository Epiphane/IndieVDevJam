Juicy.Component.create('Sprite', {
    constructor: function(entity) {
    var self = this;

    this.sheet_width   = 0;
    this.sheet_height  = 0;
    this.sprite_width  = 0;
    this.sprite_height = 0;

    this.frametime = -1; // Don't animate yet
    this.timeleft = 0;
    this.repeat = false;
    this.sprite = 0;
    this.first_sprite = 0;
    this.last_sprite = 0;

    this.image = new Image();
    this.image.onload = function() {
        self.sheet_width   = this.width / self.sprite_width;
        self.sheet_height  = this.height / self.sprite_height;

        entity.scene.updated = true;

        if (self.onload)
            self.onload(this);
        }
    },
    setSheet: function(url, swidth, sheight) {
        this.image.src = url;

        this.frametime = -1; // Don't animate yet
        this.steptime = 0;
        this.repeat = false;
        this.sprite = 0;
        this.last_sprite = 0;

        this.sprite_width  = swidth;
        this.sprite_height = sheight;
        if (!this.entity.transform.width || !this.entity.transform.height) {
            this.entity.transform.width  = swidth;
            this.entity.transform.height = sheight;
        }

        return this;
    },
    runAnimation: function(start, end, frametime, repeat) {
        this.frametime = this.timeleft = frametime;
        this.sprite = this.first_sprite = start;
        this.last_sprite = end;

        this.repeat = repeat;

        return this; // Enable chaining
    },
    animating: function() {
        return (this.frametime >= 0 && (this.repeat || this.sprite <= this.last_sprite));
    },
    update: function(dt, input) {
        if (this.animating()) {
            this.timeleft -= dt;

            if (this.timeleft <= 0) {
                this.sprite ++;

                this.timeleft = this.frametime;

                if (this.sprite > this.last_sprite) {
                    if (this.repeat)
                        this.sprite = this.first_sprite;
                    else {
                        this.sprite = this.last_sprite;
                        this.frametime = -1;
                        if (this.oncompleteanimation) 
                            this.oncompleteanimation();
                    }
                }
            }
        }
    },
    render: function(context) {
        var animator = this.entity.getComponent('Animations');
        context.save();
        if (animator) {
            animator.transformCanvas(context);
        }

        var sx = (this.sprite % this.sheet_width) * this.sprite_width;
        var sy = Math.floor(this.sprite / this.sheet_width) * this.sprite_height;

        var dx = arguments[5] || arguments[1] || 0;
        var dy = arguments[6] || arguments[2] || 0;
        var dwidth = arguments[7] || arguments[3] || this.entity.transform.width;
        var dheight = arguments[8] || arguments[4] || this.entity.transform.height;

        context.drawImage(this.image, sx, sy, this.sprite_width, this.sprite_height,
                                      dx, dy, dwidth, dheight);
        context.restore();
    }
});