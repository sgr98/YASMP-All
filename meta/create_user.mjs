import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const readUsers = async (path) => {
    let users = [];
    try {
        const data = await fs.readFile(path, 'utf8');
        users = JSON.parse(data.toString());
        console.log('Users are successfully read');
    } catch (err) {
        if (err.code === "ENOENT")
            console.error("ERROR READING: File does not exists:", path);
        else
            console.error('ERROR READING: Error reading file\n', err);
    }
    return users;
};

const saveUsers = async (obj, path) => {
    const data = JSON.stringify(obj);
    try {
        await fs.writeFile(path, data);
        console.log('Users are successfully written');
    } catch (error) {
        console.error('ERROR WRITING: Error writing file\n', error);
    }
};

const containsUser = (users, user_name) => {
    if (users === undefined) return false;
    return users.some((val, ind, arr) => {
        return val.name === user_name;
    });
};

const createUser = (user_name, port_num, isGroup) => {
    let user = {
        id: uuidv4(),
        name: user_name,
        port: port_num,
        ip: '0.0.0.0',
        isGroup: isGroup,
    };
    return user;
};

export const addUsers = async (users, path) => {
    let objUsers = await readUsers(path);
    // console.log('objUsers', objUsers);
    users.forEach((user) => {
        const { user_name, port, isGroup } = user;
        if (!containsUser(objUsers, user_name)) {
            const objUser = createUser(user_name, port, isGroup);
            objUsers.push(objUser);
        }
    });
    // console.log('objUsers populated', objUsers);
    saveUsers(objUsers, path);
};

export const getUserInfo = async (user_name, path) => {
    const allUsers = await readUsers(path);
    const user = allUsers.filter((val, ind, arr) => {
        return user_name === val.name;
    });
    return user[0];
};

export const getContactsList = async (user_name, path) => {
    const allUsers = await readUsers(path);
    const contactList = allUsers.filter((val, ind, arr) => {
        return user_name !== val.name;
    });
    return contactList;
};
