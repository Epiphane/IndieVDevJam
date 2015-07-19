Juicy.Component.create('GUI', {
	constructor: function(name) {
		this.score = new Juicy.Text('Score: 0');
		this.flash = new Juicy.Text();
		this.flashTexts = [];
		this.nextAvailableIndex = 0; // for flash texts
		this.maxFlashTexts = 10;
		
		for (var i = 0; i < this.maxFlashTexts; i++) {
			this.flashTexts[i] = new Juicy.Text('');
		}
	},
	
	render: function(context) {
		this.score.draw(context, 10, 10, 50, 30);
		/*
		for (text in this.flashTexts) {
			if (text.text && text.text != "") {
				text.draw(context, 100, 10, 50, 30);
			}
		}
		*/
	},
	
	updateScore: function(score) {
		this.score.set({
			text: 'Score: ' + score
		});
	},
	
	/*
	// flash some text in the middle of the screen
	setFlash: function(text) {
		console.log("flash: " + text);
		this.entity.getComponent('Animations').play(bounceAnimation(1.0, 1.02, 0.5), "button_bounce");
		
		this.flashTexts[this.nextAvailableIndex].set({
			text: text
		});
	}
	*/

});
