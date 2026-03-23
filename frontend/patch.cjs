const fs = require('fs');
const path = require('path');

const baseDir = 'node_modules/@aws-amplify/ui-react/node_modules/@aws-amplify/ui/dist/esm/machines/authenticator';

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix any xstate v4 named imports
  content = content.replace(
    /import\s*{([^}]*)}\s*from\s*'xstate'/g,
    "import * as _xstate from 'xstate'; const {$1} = _xstate"
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Patched:', filePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.mjs')) {
      patchFile(fullPath);
    }
  });
}

walkDir(baseDir);
console.log('Done patching!');