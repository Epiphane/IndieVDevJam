var UpgradeScreen = Juicy.State.extend({
    constructor: function(player) {
        this.player = player;

        var itemStartY = -300;
        var itemWidth = 200;
        var itemPadding = 50;

        // Get player upgrades
        var upgrades = this.player.getComponent('Upgrades');

        var self = this;
        var createScroll = function(name, tint, waitTime, x) {
            var scroll = new Juicy.Entity(self, ['Image', 'UpgradeScroll']);
            scroll.transform.position.x = x;
            if (name === 'magic')
                scroll.getComponent('UpgradeScroll').setUpgradeInfo(upgrades.nextMagicUpgrade());
            if (name === 'agility')
                scroll.getComponent('UpgradeScroll').setUpgradeInfo(upgrades.nextAgilityUpgrade());
            if (name === 'power')
                scroll.getComponent('UpgradeScroll').setUpgradeInfo(upgrades.nextPowerUpgrade());
            scroll.getComponent('UpgradeScroll').timeUntilDrop = waitTime;
            scroll.getComponent('Image').setImage('./img/upgrade_scroll.png');
            scroll.getComponent('Image').opacity = 0;
            scroll.getComponent('Image').tint = tint;

            var button = new Juicy.Entity(self, ['Image', 'Animations', 'Button']);
            button.transform.position.y = 180;
            button.transform.position.x = 70;
            button.getComponent('Image').setImage('./img/button.png');
            button.getComponent('Button').action = function() {
                // This refers to the Button Component here
                if (name === 'magic')
                    upgrades.getNextMagicUpgrade();
                if (name === 'agility')
                    upgrades.getNextAgilityUpgrade();
                if (name === 'power')
                    upgrades.getNextPowerUpgrade();

                fade = customFunctionAnimation(function() {
                    button.getComponent('Image').opacity = 1 - this.currTime;
                }, 1);

                var backToLevel = customFunctionAnimation(function() {
                    TransitionManager.toMachine();
                    scroll.transform.children = [];
                }, 0);
        
                fade.nextAnimation = backToLevel;

                TransitionManager.onComplete = function() {
                    buzz.all().stop();
                    Game.setCanvas(GameCanvas);
                    Game.setState(new Level(self.player));
                }
        
                this.entity.getComponent('Animations').play(fade, "fadeOut");
            };

            scroll.transform.addChild(button);

            return {
                scroll: scroll,
                button: button
            };
        }

        this.magic   = createScroll('magic',   'purple', 0,   itemPadding);
        this.agility = createScroll('agility', 'green',  0.5, 2 * itemPadding + itemWidth);
        this.power   = createScroll('power',   'red',    1,   3 * itemPadding + 2 * itemWidth);
    },
    init: function() {
        this.game.setCanvas(ShopCanvas);
    },
    click: function(x, y) {
        this.magic  .button.getComponent('Button').checkMouseClick(x, y);
        this.agility.button.getComponent('Button').checkMouseClick(x, y);
        this.power  .button.getComponent('Button').checkMouseClick(x, y);
    },
    update: function(dt) {
        this.magic  .scroll.update(dt);
        this.agility.scroll.update(dt);
        this.power  .scroll.update(dt);

        this.magic  .button.update(dt);
        this.agility.button.update(dt);
        this.power  .button.update(dt);
    },
    render: function(context) {
        this.magic  .scroll.render(context);
        this.agility.scroll.render(context);
        this.power  .scroll.render(context);
    }
});