var UpgradeScreen = Juicy.scene.extend({
    constructor: function() {

    },

    init: function() {
      var self = this;

      this.game.input.on('mousemove', function(evt) {
	 var mouse = self.game.getCanvasCoords(evt);
	 self.pic.getComponent('Button').checkMouseOver(mouse);
      });

      this.game.input.on('mousedown', function(evt) {
	 self.pic.getComponent('Button').checkMouseClick();
      });

      this.game.input.on('mouseup', function(evt) {
	 self.pic.getComponent('Button').checkMouseUp();
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

    update: function() {

    },

    render: function() {

    }
});


