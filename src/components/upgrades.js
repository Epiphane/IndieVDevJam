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
                title: "Vampiric",
                desc: "Kill 10 dudes,",
                desc2: "get healed",
                get: function() {
                    this.entity.getComponent('Player').vampire = true;
                }
            },
           {
                title: "Magic +",
                desc: "More mana",
                desc2: "per book",
                get: function() {
                    this.mana += 20;
                }
            },
            {
                title: "Combos +",
                desc: "Longer combo",
                desc2: "window",
                get: function() {
                    this.entity.getComponent('Score').combo_duration = 2000;
                }

            },
            {
                title: "Medic",
                desc: "Fully heal",
                desc2: "each level",
                get: function() {
                    this.entity.getComponent('Player').health = 4;
                }
            },
             {
                title: "Roulette",
                desc: "Every 3rd book",
                desc2: "powered up",
                get: function() {
                    this.entity.getComponent('Player').rouletteEnabled = true;
                }
            },
            
        ],
        agility: [


            {
                title: "Tiny",
                desc: "Honey I shrunk",
                desc2: "the wizard!",
                get: function() {
                    this.entity.getComponent('Player').tiny = true;
                    this.entity.transform.width /= 2.1;
                    this.entity.transform.height /= 2.1;
                }
            },

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
                    this.entity.getComponent('Physics').jumpPower -= 20;
                }
            },
            {
                title: "Ninja",
                desc: "Chance to",
                desc2: "take 0 damage",
                get: function() {
                    this.entity.getComponent('Player').dodge = true;
                }
            },
        ],

        power: [
            {
                title: "Power +",
                desc: "More damage",
                desc2: "per shot",
                get: function() {
                    this.entity.getComponent('Player').damage += 15;
                }
            },

            {
                title: "Heavy Reading",
                desc: "Bigger shots",
                get: function() {
                    this.entity.getComponent('Player').bigBooks = true;
                }
            },
            {
                title: "Pain Aura",
                desc: "Hurts enemies",
                desc2: "near you",
                get: function() {
                    this.entity.getComponent('Player').aura = true;
                }
            },
            {
                title: "Big Hurt",
                desc: "Less Health,",
                desc2: "More Damage",
                get: function() {
                    this.entity.getComponent('Player').bigHurt = true;
                }
            },
            {
                title: "Stomp",
                desc: "Land on enemies",
                desc2: "to kill them",
                get: function() {
                    this.entity.getComponent('Player').stomp = true;
                }
            },
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
