var GAME_HEIGHT = 600;
var GAME_WIDTH = 800;

var ShopCanvas = document.getElementById('shop-canvas');
var GameCanvas = document.getElementById('game-canvas');

// function(Juicy) {
   var Game = new Juicy.Game(GameCanvas, GAME_WIDTH, GAME_HEIGHT);
   Game.setInput(new Juicy.Input(document, {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SPACE: 32,
      ESC: 27,

      W: 87,
      A: 65,
      S: 83,
      D: 68,
   }));

   TransitionManager.toMachine(true);
    
   var playButton = document.getElementById('go');
   playButton.addEventListener('click', startGame);

   var guestButton = document.getElementById('guest');
   guestButton.addEventListener('click', startGame);

   function startGame() {
      // storing it in window for now, YOLO
      window.name = document.getElementById('username').value;
      window.token = document.getElementById('token').value;
      document.getElementById('player-info').remove();
      Game.setState(new TitleScreen()).run();
   }
// });

// Attempt to log in the user if they have credentials
(function() {
   var loginXHR = new XMLHttpRequest();
 
   loginXHR.open('GET', 'https://gamejolt.com/site-api/web/dash/token');
 
   loginXHR.onreadystatechange = function(e) {
      if (e.target.readyState === 4) {
         var info = JSON.parse(e.target.response);

         if (info.user) {
            window.name = info.user.username;
            window.token = info.payload.token;
            document.getElementById('player-info').remove();
            Game.setState(new TitleScreen()).run();
         }
         else {
            document.getElementById('player-info').setAttribute('style', '');
         }
      }
   }
 
   loginXHR.send();
})();

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);