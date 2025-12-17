# Node-RED Plugin Implementation Guide for AI Agents

This document provides a comprehensive guide for Large Language Models (LLMs) on how to implement Node-RED plugins (nodes).

## Project Structure

A Node-RED node module typically has the following structure:

```
package.json
nodes/
  <node-name>.js    # Runtime behavior
  <node-name>.html  # Editor UI and configuration
```

### package.json

The `package.json` must include a `node-red` section that maps node names to their JavaScript files.

```json
{
    "name": "node-red-contrib-example",
    "version": "1.0.0",
    "node-red": {
        "nodes": {
            "example-node": "nodes/example-node.js"
        }
    }
}
```

## JavaScript File (.js)

The JavaScript file defines the runtime behavior of the node. It must export a function that registers the node with the Node-RED runtime.

### Template

```javascript
module.exports = function(RED) {
    function ExampleNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        // Retrieve configuration values
        node.name = config.name;
        
        // Handle incoming messages
        node.on('input', function(msg, send, done) {
            // Process the message
            msg.payload = msg.payload.toLowerCase();
            
            // Send the message
            send(msg);
            
            // Signal completion
            if (done) {
                done();
            }
        });
        
        // Clean up on close
        node.on('close', function() {
            // Cleanup logic
        });
    }
    
    // Register the node type
    RED.nodes.registerType("example-node", ExampleNode);
}
```

### Key Concepts

- **RED.nodes.createNode(this, config)**: Initializes the node instance.
- **this.on('input', ...)**: Listener for incoming messages.
- **send(msg)**: Sends a message to the next node(s). Configurable to support multiple outputs.
- **done()**: Callback to signal that processing is complete (for pre-1.0 compatibility loops).

## HTML File (.html)

The HTML file defines the node's appearance in the Node-RED editor, its configuration dialog, and its help text. It contains three script blocks.

### Template

```html
<!-- Registration and Configuration -->
<script type="text/javascript">
    RED.nodes.registerType('example-node', {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            property: { value: "payload", required: true }
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function() {
            return this.name || "example node";
        }
    });
</script>

<!-- Edit Dialog -->
<script type="text/html" data-template-name="example-node">
    <div class="form-row">
        <label for="node-input-name"><i class="fa fa-tag"></i> Name</label>
        <input type="text" id="node-input-name" placeholder="Name">
    </div>
    <div class="form-row">
        <label for="node-input-property"><i class="fa fa-edit"></i> Property</label>
        <input type="text" id="node-input-property">
    </div>
</script>

<!-- Help Text -->
<script type="text/html" data-help-name="example-node">
    <p>A simple node that converts payload to lowercase.</p>
</script>
```

### Key Concepts

- **category**: The palette category (e.g., 'input', 'output', 'function', or custom).
- **defaults**: Defines the configuration properties that are saved and restored.
- **data-template-name**: Must match the registered type name.
- **data-help-name**: Must match the registered type name.

## Best Practices

1.  **Error Handling**: Use `node.error("message", msg)` to log errors.
2.  **Status**: Use `node.status({fill:"red",shape:"ring",text:"disconnected"})` to show status in the editor.
3.  **Context**: Use `node.context()`, `flow.context()`, or `global.context()` to store state.
4.  **Dependencies**: Declare any external libraries in `package.json`.

## Development Cycle

1.  **Install**: `npm install` in your node directory.
2.  **Link**: `npm link` (or `npm install . -g`) to make it available to Node-RED.
3.  **Restart**: Restart Node-RED to load changes.
