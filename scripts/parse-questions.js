import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

console.log(chalk.cyanBright('Processing...'));

const content = readFileSync('data/questions.txt', 'utf8');
const values = content.split('\n');

writeFileSync('data/questions.json', JSON.stringify(values, null, 2));

const itemCount = values.length;
console.log(chalk.greenBright(`Processed ${itemCount} items successfully!`));
