import fs from 'fs';

const filePath = 'config/index.js';
const content = fs.readFileSync(filePath, 'utf8');

const sensitivePatterns = [
  'baseURL', 
	'key'
];

for (const pattern of sensitivePatterns) {
  if (content.includes(pattern)) {
    console.error(`Error: Detected sensitive data in ${filePath}. Commit aborted.`);
    process.exit(1);
  }
}
