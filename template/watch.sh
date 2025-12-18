#!/bin/bash

# Function to cleanup on exit
cleanup() {
    echo "Stopping Node-RED..."
    pkill -f 'node-red' 2>/dev/null || true
    exit 0
}

# Trap signals to cleanup
trap cleanup SIGINT SIGTERM

# Initial plugin install
echo "Installing plugin..."
npm run install-plugin

# Start Node-RED in background
echo "Starting Node-RED..."
node-red -u $HOME/.node-red &
NODE_RED_PID=$!

echo "Watching for changes... (Press Ctrl+C to stop)"

# Get initial checksum
get_checksum() {
    find src/ -name "*.js" -o -name "*.html" | xargs md5sum 2>/dev/null | md5sum
}

LAST_CHECKSUM=$(get_checksum)

# Watch for changes
while true; do
    sleep 2
    CURRENT_CHECKSUM=$(get_checksum)
    
    if [ "$CURRENT_CHECKSUM" != "$LAST_CHECKSUM" ]; then
        echo "Changes detected, restarting..."
        
        # Stop Node-RED
        kill $NODE_RED_PID 2>/dev/null || true
        wait $NODE_RED_PID 2>/dev/null || true
        
        # Reinstall plugin
        echo "Reinstalling plugin..."
        npm run install-plugin
        
        # Restart Node-RED
        echo "Restarting Node-RED..."
        node-red -u $HOME/.node-red &
        NODE_RED_PID=$!
        
        LAST_CHECKSUM=$CURRENT_CHECKSUM
        echo "Node-RED restarted"
    fi
done
