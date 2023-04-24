const axios = require('axios');

const {
    ORDERING_TOTAL,
    ORDERING_TF,
    ORDERING_TC,
} = require('./../constants.js');

const packSequencerResponse = (res) => {
    const packRes = {
        func: 'SEND_SEQUENCE',
        params: {
            sequenceRes: res,
        },
    };
    return packRes;
};

// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////
// EXPORTS ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////

const sequenceTotal = (totalSequence, message) => {
    // Vector Clock Logic
    // None required for simple Total

    // Sequencer Logic
    totalSequence.sequence += 1;

    // Response packing
    const resTotalSequenceElem = {
        message_id: message.message_id,
        to: message.to,
        sequence: totalSequence.sequence,
        vectorClock: message.vectorClock[ORDERING_TOTAL],
        type: ORDERING_TOTAL,
    };

    // Return object
    let res = {
        tosend: [],
        totalseq: {},
    };
    res.tosend.push(resTotalSequenceElem);
    res.totalseq = totalSequence;
    return res;
};

// TODO
const sequenceTotalFIFO = (totalSequence, message) => {
    // Vector Clock Logic

    // Sequencer Logic
    totalSequence.sequence += 1;

    // Response packing
    const resTotalSequenceElem = {
        message_id: message.message_id,
        to: message.to,
        sequence: totalSequence.sequence,
        vectorClock: message.vectorClock[ORDERING_TF],
        type: ORDERING_TF,
    };

    // Return object
    let res = {
        tosend: [],
        totalseq: {},
    };
    res.tosend.push(resTotalSequenceElem);
    res.totalseq = totalSequence;
    return res;
};

// TODO
const sequenceTotalCausal = (totalSequence, message) => {
    // Vector Clock Logic

    // Sequencer Logic
    totalSequence.sequence += 1;

    // Response packing
    const resTotalSequenceElem = {
        message_id: message.message_id,
        to: message.to,
        sequence: totalSequence.sequence,
        vectorClock: message.vectorClock[ORDERING_TC],
        type: ORDERING_TC,
    };

    // Return object
    let res = {
        tosend: [],
        totalseq: {},
    };
    res.tosend.push(resTotalSequenceElem);
    res.totalseq = totalSequence;
    return res;
};

const sendResponse = async (res, url) => {
    const packRes = packSequencerResponse(res);
    const API = axios.create({ baseURL: url });
    const postMessageAPI = (resBody) => API.post('/listener', resBody);
    await postMessageAPI(packRes);
};

module.exports = {
    sequenceTotal,
    sequenceTotalFIFO,
    sequenceTotalCausal,
    sendResponse,
};
