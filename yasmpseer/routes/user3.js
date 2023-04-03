const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const SELFPORT = '3003';
const URL = `http://localhost:${SELFPORT}/`;
const GROUP_CHAT = 'Group_Chat';

const getData = async () => {
    const aboutPath = URL + 'about';
    const contactsPath = URL + 'contacts';
    const conversationsPath = URL + 'conversations';

    const aboutRes = await fetch(aboutPath);
    const contactsRes = await fetch(contactsPath);
    const conversationsRes = await fetch(conversationsPath);

    const aboutData = await aboutRes.json();
    const contactsData = await contactsRes.json();
    const conversationsData = await conversationsRes.json();

    const userSpace = {
        about: aboutData,
        contacts: contactsData,
        conversations: conversationsData,
    };

    return userSpace;
};

const postDataRPC = async (message) => {
    const { from, to, isGroup } = message;

    message.datetime_receive = new Date();

    const userSpace = await getData();
    const userConversations = userSpace.conversations;
    if (isGroup) {
        userConversations[to].push(message);
    } else {
        userConversations[from].push(message);
    }

    try {
        const conversationsPath = URL + 'conversations';
        const res = await fetch(conversationsPath, {
            method: 'POST',
            body: JSON.stringify(userConversations),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        return {
            success: true,
            message: 'Message successfully posted.',
        };
    } catch (err) {
        const issue = 'Problem while posting data to conversations.';
        console.log(issue);
        return {
            success: false,
            message: issue,
        };
    }
};

// @route   GET /listener
// @desc    Get all user space details
router.get('/', async (req, res) => {
    try {
        const userSpace = await getData();
        res.json(userSpace);
    } catch (err) {
        const issue = 'Server Problem while fetching userspace.';
        console.log(err);
        console.log(issue);
        res.status(500).json({ success: false, message: issue });
    }
});

// @route   POST /listener
// @desc    Post a message in userspace
router.post('/', async (req, res) => {
    try {
        const { func, params } = req.body;

        let response;
        if (func === 'SEND_MESSAGE') {
            const message = params.message;
            response = await postDataRPC(message);
        }

        if (response.success) res.json(response);
        else res.status(500).json(response);
    } catch (err) {
        const issue = 'Server Problem while fetching userspace.';
        console.log(err);
        console.log(issue);
        res.status(500).json({ success: false, message: issue });
    }
});

module.exports = router;
