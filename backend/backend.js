var mysql = require('mysql');
var express = require('express');
var cors = require('cors');

var app = express();

// use it before all route definitions
app.use(cors({origin: '*'}));

var router = require('./router.js');


//both index.js and things.js should be in same directory
app.use('/api', router);
 
app.listen(8000);