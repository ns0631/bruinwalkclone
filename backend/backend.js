var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser'); 

var app = express(); // Instantiate an express app
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// use it before all route definitions
app.use(cors({origin: '*'}));

var router = require('./router.js');


//both index.js and things.js should be in same directory
app.use('/api', router);
 
app.listen(8000);