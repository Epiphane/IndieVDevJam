
var TitleScreen = Juicy.Scene.extend({
constructor: function() {
        this.pic = new Juicy.Entity(this, ['Image', 'Button', 'Animations']);
        this.pic.transform.position.x = GAME_WIDTH/2;
        this.pic.transform.position.y = GAME_HEIGHT/2;
        this.pic.getComponent('Image').setImage('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSxLS2z0JOP62RuEwe2WPgsRmy-n6oPyeqIl0kWWfosylUBDDXL6FEVfACx'); 
        this.music = newBuzzSound( "audio/music_spellbound", {
            formats: [ "mp3"]
        });
	//  TODO: button graphic or something
    
        this.pic.getComponent('Button').action = function() {
            // This refers to the Button Component here
            this.entity.getComponent('Animations').abortAll();
    
            this.entity.getComponent('Animations').play(yScaleAnimation(0.8, 15, 0.5, 0.8), "hold_on_tight");
            this.entity.getComponent('Animations').play(xScaleAnimation(0.8, 15, 0.5, 0.8), "here_we_go");
    
            var FREEDOM_SPIN = rotateAnimation(0, 8 * PI, 0.5, 0.5, 0.5);
            var INTENSIFFFFY = WOWOWOWOWOW(12.0, 12.0, 0.8);
    
            var startGame = customFunctionAnimation(function() {
                buzz.all().stop();
                Game.setState(new Level());
                
      ga('send', 'pageview', 'playscreen', 'Play Screen');
            }, 0);
    
            FREEDOM_SPIN.nextAnimation = INTENSIFFFFY;
            INTENSIFFFFY.nextAnimation = startGame;
    
            this.entity.getComponent('Animations').play(FREEDOM_SPIN, "wow");
        };
    },

    init: function() {
        var self = this;

        this.music.play().loop();
    },

    click: function(x, y) {
        this.pic.getComponent('Button').checkMouseClick(x, y);
    },

    update: function(dt, input) {
        this.pic.update(dt);

        // this.pic.getComponent('Button').checkMouseOver(this.game.mouse);

        return this.pic.getComponent('Animations').done;
    },

    render: function(context) {
        this.pic.render(context);
    }
});
