Juicy.Component.create('GUI', {
    constructor: function(entity) {
        this.score = new Juicy.Text('Score: 0');
        this.flash = new Juicy.Text();
        this.playerName = new Juicy.Text('');
        this.flashTexts = [];
        this.nextAvailableIndex = 0; // for flash texts
        this.maxFlashTexts = 10;
        
        for (var i = 0; i < this.maxFlashTexts; i++) {
            this.flashTexts[i] = new Juicy.Text('');
        }

        this.powerbars = [];

        this.bookPreview = new Juicy.Components.Image(entity);
        this.bookPreview.setImage('./img/book.png');

        this.heart_full = new Juicy.Components.Image(entity);
        this.heart_full.setImage('./img/heart.png');
        this.heart_half = new Juicy.Components.Image(entity);
        this.heart_half.setImage('./img/heart_half.png');
        this.heart_empty = new Juicy.Components.Image(entity);
        this.heart_empty.setImage('./img/heart_empty.png');

        this.health = this.maxhealth = 0;
    },
    
    render: function(context) {
        this.score.draw(context, 10, 10, 50, 30);
        this.playerName.draw(context, 10, 25, 60, 30);
        /*
        for (text in this.flashTexts) {
            if (text.text && text.text != "") {
                text.draw(context, 100, 10, 50, 30);
            }
        }
        */

        var x = GAME_WIDTH / 2 - 40 * this.maxhealth;
        for (var i = 0; i < this.maxhealth; i ++) {
            if (i < this.health) {
                if (i + 0.5 === this.health) {
                    this.heart_half.render(context, x, 10);
                }
                else {
                    this.heart_full.render(context, x, 10);
                }
            }
            else {
                this.heart_empty.render(context, x, 10);
            }

            x += 40;
        }

        for (var i = 0; i < this.powerbars.length; i ++) {
            var barWidth = this.powerbars[i].mana * 5;
            var barHeight = 30 / this.powerbars.length;
            if (barHeight > 20)
                barHeight = 20;
            var barRightX = GAME_WIDTH - 70;
            var barTop = i * barHeight + 10;

            context.fillStyle = this.powerbars[i].color;
            context.fillRect(barRightX - barWidth, barTop, barWidth, barHeight);
        }

        this.bookPreview.render(context, GAME_WIDTH - 75, 10, 51, 53);
    },

    setPowerBars: function(bars, color) {
        this.powerbars = bars;

        this.bookPreview.setTint(color);
    },

    setHealth: function(hp, max) {
        this.health = hp;
        this.maxhealth = max;
    },
    
    updateScore: function(score) {
        this.score.set({
            text: 'Score: ' + score
        });
    },
    
    setName: function(name) {
        this.playerName.set({
            text: name
        })
    },
    
    /*
    // flash some text in the middle of the screen
    setFlash: function(text) {
        console.log("flash: " + text);
        this.entity.getComponent('Animations').play(bounceAnimation(1.0, 1.02, 0.5), "button_bounce");
        
        this.flashTexts[this.nextAvailableIndex].set({
            text: text
        });
    }
    */

});
