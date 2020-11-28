const fileupload = require('express-fileupload');

const express = require("express");
const consign = require("consign");
const bodyParser = require('body-parser');
const helmet = require('helmet');
var cors = require('cors');
// const logger = require("./logger")();
// const helpers = require("./helpers");
// const expressValidator = require('express-validator');
const connectorSequelize = require('./core/sequelize')();

const app = express();
app.connector = connectorSequelize;
app.set('port', 8080);
app.env = process.env.NODE_ENV || 'local';
app.debug = process.env.NODE_DEBUG || false;
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }));
app.use(bodyParser.json({ limit: '1024mb' }));
app.use(require('method-override')());
app.use(cors());
app.use(helmet());
const port = process.env.PORT || "8000";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

consign({ cwd: 'app', verbose: false })
  .include("models")
  .then("controllers")
  .then("routes")
  .into(app);

app.use(cors());
app.use(fileupload());

// app.get("*", function(req, res){
//   res.write("I am here");
// })

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});