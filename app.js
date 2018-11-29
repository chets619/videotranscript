const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = express();
const multer = require('multer');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
var DIR = './uploads/';

var upload = multer({
  dest: DIR
}).single('photo');

server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(cors(corsOptions));
server.get('/', function (req, res, next) {
  // render the index page, and pass data to it.
  //   res.render('app', {
  //     title: 'Express'
  //   });

  var json_data = {
    "name": "123",
    "pass": "12345"
  };
  res.json(json_data);
});
server.use(bodyParser.json());

server.post('/', function (req, res, next) {
  var path = '';
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured")
    }
    // No error occured.
    path = req.file.path;
    return res.send("Upload Completed for " + path);
  });
})

server.listen(8000, () => {
  console.log('Server started on 8000!');
});

module.exports = server;
