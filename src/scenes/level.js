
var Level = Juicy.State.extend({
   constructor: function() {
      this.player = new Juicy.Entity(this, ['Box', 'Player', 'Physics']);
      this.player.transform.width = 50;
      this.player.transform.height = 50;
      this.player.getComponent('Box').fillStyle = 'green';

      var height = 50;
      this.platform = new Juicy.Entity(this, ['Box', 'Obstacle']);
      this.platform.getComponent('Obstacle').setBounds(0, GAME_HEIGHT - height, GAME_WIDTH, height);

      this.obstacles = [this.platform];
   },
   update: function(dt, input) {
      var original = {
         x: this.player.transform.position.x,
         y: this.player.transform.position.y
      };
      this.player.update(dt);

      return original.x === this.player.transform.position.x
          && original.y === this.player.transform.position.y;
   },
   render: function(context) {
      this.player.render(context);

      console.log('r');

      this.platform.render(context);
   }
});