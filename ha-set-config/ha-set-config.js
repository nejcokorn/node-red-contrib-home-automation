module.exports = function(RED) {
	function SetConfig(config) {
		RED.nodes.createNode(this, config);
		
		this.agent = config.agent;
		this.agentNode = RED.nodes.getNode(config.agent);
		this.inputPort = config.inputPort;
		this.debounce = config.debounce;
		this.doubleclick = config.doubleclick;
		this.bypassInstantly = config.bypassInstantly;
		this.bypassOnDisconnect = config.bypassOnDisconnect;

		this.on('input', async (msg, send, done) => {
			if (!(msg.payload instanceof Array)) {
				msg.payload = [];
			}
			try {
				if (!this.agentNode) {
					return done(Error("Configure Home Automation agent."));
				}
				
				const response = await fetch(`${this.agentNode.url}/can/${this.agentNode.canbus}/device/${this.deviceId}/config`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							inputPortIdx: this.inputPort && !Number.isNaN(Number(this.inputPort)) ? Number(this.inputPort) : 0,
							debounce: this.inputPortIdx && !Number.isNaN(Number(this.inputPortIdx)) ? Number(this.inputPortIdx) : 0,
							doubleclick: this.inputPortIdx && !Number.isNaN(Number(this.inputPortIdx)) ? Number(this.inputPortIdx) : 0,
							actions: msg.payload,
							bypassInstantly: this.bypassInstantly,
							bypassOnDisconnect: this.bypassOnDisconnect,
						})
					}
				);
				const json = await response.json();

				send({ payload: json.data });
			} catch (error) {
				done(error);
			}
		});
	}
	RED.nodes.registerType("ha-set-config", SetConfig);
}