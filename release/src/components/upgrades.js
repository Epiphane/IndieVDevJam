Juicy.Component.create('Upgrades', {
    constructor: function() {
        this.heavy = true;

        this.mana = 20;

        this.levels = {
            magic: 0,
            agility: 0,
            power: 0
        };
    },

    availableBooks: function() {
        var availBooks = [Powerup.DAMAGE, Powerup.SLOW, Powerup.EXPLODE];

        return availBooks;
    },

    upgrades: {
        magic: [
            {
                title: "Magic +",
                desc: "More mana",
                desc2: "per book",
                get: function() {
                    this.mana += 10;
                }
            }
        ],
        agility: [
            {
                title: "Agility +",
                desc: "Move faster",
                get: function() {
                    this.entity.getComponent('Player').speed += 4;
                }
            },
            {
                title: "KNEES",
                desc: "Jump",
                desc2: "Higher",
                get: function() {
                    this.entity.getComponent('Physics').jumpPower = -90
                }
            },
            {
                title: "Agility 2",
                desc: "Move even",
                desc2: "faster",
                get: function() {
                    this.entity.getComponent('Player').speed += 6;
                }
            },
        ],

        power: [
            {
                title: "Power +",
                desc: "More damage",
                desc2: "per book",
                get: function() {
                    this.entity.getComponent('Player').damage += 15;
                }
            },
            {
                title: "Pain Aura",
                desc: "Hurts enemies",
                desc2: "near you",
                get: function() {
                    this.entity.getComponent('Player').aura = true;
                }
            }
        ],

    },

    update: function(dt, input) {
    },

    nextUpgrade: function(name) {
        return this.upgrades[name][this.levels[name]];
    },

    getNextUpgrade: function(name) {
        if (this.levels[name] < this.upgrades[name].length);
        this.upgrades[name][this.levels[name]++].get.apply(this);
    },

    getNextAgilityUpgrade: function() {
        this.getNextUpgrade('agility');
    },

    getNextMagicUpgrade: function() {
        this.getNextUpgrade('magic');
    },

    getNextPowerUpgrade: function() {
        this.getNextUpgrade('power');
    }

});
