// I'm sorry. It's just so small and pointless.
Juicy.Component.create('UpgradeScroll', {
    constructor: function() {
        this.destination = 300;
        this.timeUntilDrop = 0;
        this.dropTime = 0;
        this.totalDropTime = 2;
    
        this.title = new Juicy.Text('', '30pt Artial', 'black', 'center');
        this.desc = new Juicy.Text('', '16pt Artial', 'black', 'center');
        this.desc2 = new Juicy.Text('', '16pt Artial', 'black', 'center');
        this.lvl = new Juicy.Text('', '20pt Artial', 'black', 'right');
    },
    setUpgradeInfo: function(info) {
        this.title.set({ text: info.title || '' });
        this.desc.set({ text: info.desc || '' });
        this.desc2.set({ text: info.desc2 || '' });
        this.lvl.set({ text: info.lvl || '1' });
    },
    update: function(dt) {
        this.entity.transform.position.y = this.destination;
        if (this.timeUntilDrop > 0) {
            this.timeUntilDrop -= dt;
            // this.entity.transform.position.y = itemStartY;
            return;
        }

        this.entity.getComponent('Image').opacity = (this.dropTime / this.totalDropTime);
        this.title.opacity = (this.dropTime / this.totalDropTime);
        this.desc.opacity = (this.dropTime / this.totalDropTime);

        // console.log(this.dropTime, this.totalDropTime);
        if (this.dropTime < this.totalDropTime) {
            this.dropTime += dt;
        }
        else {
            this.dropTime = this.totalDropTime;
        }

        this.entity.transform.position.y = this.destination;
    },
    render: function(context) {
        this.title.draw(context, this.entity.transform.width / 2, 10);
        this.desc.draw(context, this.entity.transform.width / 2, 70);
        this.desc2.draw(context, this.entity.transform.width / 2, 100);

        this.lvl.draw(context, this.entity.transform.width - 20, this.entity.transform.height - 60);
    }
});