var Booklet = Juicy.Entity.extend({
   components: ['Box', 'Booklet'],
   colors: ['#ffff00', '#ff0000', '#00ff00', '#0000ff'],
   init: function() {
      this.transform.width = 0.4;
      this.transform.height = 0.3;

      this.getComponent('Box').fillStyle = this.colors[Juicy.rand(this.colors.length)];
   }
});