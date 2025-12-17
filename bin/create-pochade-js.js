#!/usr/bin/env node

/**
 * create-pochade-js
 * 
 * Creates a new Pochade-JS Node-RED project from the template.
 * 
 * Usage: npx create-pochade-js my-app
 * 
 * @module create-pochade-js
 */

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Creates a readline interface for user input
 * 
 * @returns {readline.Interface} The readline interface
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Prompts the user with a question and returns their answer
 * 
 * @param {readline.Interface} rl - The readline interface
 * @param {string} question - The question to ask
 * @param {string} defaultValue - Optional default value
 * @returns {Promise<string>} The user's answer
 */
function ask(rl, question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue
      ? `${question} (${defaultValue}): `
      : `${question}: `;

    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Prompts the user with a question and validates the answer
 * 
 * @param {readline.Interface} rl - The readline interface
 * @param {string} question - The question to ask
 * @param {function} validator - Function that returns true if valid, or a string error message
 * @param {string} defaultValue - Optional default value
 * @returns {Promise<string>} The user's answer
 */
async function askWithValidation(rl, question, validator, defaultValue = '') {
  while (true) {
    const answer = await ask(rl, question, defaultValue);
    const validation = validator(answer);
    if (validation === true) {
      return answer;
    }
    console.log(`❌ ${validation}`);
  }
}

/**
 * Validates a package/project name (URL-friendly, no spaces)
 * @param {string} name 
 * @returns {boolean|string}
 */
function validatePackageName(name) {
  if (!name) return "Name cannot be empty";
  if (!/^[a-z0-9-_]+$/.test(name)) {
    return "Name must only contain lowercase letters, numbers, hyphens, and underscores";
  }
  return true;
}

/**
 * Validates a node name (safe for filenames)
 * @param {string} name 
 * @returns {boolean|string}
 */
function validateNodeName(name) {
  if (!name) return "Name cannot be empty";
  if (!/^[a-z0-9-]+$/.test(name)) {
    return "Name must only contain lowercase letters, numbers, and hyphens";
  }
  return true;
}



/**
 * Collects project configuration from user input
 * 
 * @param {string} projectName - The project name
 * @returns {Promise<object>} Configuration object with all project details
 */
async function collectProjectInfo(projectName) {
  const rl = createReadlineInterface();

  const logo = ".-. .-. .-. . . .-. .-. .-.   . .-.\r\n|-\' | | |   |-| |-| |  )|-    | `-.\r\n\'   `-\' `-\' \' ` ` \' `-\' `-\' `-\' `-\'\r\n       Node-RED Plugins with Passion\r\n             By LNSY\r\n"
  console.log(logo);

  console.log('\n📝 Let\'s set up your Node-RED Plugin project!\n');

  // Default node name derived from project name
  const defaultNodeName = projectName.replace(/^node-red-contrib-/, '');

  const config = {
    project_name: projectName,
    project_description: await ask(rl, 'Project description', 'A Node-RED node'),
    node_sidebar_title: await ask(rl, 'Sidebar title (category)', 'function'),
    node_name: await askWithValidation(rl, 'Node name', validateNodeName, defaultNodeName),
    node_purpose: await ask(rl, 'Node purpose', 'Processes messages'),
    author_name: await ask(rl, 'Author name', ''),
    license: await ask(rl, 'License', 'MIT')
  };



  rl.close();

  return config;
}

/**
 * Replaces template variables in a file content
 * 
 * @param {string} content - The content with template variables
 * @param {object} config - Configuration object with values
 * @returns {string} Content with variables replaced
 */
function replaceTemplateVariables(content, config) {
  return content
    .replace(/\$\{\s*project_description\s*\}/g, config.project_description)
    .replace(/\$\{\s*node_sidebar_title\s*\}/g, config.node_sidebar_title)
    .replace(/\$\{\s*node_name\s*\}/g, config.node_name)
    .replace(/\$\{\s*node_purpose\s*\}/g, config.node_purpose);
}

/**
 * Recursively updates files in the project directory
 * 
 * @param {string} dir - Directory to process
 * @param {object} config - Configuration object
 */
function updateFiles(dir, config) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      updateFiles(filePath, config);
    } else {
      // Only process text files
      if (['.js', '.html', '.json', '.md'].includes(path.extname(file))) {
        let content = fs.readFileSync(filePath, 'utf-8');
        content = replaceTemplateVariables(content, config);
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    }
  }
}

/**
 * Main function to create a new Pochade-JS project
 * 
 * @returns {Promise<void>}
 */
async function createProject() {
  const projectName = process.argv[2];

  // Validate project name
  if (!projectName) {
    console.error('Error: Please specify the project name.');
    console.log('Usage: npx pochade-node-red <project-name>');
    process.exit(1);
  }

  const nameValidation = validatePackageName(projectName);
  if (nameValidation !== true) {
    console.error(`Error: Invalid project name "${projectName}".`);
    console.error(nameValidation);
    process.exit(1);
  }

  const currentDir = process.cwd();
  const projectDir = path.resolve(currentDir, projectName);

  if (fs.existsSync(projectDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  const config = await collectProjectInfo(projectName);

  console.log(`\n🚀 Creating a new Node-RED node in ${projectDir}...`);

  fs.mkdirSync(projectDir, { recursive: true });

  const templateDir = path.resolve(__dirname, '..', 'template');

  if (!fs.existsSync(templateDir)) {
    console.error('Error: Template directory not found.');
    process.exit(1);
  }

  // Copy template
  fs.cpSync(templateDir, projectDir, { recursive: true });

  // Rename dotfiles
  const dotfiles = [
    { from: 'gitignore', to: '.gitignore' },
    { from: 'npmignore', to: '.npmignore' }
  ];

  dotfiles.forEach(({ from, to }) => {
    const fromPath = path.join(projectDir, from);
    const toPath = path.join(projectDir, to);
    if (fs.existsSync(fromPath)) {
      fs.renameSync(fromPath, toPath);
    }
  });

  // Rename node files
  const srcDir = path.join(projectDir, 'src');
  if (fs.existsSync(srcDir)) {
    const nodeJsPath = path.join(srcDir, 'sample.js');
    const nodeHtmlPath = path.join(srcDir, 'sample.html');

    if (fs.existsSync(nodeJsPath)) {
      fs.renameSync(nodeJsPath, path.join(srcDir, `${config.node_name}.js`));
    }
    if (fs.existsSync(nodeHtmlPath)) {
      fs.renameSync(nodeHtmlPath, path.join(srcDir, `${config.node_name}.html`));
    }
  }

  // Update file contents
  updateFiles(projectDir, config);

  // Update package.json specifically
  const packageJsonPath = path.join(projectDir, 'package.json');
  const projectPackageJson = require(packageJsonPath);
  projectPackageJson.name = config.project_name;
  projectPackageJson.author = config.author_name;
  projectPackageJson.license = config.license;

  // Ensure the node-red section points to the correct file
  if (projectPackageJson['node-red'] && projectPackageJson['node-red'].nodes) {
    // Reconstruct the nodes object with the new key and value
    projectPackageJson['node-red'].nodes = {};
    projectPackageJson['node-red'].nodes[config.node_name] = `src/${config.node_name}.js`;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(projectPackageJson, null, 2));

  console.log('\n📦 Installing dependencies...');

  const installResult = spawn.sync('npm', ['install'], {
    cwd: projectDir,
    stdio: 'inherit'
  });

  if (installResult.status !== 0) {
    console.error('\n❌ Error: npm install failed.');
    process.exit(1);
  }

  console.log('\n✨ Success!');
  console.log(`\nTo get started:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm run install-plugin  # Installs this node to your local Node-RED`);
  console.log(`  npm run watch           # Develop with auto-restart`);
  console.log('\n🎨 Happy coding!');
}

createProject();
