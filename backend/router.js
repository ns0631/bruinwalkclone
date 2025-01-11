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

router.post('/search', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.text){
        let query = "SELECT * FROM classes where name like '%" + obj.text + "%' ORDER BY name;";
        con.query(query, function (err, result, fields) {
        if (err) throw err;
        const jsonifiedResult = JSON.parse(JSON.stringify(result));
        console.log(jsonifiedResult);
        res.send(jsonifiedResult);
        });
    }
});

//export this router to use in our index.js
module.exports = router;