var GameOverScreen = Juicy.State.extend({
    constructor: function(player) {
        buzz.all().stop();
        this.title = new Juicy.Text('Game Over Bro.', '40pt Arial', 'white', 'center');
        this.desc = new Juicy.Text('Press ESC to go back', '30pt Arial', 'white', 'center');
    },
    init: function() {
        var self = this;
        this.game.input.on('key', 'ESC', function() {
            self.game.setState(new TitleScreen());
        });
    },
    update: function() {
        return true;
    },
    render: function(context) {
        this.title.draw(context, GAME_WIDTH / 2, 30);
        this.desc.draw(context, GAME_WIDTH / 2, 80);
    }
});