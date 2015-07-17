Juicy.Component.create('Button', {
   constructor: function() {
   },

   checkMouseOver: function(mousePoint) {
      if (this.entity.transform.contains(mousePoint.x, mousePoint.y)) {
         this.entity.getComponent('Animations').currAnimations.push(bounceAnimation(1.0, 1.2, 2.0));
      } 
   },

   checkMouseClick: function(x, y) {
      if (this.entity.transform.contains(x,y)) {
      Game.setState(new Level());
      }
   }
});
