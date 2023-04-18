const {
    ORDERING_FIFO,
    ORDERING_CAUSAL,
    ORDERING_TOTAL,
    ORDERING_TF,
    ORDERING_TC,
} = require('./../constants.js');
const { getUserIndex } = require('./../utils.js');

const conditionFIFO = (ind, vClockUser, vClockMessage) => {
    return vClockUser[ind] + 1 === vClockMessage[ind];
};

const conditionCausal = (ind, vClockUser, vClockMessage) => {
    const cond1 = vClockMessage[ind] === vClockUser[ind] + 1;
    const nUsers = vClockUser.length;
    let cond2 = true;
    for (let i = 0; i < nUsers; i++) {
        if (i !== ind) {
            if (!(vClockMessage[i] <= vClockUser[i])) {
                cond2 = false;
                break;
            }
        }
    }
    return cond1 && cond2;
};

const conditionTotal = (sequenceUser, sequenceMessage) => {
    return sequenceMessage === sequenceUser + 1;
};

// Any order (User.Conversations)
// {
//     data: [],
//     buffer: [],
//     vectorClock: defaultVectorClock,
// }

// Vector Clock (Message)
// {
//     fifo: [0, 0, 0, 0],
//     causal: [0, 0, 0, 0],
//     total: [0, 0, 0, 0],
// }

const resolveFIFO = (conversations, message) => {
    // Message decoding
    let fromInd = getUserIndex(message.from) - 1;
    let vClockMessage = message.vectorClock[ORDERING_FIFO];

    // Existing Convos
    const vClockUser = conversations.vectorClock;

    // Check whether current message is ok
    if (conditionFIFO(fromInd, vClockUser, vClockMessage)) {
        conversations.data.push(message);
        conversations.vectorClock[fromInd] += 1;
    } else conversations.buffer.push(message);

    // Check whether any buffered messages are eligble to be added to data
    let newBufferConvos = [];
    conversations.buffer.map((val, ind, arr) => {
        fromInd = getUserIndex(val.from) - 1;
        vClockMessage = val.vectorClock[ORDERING_FIFO];
        if (conditionFIFO(fromInd, vClockUser, vClockMessage)) {
            conversations.data.push(val);
            conversations.vectorClock[fromInd] += 1;
        } else {
            newBufferConvos.push(val);
        }
    });
    conversations.buffer = newBufferConvos;

    return conversations;
};

const resolveCausal = (conversations, message) => {
    // Message decoding
    let fromInd = getUserIndex(message.from) - 1;
    let vClockMessage = message.vectorClock[ORDERING_CAUSAL];

    // Existing Convos
    const vClockUser = conversations.vectorClock;

    // Check whether current message is ok
    if (conditionCausal(fromInd, vClockUser, vClockMessage)) {
        conversations.data.push(message);
        conversations.vectorClock[fromInd] = vClockMessage[fromInd];
    } else conversations.buffer.push(message);

    // Check whether any buffered messages are eligble to be added to data
    let newBufferConvos = [];
    conversations.buffer.map((val, ind, arr) => {
        fromInd = getUserIndex(val.from) - 1;
        vClockMessage = val.vectorClock[ORDERING_CAUSAL];
        if (conditionCausal(fromInd, vClockUser, vClockMessage)) {
            conversations.data.push(val);
            conversations.vectorClock[fromInd] = vClockMessage[fromInd];
        } else {
            newBufferConvos.push(val);
        }
    });
    conversations.buffer = newBufferConvos;

    return conversations;
};

// TODO: Total Ordering (all below)

const resolveTotal = (conversations, message) => {
    conversations.data.push(message);
    return conversations;
};

const resolveTotalFIFO = (conversations, message) => {
    conversations.data.push(message);
    return conversations;
};

const resolveTotalCausal = (conversations, message) => {
    conversations.data.push(message);
    return conversations;
};

module.exports = {
    resolveFIFO,
    resolveCausal,
    resolveTotal,
    resolveTotalFIFO,
    resolveTotalCausal,
};
