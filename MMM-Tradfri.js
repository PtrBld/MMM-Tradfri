/* global Module */

/* Magic Mirror
 * Module: MMM-Tradfri
 *
 * MIT Licensed.
 */

Module.register('MMM-Tradfri',{	
	requiresVersion: "2.1.0",
	defaults: {
		securityCode: ""		
	},	
	
	// Override notification handler.
	notificationReceived: function(notification, payload) {
		if(notification === "ALL_MODULES_STARTED"){
			this.sendSocketNotification('TRADFRI_CONFIG', this.config)
			return;
		}
		if(notification === "REGISTER_BULB"){
			this.bulbs.push(payload);
			return;
		}
		if(notification === "TOGGLE_BULB"){
			this.sendSocketNotification('TOGGLE_BULB', payload)
			return;
		}
	},

	getDom: function() {
        var wrapper = document.createElement("div");
		wrapper.innerHTML = "";
		this.bulbs.forEach((item) => {
			console.error(item);
			wrapper.innerHTML += item + ", ";
		});
		wrapper.className = "bright";
		return wrapper;
    },

	start: function() {
		Log.info('Starting module: ' + this.name);
		this.bulbs = [];
	}
});
