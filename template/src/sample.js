module.exports = function (RED) {
    console.log("Loading node-red-contrib-${node_name}...");
    function NodeRedNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            node.send(msg);
        });
    }
    RED.nodes.registerType("${node_name}", NodeRedNode);
}
