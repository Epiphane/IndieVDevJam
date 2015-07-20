Juicy.Component.create('ScoreDisplay', {
   constructor: function() {
      this.text = ""; // set via function
      this.timeToLive = 1; // seconds
      this.initialized = false;
      this.guiCoordinates = false;
   },
   
   update: function(dt, input) {
      if (this.initialized) {
         this.timeToLive -= dt;
         
         if (this.timeToLive < 0) {
            // later bruh
            this.entity.dead = true
            
            if(this.guiCoordinates) {
               this.entity.scene.gui.getComponent('GUI').removeCombo();
            }
         }
      }
   },
   
   render: function(context) {
      if(this.initialized && !this.guiCoordinates) {
         this.text.draw(context, 0, 0, 1, 1);
      }
   },

   setText: function(text) {
      this.text = new Juicy.Text(text, '10pt Arial', 'yellow');
      this.initialized = true;
   },
   
   // gui instead of world
   setPosition: function(x, y, guiCoordinates) {
      this.entity.transform.position.x = x;
      this.entity.transform.position.y = y;
      this.guiCoordinates = guiCoordinates;
      
      // hackkk to get text rendered in gui
      if(guiCoordinates)
         this.entity.scene.gui.getComponent('GUI').setCombo(this.text.text);
   }
});
