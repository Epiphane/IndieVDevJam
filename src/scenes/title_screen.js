
var TitleScreen = Juicy.Scene.extend({
constructor: function() {
      this.pic = new Juicy.Entity(this, ['Image', 'Button', 'Animations']);
      this.pic.transform.position.x = GAME_WIDTH/2;
      this.pic.transform.position.y = GAME_HEIGHT/2;
      this.pic.getComponent('Image').setImage('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSxLS2z0JOP62RuEwe2WPgsRmy-n6oPyeqIl0kWWfosylUBDDXL6FEVfACx');      

	// TODO: button graphic or something

   },

   // init is called whenever the state is swapped to.
   // For example: CurrentGame.setState(NEW_STATE)
   // calls NEW_STATE.init()
   // You can start referencing this.game at this point
   init: function() {
      var self = this;

      this.game.input.on('mousemove', function(evt) {
	 var mouse = self.game.getCanvasCoords(evt);
	 self.pic.getComponent('Button').checkMouseOver(mouse);
      });

      // Define a callback to be used whenever 'W', 'A', 'S', or 'D' is pressed
      // These keys are defined in main.js
      this.game.input.on('key', ['W', 'A', 'S', 'D'], function(key) {

         // Notice I use self instead of this. `this` refers to god knows what
         // since we're in a different function scope, so we want to refer to 
         // our actual state variable
         self.myCustomFunction(key);
      });
   },


   // click is called whenever the scene gets clicked on
   // x and y are always scaled, so they will be from [0, GAME_WIDTH] and [0, GAME_HEIGHT]
   click: function(x, y) {
      this.pic.getComponent('Button').checkMouseClick(x, y);
   },


   // This is the function we call earlier. It's totally custom
   // and added as a member function to GameScreen
   myCustomFunction: function(input) {
      this.lastButton = input;


      // this.updated is interesting. it tells the engine whether anything
      // has changed since the last frame. If it's false, then nothing is
      // re-rendered. It's good for keeping the game less heavy on simple stuff
      // like the title screen, which doesn't change often.
      this.updated = true;
   },


   // update() is called every friggin' frame. This is your typical
   // update loop function. dt = time in seconds
   update: function(dt, input) {
      this.pic.update(dt);
   },


   // FINALLY. render() draws whatever you want to draw.
   render: function(context) {

      // This calls render() on every component in this.dude.
      // Everything is transformed relative to the player, so if
      // your dude is at x=1000, then everything will be drawn
      // at x=1000 with no extra work on your part!
      this.pic.render(context);

   
      // Draw our text
      // this.title.draw(context, this.game.width / 2, 100);
   }
});
