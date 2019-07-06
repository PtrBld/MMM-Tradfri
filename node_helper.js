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
	if (notification === 'TOGGLE_BULB' && self.started === true) {
		lightbulbs[payload].lightList[0].toggle();
	}
    if (notification === 'TRADFRI_CONFIG' && self.started === false) {
	  const result = await discoverGateway();
	  if (result) {
		const tradfri = new TradfriClient(result.name);
		try {
			const {identity, psk} = await tradfri.authenticate(payload.securityCode);
			console.error("" + identity + " : " +psk);
			await tradfri.connect(identity, psk);
			tradfri.on("device updated", (device) => {
				if (device.type === AccessoryTypes.lightbulb) {
					if(!(device.instanceId in lightbulbs)){
						lightbulbs[device.instanceId] = device;
						lightbulbs[device.instanceId].lightList[0].toggle();
						self.sendSocketNotification('REGISTER_BULB', device.instanceId);
					}}})
			.observeDevices();
			self.started = true;
		} catch (e) {
			// handle error - see below for details
			console.log("TRADFRI INIT FAILED");
		}
	}
	}
  }
});