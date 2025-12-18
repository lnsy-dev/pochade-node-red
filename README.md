![Pochade Node-RED Splash Image](./pochade-js-logo.jpg)

# Pochade Node-RED
## For Writing Node-RED Plugins with Passion

Pochade Node-RED is a lightweight, opinionated generator for building Node-RED nodes (plugins) with modern standards but without the bloat. It sets up a clean, vanilla JavaScript environment so you can focus on writing the logic for your node.

## Features

- **Instant Scaffolding** - Generates a complete, ready-to-deploy Node-RED node project.
- **Auto Reload and Install** - Work in the nodes home directory, our watch script auto-installs and auto-reloads node-red when you make changes in the folder.
- **Interactive Setup** - easy-to-use CLI questionnaire to configure your node.
- **Vanilla JS** - No complex build pipelines by default, just standard Node.js and HTML.
- **Developer Experience** - Includes helper scripts to easily install your plugin into your local Node-RED instance for testing.
- **AI Ready** - Includes documentation to help AI assistants (`LLM.md`, `AGENTS.md`) understand your project structure.

---

## Quick Start

Create a new Node-RED node project with a single command:

```sh
npx pochade-node-red my-node-red-plugin
```

cd into the new directory. 

### Installing to Local Node-RED

To test your node, you need to install it into your local Node-RED environment. We've included a handy script for this:

```sh
npm run install-plugin
```

### Watch Mode

If you are making frequent changes, you can use:

```sh
npm run watch
```

This will start node-red and on every text change will re-install the plugin to the ~/.node-red node_modules directory and restart node-red. 

---

## Project Structure

```
my-node-red-plugin/
├── src/
│   ├── my-node.js         # The Node.js runtime logic
│   └── my-node.html       # The Editor UI and help text
├── bin/                   # Utility scripts
├── package.json           # Node-RED module metadata
└── README.md              # Documentation for your user
```

---

## License

Unlicense (Public Domain)

---

## Contributing

Issues and pull requests welcome at [github.com/lnsy-dev/pochade-node-red](https://github.com/lnsy-dev/pochade-node-red)
