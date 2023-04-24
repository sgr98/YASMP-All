const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const USERS = require('./../Data/Registry/users.json');
const {
    ORDERING_TOTAL,
    ORDERING_TF,
    ORDERING_TC,
} = require('./../constants.js');
const {
    sequenceTotal,
    sequenceTotalFIFO,
    sequenceTotalCausal,
    sendResponse,
} = require('./total_utils.js');
const { getSendURL, getJsonPort, getGroupContacts } = require('./../utils.js');

const DOMAIN = `http://localhost`;
const PORT = `8000`;
const PATH = `sequencer`;
const SEQUENCER_URL = getSendURL(DOMAIN, PORT, [PATH]);

const getTotalSequenceData = async () => {
    const totalSequenceRes = await fetch(SEQUENCER_URL);
    const totalSequenceData = await totalSequenceRes.json();
    // const totalSequence = {
    //     sequencer: totalSequenceData,
    // };
    return totalSequenceData;
};

const updateTotalSequenceData = async (message) => {
    const { to } = message;
    const contactPorts = getGroupContacts(to, USERS);
    const totalSequence = await getTotalSequenceData();

    // Total
    console.log(totalSequence[ORDERING_TOTAL])
    res = sequenceTotal(totalSequence[ORDERING_TOTAL], message);
    totalSequence[ORDERING_TOTAL] = res.totalseq;

    // TODO: Send data to contact ports (for Total)
    res.tosend.map(async (val, ind, arr) => {
        contactPorts.map(async (port) => {
            const rport = getJsonPort(port, 5);
            const url = getSendURL(DOMAIN, rport);
            await sendResponse(val, url);
        });
    });

    // ////////////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////
    // TODO: Total FIFO ///////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////
    // TODO: Total Causal /////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////

    try {
        const res = await fetch(SEQUENCER_URL, {
            method: 'POST',
            body: JSON.stringify(totalSequence),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        return {
            success: true,
            message: 'Sequencer successfully updated.',
        };
    } catch (err) {
        const issue = 'Problem while updating or handling sequencing.';
        console.log(issue);
        return {
            success: false,
            message: issue,
        };
    }
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

// @route   POST /sequencer
// @desc    Update sequence for incoming message and broadcast sequence
router.post('/', async (req, res) => {
    try {
        console.log("Inside routes/total.js/router.post()")
        const { func, params } = req.body;

        let response;
        if (func === 'BROADCAST_SEQUENCE') {
            const message = params.message;
            response = await updateTotalSequenceData(message);
        }

        if (response.success) res.json(response);
        else res.status(500).json(response);
    } catch (err) {
        const issue =
            'Server Problem while fetching and updating total sequence.';
        console.log(err);
        console.log(issue);
        res.status(500).json({ success: false, message: issue });
    }
});

module.exports = router;
