Juicy.Component.create('Powerup', {
    constructor: function(powers) {
        this.power = powers[Juicy.rand(powers.length)];

        this.mana = 10;
    }
});