const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

server.use(cors(corsOptions));
server.get('/', (req, res) => res.send('Hello World!'))
server.use(bodyParser.json());

server.route('/api/cats').get((req, res) => {
    const requestedCatName = req.params['name'];
    res.send({
        name: requestedCatName
    });
});

server.route('/api/cats').post((req, res) => {
  res.send(201, req.body);
});

server.listen(8000, () => {
    console.log('Server started on 8000!');
});