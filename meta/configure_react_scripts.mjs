import fs from 'fs/promises';

const readPackage = async (path) => {
    let extractedPackage = {};
    try {
        const data = await fs.readFile(path, 'utf8');
        extractedPackage = JSON.parse(data.toString());
        console.log('package.json successfully read');
    } catch (err) {
        if (err.code === 'ENOENT')
            console.error('ERROR READING: File does not exists:', path);
        else console.error('ERROR READING: Error reading file\n', err);
    }
    return extractedPackage;
};

const savePackage = async (obj, path) => {
    const data = JSON.stringify(obj);
    try {
        await fs.writeFile(path, data);
        console.log('package.json successfully written');
    } catch (error) {
        console.error('ERROR WRITING: Error writing file\n', error);
    }
};

const getJsonPort = (port, mul) => {
    const prt = parseInt(port);
    const ind = prt % 4000;
    return String(mul * 1000 + ind);
};

const addScripts = (extractedPackage, users) => {
    let { scripts } = extractedPackage;
    users.forEach((user, ind, arr) => {
        if (!user.isGroup) {
            // "u1json": "json-server --watch ./src/Data/User/User1/user.json --port 3001",
            const jsonStr = 'u' + (ind + 1) + 'json';
            const jsonScript =
                'json-server --watch ' +
                './src/Data/User/User' +
                String(ind + 1) +
                '/user.json --port ' +
                getJsonPort(user.port, 3);
            scripts[jsonStr] = jsonScript;

            // "u1start": "set PORT=4001 && react-scripts start",
            const userStr = 'u' + (ind + 1) + 'start';
            const userScript =
                'set PORT=' + user.port + ' && react-scripts start';
            scripts[userStr] = userScript;

            // "u1webstart": "webpack-dev-server --mode development --port 5001"
            const webUserStr = 'u' + (ind + 1) + 'webstart';
            const webUserScript =
                'webpack-dev-server --mode development --port ' +
                getJsonPort(user.port, 4);
            scripts[webUserStr] = webUserScript;

            // "u1all": "concurrently \"npm run u1start\" \"npm run u1json\""
            const userConcurrentlyStr = 'u' + (ind + 1) + 'all';
            const userConcurrentlyScript =
                'concurrently "npm run u' +
                (ind + 1) +
                'start" "npm run u' +
                (ind + 1) +
                'json"';
            scripts[userConcurrentlyStr] = userConcurrentlyScript;
        }
    });

    // "uconc": "concurrently \"npm run u1all\" \"npm run u2all\" ..."
    const userConcurrentStr = 'uconc';
    let userConcurrentScript = 'concurrently ';
    for (let i = 0; i < users.length; i++) {
        if (!users[i].isGroup)
            userConcurrentScript += '"npm run u' + (i + 1) + 'all" ';
    }
    scripts[userConcurrentStr] = userConcurrentScript.trim();

    extractedPackage.scripts = scripts;
    return extractedPackage;
};

const addScriptsServer = (extractedPackage, users) => {
    let { scripts } = extractedPackage;

    // "totaljson": "json-server --watch ./Data/total_sequence.json --port 8000",
    scripts['totaljson'] =
        'json-server --watch ./Data/total_sequence.json --port 8000';

    users.forEach((user, ind, arr) => {
        if (!user.isGroup) {
            // "u1server": "nodemon server.js 5001",
            const jsonStr = 'u' + (ind + 1) + 'server';
            const jsonScript = 'nodemon server.js ' + getJsonPort(user.port, 5);
            scripts[jsonStr] = jsonScript;
        }
    });

    // "uconc": "concurrently \"npm run u1server\" \"npm run u2server\" ..."
    const userConcurrentStr = 'uconc';
    let userConcurrentScript = 'concurrently "npm run totaljson" ';
    for (let i = 0; i < users.length; i++) {
        if (!users[i].isGroup)
            userConcurrentScript += '"npm run u' + (i + 1) + 'server" ';
    }
    scripts[userConcurrentStr] = userConcurrentScript.trim();

    extractedPackage.scripts = scripts;
    return extractedPackage;
};

export const addScriptsSavePackage = async (users, path, type = '') => {
    let extractedPackage = await readPackage(path);
    if (type === '') extractedPackage = addScripts(extractedPackage, users);
    else if (type === 'server')
        extractedPackage = addScriptsServer(extractedPackage, users);
    await savePackage(extractedPackage, path);
};
