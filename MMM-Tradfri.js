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
	},
	
	start: function() {
		Log.info('Starting module: ' + this.name);
	}
});
