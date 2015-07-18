Juicy.Component.create('Score', {
	game_id: 69,
	api_key: 6969,
	score: 0,
	player: null,
	combo_multiplier: 1.5, // how much to multiply the aggregated combo score
	combo_duration: 1000, // miliseconds. basically how long between events before no longer considered a combo
	events_since_last_check: [], 
	time_since_last_update: 0,
	event_happened_since_last_update: false,
	
	constructor: function(name) {
		this.player = player;
	},

	events: {
		'killedEnemy' : 10,
		'died' : -100,
		'destroyShrine' : 100
	},
	
	update: function(dt, input) {
		if (this.time_since_last_update + dt > this.combo_duration) {
			console.log("wooo check updates");
			if (this.event_happened_since_last_update) {
				// combo in progress, chill back. this will be flaky unless we store exactly what time the last event ocurred.
				this.time_since_last_update = 0;
				console.log("chill back, combo in progress");
			}
			else {
				// process those events and reset combo counter
				this.processEvents();
				this.time_since_last_update = 0;
				console.log("processed events");
			}
			this.event_happened_since_last_update = false;
		} 
		else {
			this.time_since_last_update += dt;
		}
	},
	
	// right now lets just count events of the same type as comboable
	processEvents: function() {
		var last_event = "";
		
		// keeps track of event names and counts
		// right now this is dumb. if K K D K K events happen, it should be 2K 1D 2K combos. instead will count 4Ks 1D
		// will fix if we ever need to
		var comboevents = [];
		
		var amount; // aggregated amount to increase score by 
		
		// combine combos
		for (var i = 0; i < this.events_since_last_check; i++) {
			var event = this.events_since_last_check[i];
			if (event == last_event) {
				comboEvents[event]++;
			}
			last_event = event;
		}
		
		// aggregate scores
		for (var i = 0; i < comboevents.length; i++) {
			amount += comboevents[i] * this.combo_multiplier;
		}
		
		this.increaseScore(amount);
		
		this.events_since_last_check.length = 0; // lets clear that array bruh
	},

	// all you do is call this, the rest is black magic
	eventOccurred: function(eventName) {
		var eventValue = events.eventName;
		
		// if we decide to keep track of combos here, then we will need to perform either
		// an update or get time here to decide how close together events need to happen to be considered a combo
		if (eventName == last_event) {
			this.score += event.val() * this.combo_multiplier;
		}
		else {
			this.score += eventValue;
		}

		if (this.score < 0 ) {
			this.score = 0;
		}
		
		this.event_happened_since_last_update = true;
	},

	// hits API
	submitScore: function() {
		
	},

	getScore: function() {
		return this.score;
	},

	//////////////////////////////////////////
	//   DO NOT USE OUTSIDE OF THIS CLASS  //
	////////////////////////////////////////

	setScore: function(score) {
		this.score = score;
	},

	increaseScore: function(amount) {
		this.score += amount;
	},

	decreaseScore: function(amount) {
		this.score -= amount;
	}

});
