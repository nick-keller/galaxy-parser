var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var init = require('./init/env');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

init(app);

module.exports = app;