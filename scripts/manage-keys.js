import fs from 'fs';
import readline from 'readline';
import crypto from 'crypto';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const clearConsole = () => {
    console.clear();
};

const loadKeys = () => {
    try {
        const data = fs.readFileSync('keys.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Error reading keys.json:'), error);
        return {};
    }
};

const saveKeys = (keys) => {
    fs.writeFileSync('keys.json', JSON.stringify(keys, null, 2));
};

const orderKeysById = (keys) => {
    const sortedEntries = Object.entries(keys).sort((a, b) => parseInt(a[1].id, 10) - parseInt(b[1].id, 10));
    const reorderedKeys = {};
    for (const [key, value] of sortedEntries) {
        reorderedKeys[key] = value;
    }
    return reorderedKeys;
};

const cleanupKeys = (keys) => {
    keys = orderKeysById(keys);
    let idCounter = 1;
    for (const key in keys) {
        keys[key].id = idCounter.toString();
        idCounter++;
    }
    return keys;
};

const getKeyById = (id, keys) => {
    return Object.keys(keys).find(key => keys[key].id === id);
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
    let keys = loadKeys();
    const id = getNextId(keys);
    const key = generateKey();
    keys[key] = { name, id, active: true };
    keys = cleanupKeys(keys);
    saveKeys(keys);
    console.log(chalk.green(`Key added successfully! Key: ${key}, ID: ${id}`));
    askToContinue();
};

const deleteKey = (input) => {
    let keys = loadKeys();
    const key = keys[input] ? input : getKeyById(input, keys);
    if (key) {
        delete keys[key];
        keys = cleanupKeys(keys);  // Reorder the IDs after a key has been deleted
        saveKeys(keys);
        console.log(chalk.green(`Key ${key} deleted successfully!`));
    } else {
        console.log(chalk.red(`No key or id found for ${input}.`));
    }
    askToContinue();
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
    askToContinue();
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
    askToContinue();
};

const regenerateKey = (input) => {
    let keys = loadKeys();
    const key = keys[input] ? input : getKeyById(input, keys);
    if (key) {
        const oldKeyData = keys[key];
        const newKey = generateKey();
        keys[newKey] = oldKeyData;
        delete keys[key];
        keys = cleanupKeys(keys);
        saveKeys(keys);
        console.log(chalk.green(`Key ${key} regenerated successfully to ${newKey}!`));
    } else {
        console.log(chalk.red(`No key or id found for ${input}.`));
    }
    askToContinue();
};

const listKeys = () => {
    const keys = loadKeys();
    if (Object.keys(keys).length === 0) {
        console.log(chalk.yellow('No keys found.'));
    } else {
        console.log(chalk.cyan('List of keys:'));
        for (const key in keys) {
            const { name, id, active } = keys[key];
            console.log(`${key} - Name: ${name}, ID: ${id}, Active: ${active ? 'Yes' : 'No'}`);
        }
    }
    askToContinue();
};

const showOptions = () => {
    console.log(chalk.cyan('Welcome to Manage Keys for AnirudhAI API'));
    console.log('1. Add key');
    console.log('2. Delete key');
    console.log('3. Disable key');
    console.log('4. Rename key');
    console.log('5. List keys');
    console.log('6. Regenerate key');
    rl.question(chalk.yellow('Select an option (1-6): '), handleOption);
};

const handleOption = (option) => {
    option = stripAnsi(option);
    switch (option) {
        case '1':
            rl.question(chalk.yellow('Enter the name for the new key: '), addKey);
            break;
        case '2':
            rl.question(chalk.yellow('Enter the key or id to delete: '), deleteKey);
            break;
        case '3':
            rl.question(chalk.yellow('Enter the key or id to disable: '), disableKey);
            break;
        case '4':
            rl.question(chalk.yellow('Enter the key or id to rename: '), (input) => {
                rl.question(chalk.yellow('Enter the new name: '), (newName) => {
                    renameKey(input, newName);
                });
            });
            break;
        case '5':
            listKeys();
            break;
        case '6':
            rl.question(chalk.yellow('Enter the key or id to regenerate: '), regenerateKey);
            break;
        default:
            console.log(chalk.red('Invalid option.'));
            askToContinue();
            break;
    }
};

const askToContinue = () => {
    rl.question(chalk.yellow('Are you done? (yes/no) '), (answer) => {
        if (answer.toLowerCase() === 'no') {
            clearConsole();
            showOptions();
        } else {
            console.log(chalk.green('Goodbye!'));
            rl.close();
        }
    });
};

showOptions();
