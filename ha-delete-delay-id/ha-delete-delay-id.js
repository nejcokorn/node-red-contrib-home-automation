module.exports = function(RED) {
	function DeleteDelayById(config) {
		RED.nodes.createNode(this, config);
		this.agent = config.agent;
		this.deviceId = config.deviceId;
		this.actionDelayId = config.actionDelayId;
		this.agentNode = RED.nodes.getNode(config.agent);

		this.on('input', async (msg, send, done) => {
			try {
				if (!this.agentNode) {
					return done(Error("Configure Home Automation agent."));
				}
				
				const response = await fetch(`${this.agentNode.url}/can/${this.agentNode.canbus}/device/${this.deviceId}/delay/${this.actionDelayId}`,
					{
						method: "DELETE"
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
	RED.nodes.registerType("ha-delete-delay-id", DeleteDelayById);
}