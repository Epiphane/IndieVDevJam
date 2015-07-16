var GameScreen = Juicy.Scene.extend({
   constructor: function() {
      this.dude = new Juicy.Entity(this, ['Box']);

      this.dude.transform.position.x = 10;
      this.dude.transform.position.y = 10;
      this.dude.transform.width = this.dude.transform.height = 40;
      this.dude.getComponent('Box');

      this.title = new Juicy.Text('Hello!', '40pt Arial', 'white', 'center');
      this.sub = new Juicy.Text('You dont have to initialize font either!');
   },
   init: function() {
      this.lastButton = '';
   },
   click: function(x, y) {
      console.log(x, y);
   },
   update: function(dt) {
      if  (this.game.input.keyDown('A'))
         this.lastButton = 'A';
      if  (this.game.input.keyDown('D'))
         this.lastButton = 'D';
      if  (this.game.input.keyDown('W'))
         this.lastButton = 'W';
      if  (this.game.input.keyDown('S'))
         this.lastButton = 'S';

      this.title.set({
         text: 'Hello! You pressed ' + this.lastButton
      });

      return !this.game.input.keyDown(['A','D','W','S']);
   },
   render: function(context) {
      this.dude.render(context);
   
      this.title.draw(context, this.game.width / 2, 100);
      this.sub.draw(context, 200, 160);
   }
});