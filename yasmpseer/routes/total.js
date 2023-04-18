const express = require('express');
const fetch = require('node-fetch');
const USERS = require('./../Data/Registry/users.json');
const router = express.Router();

const URL = `http://localhost:6000/sequencer`;

const getTotalSequenceData = async () => {
    const totalSequenceRes = await fetch(URL);
    const totalSequenceData = await totalSequenceRes.json();
    const totalSequence = {
        sequencer: totalSequenceData,
    };
    return totalSequence;
};