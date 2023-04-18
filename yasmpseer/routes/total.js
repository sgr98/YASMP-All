const express = require('express');
const fetch = require('node-fetch');
const USERS = require('./../Data/Registry/users.json');
const router = express.Router();

const URL = `http://localhost:8000/sequencer`;

const getTotalSequenceData = async () => {
    const totalSequenceRes = await fetch(URL);
    const totalSequenceData = await totalSequenceRes.json();
    const totalSequence = {
        sequencer: totalSequenceData,
    };
    return totalSequence;
};

// @route   GET /sequencer
// @desc    Get total_sequence.json object
router.get('/', async (req, res) => {
    try {
        const totalSequence = await getTotalSequenceData();
        res.json(totalSequence);
    } catch (err) {
        const issue = 'Server Problem while fetching total sequence object.';
        console.log(err);
        console.log(issue);
        res.status(500).json({ success: false, message: issue });
    }
});


module.exports = router;