var fader = document.getElementById('fader');

// Set defaults
fader.value = localStorage.getItem('volume') || 60;
buzz.defaults.volume = fader.value;

function setVolume(val) {
    localStorage.setItem('volume', val);
    buzz.defaults.volume = fader.value = val;
}

// Handle volume changes
fader.addEventListener('change', function(e) {
    setVolume(parseInt(e.target.value));
});
document.getElementById('mute').onclick = function() {
    setVolume(0);
};

var newBuzzSound = (function() {
    var globalSounds = [];

    // "Fix" the buzz volume management


    return function(src, options) {
        var sound = new buzz.sound(src, options);

        globalSounds.push(sound);

        return sound;
    }
})();