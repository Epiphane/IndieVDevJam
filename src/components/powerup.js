var Powerup = Juicy.Component.create('Powerup', {
    constructor: function(powers) {
        this.power = powers[Juicy.rand(powers.length)];
    }
}, {
    colors: {
        none: '#8B4513',
        fire: '#ff0000',
        ice: '#99ddff',
        explosive: '#ffff00',
        fire_ice: '#cc167d',
        fire_explosive: '#ffffff',
        ice_explosive: '#ff6c00',
        fire_ice_explosive: '#000000'
    },
    SLOW: 'ice',
    DAMAGE: 'fire', 
    EXPLODE: 'explosive',
    getColor: function(powers) {
        var has = function(power) {
            return powers.indexOf(power) >= 0;
        };

        var fire = has('fire'),
            ice = has('ice'),
            explosive = has('explosive');

        var color;
        if (powers.length === 0) {
            // Brown book
            color = '#8B4513';
        }
        else if (powers.length === 1) {
            // Choose that color
            color = Powerup.colors[powers[0]];
        }
        else {
            // More than two books. Special cases here
            if (fire) {
                if (ice) {
                    color = '#cc167d';
                }
                else if (explosive) {
                    color = '#ffffff';
                }
            }
            else if (ice) {
                if (explosive) {
                    color = '#ff6c00';
                }
            }
        }

        return color;
    }
});