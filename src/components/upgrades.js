Juicy.Component.create('Upgrades', {
    constructor: function() {
        this.heavy = true;
    },

    update: function(dt, input) {
    },

    nextMagicUpgrade: function() {
        return {
            title: "Magic Up",
            desc: "More mana per book"
        };
    },

    nextAgilityUpgrade: function() {
        return {
            title: "Agility Up",
            desc: "Move faster"
        };
    },

    nextPowerUpgrade: function() {
        return {
            title: "Power Up",
            desc: "More damage per book"
        };
    },

    getNextPowerUpgrade: function() {
        console.log('magic');
    },

    getNextAgilityUpgrade: function() {
        console.log('Agility');
    },

    getNextMagicUpgrade: function() {
        console.log('Power');
    }

});
