Juicy.Component.create('Button', {
   constructor: function() {
   },

   checkMouseOver: function(mousePoint) {
      if (this.entity.transform.contains(mousePoint.x, mousePoint.y)) {
	 
      } 
   },

   checkMouseClick: function(x, y) {
      if (this.entity.transform.contains(x,y)) {
      Game.setState(new Level());
      }
   }
});
