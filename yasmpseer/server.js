const express = require('express');
const cors = require('cors');
const { getPortIndex, getJsonPort, getSendURL } = require('./utils');
const { LEADER_INDEX } = require('./constants');

const app = express();

// TODO: Remove cors
// const corsOptions = {
//     origin: '*',
//     'Access-Control-Allow-Origin': 'http://localhost:4001',
//     'Access-Control-Allow-Credentials': 'true',
//     optionsSuccessStatus: 200,
//     credentials: true, //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
//     allowedHeaders: [
//         'Content-Type',
//         'Origin',
//         'X-Requested-With',
//         'Accept',
//         'x-client-key',
//         'x-client-token',
//         'x-client-secret',
//         'Authorization',
//     ],
// };

// Express Parser Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions));
app.use(cors());

// Port to listen to
const port = parseInt(process.argv[2]) || 5000;
console.log('PORT:', port);
const portIndex = getPortIndex(port);

// JSON server link
const jsonServerURL = getSendURL('http://localhost', getJsonPort(port));
console.log('URL:', jsonServerURL);

// Use Routes
app.get('/', (req, res) => {
    res.send(
        `Hello to YASMP USER server; Currently listening to ${jsonServerURL}.
        You are currently looking at the server for User ${String(portIndex)}.`
    );
});
app.use('/listener', require(`./routes/user${String(portIndex)}`));

// TODO: Inside the routes/total.js file
const leaderInd = parseInt(getJsonPort(LEADER_INDEX, mul = 5));
if (port === leaderInd) {
    console.log("Leader API Handler attached")
    app.use('/sequencer', require(`./routes/total`));
}

app.listen(port, () =>
    console.log(
        `Server started on url ${getSendURL(
            'http://localhost',
            getJsonPort(port, 5)
        )}`
    )
);
