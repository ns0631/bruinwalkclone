var mysql = require('mysql');
var express = require('express');
const { json } = require('body-parser');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ibeattheamc10",
    database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
  });

var router = express.Router();

router.get('/search', function(req, res){
    console.log("here");
    if(req.query.text){
        console.log(req.query.text)
        let query = "SELECT * FROM classes where name like '%" + req.query.text + "%';";
        console.log(query);
        con.query(query, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log("Length: " + result.length)
        const jsonifiedResult = JSON.stringify(result);
        console.log(jsonifiedResult);
        res.send(jsonifiedResult);
        });
    }
});

//export this router to use in our index.js
module.exports = router;