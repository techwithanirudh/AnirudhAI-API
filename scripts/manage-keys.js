import fs from 'fs';
import readline from 'readline';
import crypto from 'crypto';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const loadKeys = () => {
    try {
        const data = fs.readFileSync('keys.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Error reading keys.json:'), error);
        return {};
    }
};

const getKeyById = (id, keys) => {
    return Object.keys(keys).find(key => keys[key].id === id);
};

const saveKeys = (keys) => {
    fs.writeFileSync('keys.json', JSON.stringify(keys, null, 2));
};

const getNextId = (keys) => {
    const ids = Object.values(keys).map(entry => parseInt(entry.id, 10));
    const maxId = Math.max(...ids, 0);
    return (maxId + 1).toString();
};

const generateKey = () => {
    return 'sk-' + crypto.randomBytes(16).toString('hex');
};

const addKey = (name) => {
    const keys = loadKeys();
    const id = getNextId(keys);
    const key = generateKey();
    keys[key] = { name, id, active: true };
    saveKeys(keys);
    console.log(chalk.green(`Key added successfully! Key: ${key}, ID: ${id}`));
};

const revokeKey = (input) => {
    const keys = loadKeys();
    const key = keys[input] ? input : getKeyById(input, keys);
    if (key) {
        delete keys[key];
        saveKeys(keys);
        console.log(chalk.green(`Key ${key} revoked successfully!`));
    } else {
        console.log(chalk.red(`No key or id found for ${input}.`));
    }
};

const disableKey = (input) => {
    const keys = loadKeys();
    const key = keys[input] ? input : getKeyById(input, keys);
    if (key) {
        keys[key].active = false;
        saveKeys(keys);
        console.log(chalk.green(`Key ${key} disabled successfully!`));
    } else {
        console.log(chalk.red(`No key or id found for ${input}.`));
    }
};

const renameKey = (input, newName) => {
    const keys = loadKeys();
    const key = keys[input] ? input : getKeyById(input, keys);
    if (key) {
        keys[key].name = newName;
        saveKeys(keys);
        console.log(chalk.green(`Key ${key} renamed to ${newName} successfully!`));
    } else {
        console.log(chalk.red(`No key or id found for ${input}.`));
    }
};

console.log(chalk.cyan('Welcome to Manage Keys for AnirudhGPT API'));
rl.question(chalk.yellow('Do you want to add, revoke, disable, or rename a key? '), (action) => {
    action = stripAnsi(action);
    switch (action.toLowerCase()) {
        case 'add':
            rl.question(chalk.yellow('Enter the name for the new key: '), (name) => {
                addKey(name);
                rl.close();
            });
            break;
        case 'revoke':
            rl.question(chalk.yellow('Enter the key or id to revoke: '), (input) => {
                revokeKey(input);
                rl.close();
            });
            break;
        case 'disable':
            rl.question(chalk.yellow('Enter the key or id to disable: '), (input) => {
                disableKey(input);
                rl.close();
            });
            break;
        case 'rename':
            rl.question(chalk.yellow('Enter the key or id to rename: '), (input) => {
                rl.question(chalk.yellow('Enter the new name: '), (newName) => {
                    renameKey(input, newName);
                    rl.close();
                });
            });
            break;
        default:
            console.log(chalk.red('Invalid action'));
            rl.close();
            break;
    }
});
