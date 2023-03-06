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

exports.getPortIndex = getPortIndex;
exports.getJsonPort = getJsonPort;
exports.getSendURL = getSendURL;
