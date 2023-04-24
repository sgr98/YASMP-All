const getPortIndex = (port) => {
    let prt = port;
    if (typeof port === 'string') prt = parseInt(port);
    const ind = prt % 1000;
    return ind;
};

const getJsonPort = (port, mul = 3) => {
    const ind = getPortIndex(port);
    return String(mul * 1000 + ind);
};

const getSendURL = (domain, port, options = []) => {
    let url = domain + ':' + port + '/';
    for (let option of options) {
        url += option + '/';
    }
    return url;
};

const getUserIndex = (userName) => {
    const digits = new RegExp('[0-9]+', 'g');
    const userInd = userName.match(digits);
    return parseInt(userInd[0]);
};

const getGroupContacts = (group_name, users) => {
    let group = {};
    users.map((val, ind, arr) => {
        if (val.name === group_name) group = val;
    });
    const contactPorts = group.port;
    return contactPorts;
};

exports.getPortIndex = getPortIndex;
exports.getJsonPort = getJsonPort;
exports.getSendURL = getSendURL;
exports.getUserIndex = getUserIndex;
exports.getGroupContacts = getGroupContacts;
