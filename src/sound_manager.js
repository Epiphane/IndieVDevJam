var newBuzzSound = (function() {
    var globalSounds = [];

    // Handle volume changes
    var muter = document.getElementById('mute');
    var gameMuted = localStorage.getItem('mute') || false;

    // Set the graphic
    var i = muter.children[0];
    if (gameMuted)
        i.setAttribute('class', 'fa fa-volume-up');
    else
        i.setAttribute('class', 'fa fa-volume-off');

    muter.onclick = function() {
        gameMuted = !gameMuted;

        if (gameMuted)
            i.setAttribute('class', 'fa fa-volume-up');
        else
            i.setAttribute('class', 'fa fa-volume-off');

        localStorage.setItem('mute', gameMuted);

        // Change all globalSounds to be muted or not muted
        // ...
    };

    return function(src, options) {
        var sound = new buzz.sound(src, options);

        // if gameMuted then mute the sound immediately
        // ...

        globalSounds.push(sound);

        return sound;
    }
})();