var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');
var cors = require("cors");
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var quotesRouter = require('./routes/quotes');

var app = express();

// { origin: ["http://localhost:3001"], credentials: true}

app.use(cors({ origin: ["http://localhost:3001"], credentials: true}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotes', quotesRouter);

// Add this code above the module.exports
models.sequelize.sync().then(function () {
    console.log("DB Sync'd up")
});

module.exports = app;
