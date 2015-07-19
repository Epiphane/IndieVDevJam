var fader = document.getElementById('fader');

fader.value = localStorage.getItem('volume') || 60;
buzz.defaults.volume = fader.value;

fader.addEventListener('change', function(e) {
    localStorage.setItem('volume', e.target.value);
    buzz.defaults.volume = fader.value;
});

var newBuzzSound = (function() {
    var globalSounds = [];

    // "Fix" the buzz volume management
    

    return function(src, options) {
        var sound = new buzz.sound(src, options);

        globalSounds.push(sound);

        return sound;
    }
})();