
var GAME_HEIGHT = 768;
var GAME_WIDTH = 1024;

// function(Juicy) {
   var Game = new Juicy.Game(document.getElementById('game-canvas'), GAME_WIDTH, GAME_HEIGHT);
   Game.setInput(new Juicy.Input(document, {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SPACE: 32,

      W: 87,
      A: 65,
      S: 83,
      D: 68,
   }));

   // On window resize, fill it with the game again!
   window.onresize = function() {
       Game.resize();
   };

   document.addEventListener('DOMContentLoaded', function() {
      Game.setState(new TitleScreen()).run();
   }, false);
// });
