Juicy.Component.create('Score', {
	constructor: function(name) {
		this.player = null; // set from elsewhere
		this.game_id= 69;
		this.api_key= 6969;
		this.score= 0;
		this.player= null;
		this.combo_multiplier= 1.5; // how much to multiply the aggregated combo score
		this.combo_duration= 1000; // miliseconds. basically how long between events before no longer considered a combo
		this.events_since_last_check= []; 
		this.time_since_last_update= 0;
		this.event_happened_since_last_update= false;
		this.gui = null; // set from level
	},

	events: {
		'killedEnemy' : 10,
		'destroyShrine' : 200
	},
	
	update: function(dt, input) {
		if (this.time_since_last_update + dt > this.combo_duration / 1000) {
			if (this.event_happened_since_last_update) {
				// combo in progress, chill back. this will be flaky unless we store exactly what time the last event ocurred.
				this.time_since_last_update = 0;
			}
			else {
				// process those events and reset combo counter
				if (this.events_since_last_check.length != 0) {
					this.processEvents();
				}
				
				this.time_since_last_update = 0;
			}
			this.event_happened_since_last_update = false;
		} 
		else {
			this.time_since_last_update += dt;
		}
	},
	
	// right now lets just count events of the same type as comboable
	processEvents: function() {
		// keeps track of event names and counts
		// right now this is dumb. if K K D K K events happen, it should be 2K 1D 2K combos. instead will count 4Ks 1D
		// will fix if we ever need to
		var comboEvents = {};
		
		var amount = 0; // this is now just the combo bonus
		
		var combo = false;
		
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
				var pre_bonus = value * count;
				var post_bonus = pre_bonus * this.combo_multiplier;
				amount += post_bonus - pre_bonus; // we only want to add the bonus amount here
				combo = true;
			}
		}
		this.incrementScore(amount);
		this.events_since_last_check.length = 0; // Boom, Roasted
		
		if (combo) {
			var scoreDisplayEntity = new Juicy.Entity(this.entity.scene, ['ScoreDisplay']);
			var scoreDisplayComponent = scoreDisplayEntity.getComponent('ScoreDisplay');
			this.entity.scene.objects.push(scoreDisplayEntity); // lets display those dank points
			scoreDisplayComponent.setText('Combo! +' + amount);
			scoreDisplayComponent.setPosition(0, 0, true);
		}
	},

	// all you do is call this, the rest is black magic
	eventOccurred: function(eventName) {
		this.events_since_last_check.push(eventName);
		this.event_happened_since_last_update = true;
		
		this.incrementScore(this.events[eventName]);
		// we want to update gui for cool FX when an enemy is killed, so call that directly here
		// flash the amount of points gained'
		//this.gui.setFlash(this.events[eventName]); // yeahhh we should cache this and not repeat the lookup every time lol
	},
	
	setGui: function(gui) {
		this.gui = gui;
	},
	
	setName: function(name) {
		this.name = name;
		// update the gui too
		this.gui.setName(name);
	},

	// will hit api
	submitScore: function() {
		var self = this;
		// we cached these in window on login lol
		self.name = window.name;
		self.token = window.token;
		
		GJAPI.request('scores/add', {
			score: self.score,
			sort: self.score,
			username: self.name,
			user_token: self.token,
			extra_data: self.extra_data
		}, function(data) {
			console.log(data);
		});
	},

	incrementScore: function(score) {
		this.score += score;
		
		if (this.score < 0) {
			this.score = 0;
		}
		
		this.gui.updateScore(this.score);
	},

});
