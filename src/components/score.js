Juicy.Component.create('Score', {
	constructor: function(name) {
		this.player = name;
		this.game_id= 69;
		this.api_key= 6969;
		this.score= 0;
		this.player= null;
		this.combo_multiplier= 1.5; // how much to multiply the aggregated combo score
		this.combo_duration= 1000; // miliseconds. basically how long between events before no longer considered a combo
		this.events_since_last_check= []; 
		this.time_since_last_update= 0;
		this.event_happened_since_last_update= false;
		
		this.scoreText = new Juicy.Text('Score: ' + this.score, '10pt Arial', 'white', 'center');
	},

	events: {
		'killedEnemy' : 10,
		'died' : -100,
		'destroyShrine' : 100
	},
	
	update: function(dt, input) {
		if (this.time_since_last_update + dt > this.combo_duration / 1000) {
			if (this.event_happened_since_last_update) {
				// combo in progress, chill back. this will be flaky unless we store exactly what time the last event ocurred.
				this.time_since_last_update = 0;
			}
			else {
				// process those events and reset combo counter
				this.processEvents();
				this.time_since_last_update = 0;
			}
			this.event_happened_since_last_update = false;
		} 
		else {
			this.time_since_last_update += dt;
		}
	},
	
	render: function(context) {
		this.scoreText.draw(context, 0, 0);
	},
	
	// right now lets just count events of the same type as comboable
	processEvents: function() {
		// keeps track of event names and counts
		// right now this is dumb. if K K D K K events happen, it should be 2K 1D 2K combos. instead will count 4Ks 1D
		// will fix if we ever need to
		var comboEvents = {};
		
		var amount = 0; // aggregated amount to increase score by 
		
		// combine combos
		for (var i = 0; i < this.events_since_last_check.length; i++) {
			var event = this.events_since_last_check[i];
			if (!comboEvents[event]) {
				comboEvents[event] = 0
			}
			comboEvents[event] += 1;
		}
		
		// aggregate scores
		for (event in comboEvents) {
			var count = comboEvents[event];
			var value = this.events[event];
			// how many times this event occurred this combo
			if (count > 1) {
				amount += value * count * this.combo_multiplier;
			}
			else {
				amount += value;
			}
		}
		
		this.incrementScore(amount);
		this.events_since_last_check.length = 0; // Boom, Roasted
	},

	// all you do is call this, the rest is black magic
	eventOccurred: function(eventName) {
		this.events_since_last_check.push(eventName);
		this.event_happened_since_last_update = true;
	},

	// will hit api
	submitScore: function() {
		
	},

	incrementScore: function(score) {
		this.score += score;
		
		if (this.score < 0) {
			this.score = 0;
		}
		
		this.scoreText.set({
		   text: 'Score: ' + this.score
		});
	},

});
