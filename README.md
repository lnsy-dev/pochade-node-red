![Pochade Node-RED Splash Image](./pochade-js-logo.jpg)

# Pochade Node-RED
## For Writing Node-RED Plugins with Passion

Pochade Node-RED is a lightweight, opinionated generator for building Node-RED nodes (plugins) with modern standards but without the bloat. It sets up a clean, vanilla JavaScript environment so you can focus on writing the logic for your node.

## Features

- **Instant Scaffolding** - Generates a complete, ready-to-deploy Node-RED node project.
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

The CLI will guide you through setup with interactive prompts:

- **Project description** - What does your node do?
- **Sidebar title** - The category in the Node-RED palette (e.g., function, network).
- **Node name** - The internal and display name of your node.
- **Node purpose** - A brief description for the info tab.
- **Author info** - For package.json.

### What happens next?

Pochade Node-RED will:

1. Create your project directory.
2. Generate `package.json`, `src/node-name.js`, and `src/node-name.html`.
3. Configure everything with your provided details.
4. Install dependencies.

Then, you can start developing immediately:

```sh
cd my-node-red-plugin
```

---

## Development

### Installing to Local Node-RED

To test your node, you need to install it into your local Node-RED environment. We've included a handy script for this:

```sh
npm run install-plugin
```

This command acts as a shortcut for running `npm install <path-to-your-plugin>` inside your `~/.node-red` directory. 

After running this, **restart Node-RED** to see your new node in the palette.

### Watch Mode

If you are making frequent changes, you can use:

```sh
npm run watch
```

*Note: You will still need to restart Node-RED to apply changes to the HTML/JavaScript of the node definition, as Node-RED loads these at startup.*

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

## Publishing to npm

Your generated project is pre-configured for npm publishing.

1. **Verify metadata**: Check `package.json` to ensure version, author, and keywords are correct.
2. **Login**: `npm login`
3. **Publish**: `npm publish`

Once published, users can install your node via the Node-RED Palette Manager or by running `npm install your-package-name` in their Node-RED user directory.

---

## License

Unlicense (Public Domain)

---

## Contributing

Issues and pull requests welcome at [github.com/lnsy-dev/pochade-node-red](https://github.com/lnsy-dev/pochade-node-red)
