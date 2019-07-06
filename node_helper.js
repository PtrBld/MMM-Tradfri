'use strict';

/* Magic Mirror
 * Module: MMM-Pins
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const tradfriLib = require("node-tradfri-client");
// for normal usage:
const TradfriClient = tradfriLib.TradfriClient;
const AccessoryTypes = tradfriLib.AccessoryTypes;
const Accessory = tradfriLib.Accessory;
// for discovery:
const discoverGateway = tradfriLib.discoverGateway;
const lightbulbs = {};
module.exports = NodeHelper.create({
  start: function () {
        this.started = false;
},

  socketNotificationReceived: async function(notification, payload) {
	const self = this
    if (notification === 'TRADFRI_CONFIG' && self.started === false) {
	  const result = await discoverGateway();
	  if (result) {
		const tradfri = new TradfriClient(result.name);
		try {
			const {identity, psk} = await tradfri.authenticate(payload.securityCode);
			console.error("" + identity + " : " +psk);
			await tradfri.connect(identity, psk);
			tradfri.on("device updated", tradfri_deviceUpdated)
    		.on("device removed", tradfri_deviceRemoved)
    		.observeDevices();
		} catch (e) {
			// handle error - see below for details
			console.log("TRADFRI INIT FAILED");
		}
	}
	}
  }
});
  	
function tradfri_deviceUpdated(device) {
	if (device.type === AccessoryTypes.lightbulb) {
		// remember it
		lightbulbs[device.instanceId] = device;
		device.lightset[0].toggle();
	}
}

function tradfri_deviceRemoved(instanceId) {
	// clean up
}