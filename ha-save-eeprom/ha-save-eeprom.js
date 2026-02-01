module.exports = function(RED) {
	function SaveEEPROM(config) {
		RED.nodes.createNode(this, config);
		this.agent = config.agent;
		this.deviceId = config.deviceId;
		this.actionType = config.actionType;
		this.actionPort = config.actionPort;
		this.actionDelay = config.actionDelay;
		this.agentNode = RED.nodes.getNode(config.agent);

		this.on('input', async (msg, send, done) => {
			try {
				if (!this.agentNode) {
					return done(Error("Configure Home Automation agent."));
				}

				const response = await fetch(`${this.agentNode.url}/can/${this.agentNode.canbus}/device/${this.deviceId}/eeprom`,
					{
						method: "POST"
					}
				);
				const json = await response.json();
				if (json.success == true) {
					send({ payload: json.data });
				} else {
					done(json.error);
				}
			} catch (error) {
				done(error);
			}
		});
	}
	RED.nodes.registerType("ha-save-eeprom", SaveEEPROM);
}