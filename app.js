var express = require("express");
var multer = require("multer");
var app = express();
var path = require("path");
var uuid = require("uuid");

// Allow cross origin resource sharing (CORS) within our application
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});
app.use(express.static(__dirname + '/uploads'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + path.extname(file.originalname));
  }
})

var upload = multer({
  storage: storage
})

// "files" should be the same name as what's coming from the field name on the client side.
app.post("/upload", upload.array("photo", 12), function (req, res) {
  res.send(req.files);
  console.log("files = ", req.files);
});

var server = app.listen(3000, function () {
  console.log("Listening on port %s...", server.address().port);
});
