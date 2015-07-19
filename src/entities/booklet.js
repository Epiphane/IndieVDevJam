var Booklet = Juicy.Entity.extend({
   components: ['Box', 'Booklet'],
   colors: ['#ffef00', '#ff0000', '#00d700', '#650ebd'],
   init: function() {
      this.transform.width = 0.4;
      this.transform.height = 0.3;

      this.getComponent('Box').fillStyle = this.colors[Juicy.rand(this.colors.length)];
   }
});