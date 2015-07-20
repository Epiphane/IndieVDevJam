var IntroScreen = Juicy.State.extend({
    constructor: function() {
        this.pic = new Juicy.Entity(this, ['Image', 'Button', 'Animations']);
        this.pic.transform.position.x = GAME_WIDTH/2 + 50;
        this.pic.transform.position.y = GAME_HEIGHT/2 + 100;
        this.pic.getComponent('Image').setImage('./img/button2.png'); 
        this.music = newBuzzSound( "audio/music_spellbound", {
            formats: [ "mp3"]
        });

        this.bg = new Juicy.Entity(this, ['Image']);
        this.bg.transform.width = GAME_WIDTH;
        this.bg.transform.height = GAME_HEIGHT;
        this.bg.getComponent('Image').setImage('./img/title.png');
    },

});