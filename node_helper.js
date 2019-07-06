'use strict';

/* Magic Mirror
 * Module: MMM-Pins
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
import { discoverGateway, TradfriClient, Accessory, AccessoryTypes } from "node-tradfri-client";
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
			console.log("TRADFRI INIT FAILED")
		}
		self.gpio = []
		for (let index = 0; index < pinConfigs.length; ++index) {
			let pinConfig = pinConfigs[index];
          	self.gpio[String(pinConfig.pin)] = new Gpio(pinConfig.pin, pinConfig.direction);
		}
	  }
	  self.started = true;				
	}
    else if (notification === 'TOGGLE_PIN') {     
		let pinNumber = payload;	  
		let pin = self.gpio[String(pinNumber)];
		let value = pin.readSync();
		if (value !== 1) {
			value = 1;
		}
		else{
			value = 0;
		}
		pin.writeSync(value);
		console.log(`Pin ${pinNumber} switched to ${value}`);
    };
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