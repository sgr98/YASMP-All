import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

import { getUserInfo, getContactsList } from './create_user.mjs';
import {
    ORDERING_NO,
    ORDERING_FIFO,
    ORDERING_CAUSAL,
    ORDERING_TOTAL,
} from './constants.mjs';

const saveUserFile = async (obj, path, type) => {
    const data = JSON.stringify(obj);
    try {
        await fs.writeFile(path, data);
        console.log('User File successfully written');
    } catch (error) {
        console.error(
            'ERROR WRITING (' + type + '): Error writing file\n',
            error
        );
    }
};

const readUserFile = async (path, type) => {
    let userData;
    try {
        const data = await fs.readFile(path, 'utf8');
        userData = JSON.parse(data.toString());
        console.log('User space is successfully read');
    } catch (err) {
        console.error(
            'ERROR WRITING (' + type + '): Error reading file\n',
            err
        );
    }
    return userData;
};

const containsContact = (contacts, user_name) => {
    if (contacts === undefined) return false;
    return contacts.some((val, ind, arr) => {
        return val.name === user_name;
    });
};

const createContactList = (contactList, existingContactList) => {
    if (existingContactList === undefined) existingContactList = [];
    let newContactList = existingContactList;
    contactList.forEach((val, ind, arr) => {
        if (!containsContact(newContactList, val.name))
            newContactList.push(val);
    });
    return newContactList;
};

const containsUserSpace = (existingConvos, user_name) => {
    if (existingConvos === undefined) return false;
    return existingConvos.some((val, ind, arr) => {
        return val === user_name;
    });
};

const getDefaultGroupConversationObject = () => {
    let defaultGroupConversations = {};
    defaultGroupConversations[ORDERING_NO] = {
        data: [],
    };
    defaultGroupConversations[ORDERING_FIFO] = {
        data: [],
        buffer: [],
        vectorClock: [],
    };
    defaultGroupConversations[ORDERING_CAUSAL] = {
        data: [],
        buffer: [],
        vectorClock: [],
    };
    defaultGroupConversations[ORDERING_TOTAL] = {
        data: [],
    };
    return defaultGroupConversations;
};

const createUserSpace = (user, contactList, existingUserSpace) => {
    let defaultGroupConversations = getDefaultGroupConversationObject();

    if (existingUserSpace === undefined)
        existingUserSpace = { conversations: {} };

    const existingConvoNames = Object.keys(existingUserSpace.conversations);
    let userSpace = {
        about: user,
        contacts: contactList,
        conversations: existingUserSpace.conversations,
    };

    contactList.forEach((val, ind, arr) => {
        const { name, isGroup } = val;
        if (!containsUserSpace(existingConvoNames, name)) {
            if (!isGroup)
                userSpace.conversations[name] = [];
            else
                userSpace.conversations[name] = defaultGroupConversations;
        }
    });

    return userSpace;
};

export const addUserSpace = async (user_name, paths) => {
    const { regPath, dirPath } = paths;
    const contactListPath = dirPath + user_name + '/contacts.json';
    const userSpacePath = dirPath + user_name + '/user.json';

    const user = await getUserInfo(user_name, regPath);
    let contactList = await getContactsList(user_name, regPath);

    const existingContactList = await readUserFile(contactListPath, 'CONTACT');
    contactList = createContactList(contactList, existingContactList);

    const existingUserSpace = await readUserFile(userSpacePath, 'USER_SPACE');
    const userSpace = createUserSpace(user, contactList, existingUserSpace);

    saveUserFile(contactList, contactListPath, 'CONTACT');
    saveUserFile(userSpace, userSpacePath, 'USER_SPACE');
};

export const createDir = async (dirPath) => {
    try {
        await fs.mkdir(dirPath);
        console.log('Dir successfully created');
    } catch (err) {
        if (err.code === 'EEXIST') console.error('ERROR: Dir already exists');
        else if (err.code === 'ENOENT')
            console.error(
                'ERROR: Dir does not exists and encountered error creating it'
            );
        else console.error('ERROR: Error creating dir\n', err);
    }
};
