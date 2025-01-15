var mysql = require('mysql');
var express = require('express');
var nodemailer = require('nodemailer');

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

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nickcrumpet.litty@gmail.com',
      pass: 'erwi olpe bsvi hcuy'
    }
  });  

var router = express.Router();

router.post('/search', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.text){
        let query = "SELECT * FROM classes where name like '%" + obj.text + "%' UNION SELECT * FROM professors where name like '%" + obj.text + "%' ORDER BY name;";
        con.query(query, function (err, result, fields) {
        if (err) throw err;
        const jsonifiedResult = JSON.parse(JSON.stringify(result));
        console.log(jsonifiedResult);
        res.send(jsonifiedResult);
        });
    }
});

router.post('/signup', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.email && obj.password){
        console.log(obj.email);
        console.log(obj.password);
        let query = "SELECT * FROM users where email='" + obj.email + "';";
        console.log(query);
        con.query(query, function (err, result, fields) {
        if (err) throw err;
        const jsonifiedResult = JSON.parse(JSON.stringify(result));
        console.log(jsonifiedResult);
        if(result.length > 0){
            console.log(JSON.stringify({outcome: "already exists"}));
            res.send(JSON.stringify({outcome: "already exists"}));
        } else{
            let query = "INSERT INTO users (email, pw) VALUES ('" + obj.email + "','" + obj.password + "');";
            con.query(query, function (err, result, fields) {
            if (err) throw err;
            const jsonifiedResult = JSON.parse(JSON.stringify(result));
            console.log(jsonifiedResult);
            });

            var mailOptions = {
                from: 'nickcrumpet.litty@gmail.com',
                to: obj.email,
                subject: 'Welcome to Bruinwalk 2.0!',
                text: 'Thanks for registering!\nEmail: ' + obj.email + '\nPassword: ' + obj.password
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.send(JSON.stringify({outcome: "success"}));
        }
        });
    }
});

router.post('/login', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.email && obj.password){
        console.log(obj.email);
        console.log(obj.password);
        let query = "SELECT * FROM users where email='" + obj.email + "' and pw='" + obj.password + "';";
        console.log(query);
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            const jsonifiedResult = JSON.parse(JSON.stringify(result));
            console.log(jsonifiedResult);
            if(result.length == 0){
                console.log(JSON.stringify({outcome: "incorrect"}));
                res.send(JSON.stringify({outcome: "incorrect"}));
            } else{
                console.log(JSON.stringify({outcome: "correct"}));
                res.send(JSON.stringify({outcome: "correct"}));
            }
        });
    }
});

router.post('/forgotpassword', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.email){
        let query = "SELECT * FROM users where email='" + obj.email + "';";
        console.log(query);
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            const jsonifiedResult = JSON.parse(JSON.stringify(result));
            console.log(jsonifiedResult);
            if(result.length > 0){
                var mailOptions = {
                    from: 'nickcrumpet.litty@gmail.com',
                    to: obj.email,
                    subject: 'Bruinwalk 2.0 Login Credentials',
                    text: 'Your Account Credentials:\nEmail: ' + jsonifiedResult[0].email + '\nPassword: ' + jsonifiedResult[0].pw
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            } else{
                console.log("No such account.");
            }
            res.send("done");
        });
    }
});

router.post('/addreviewinfo', function(req, res){
    console.log("at addreview info");
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.department){
        console.log("Department: " + obj.department);
        let query = "SELECT * FROM departments where name='" + obj.department + "';";
        console.log(query);
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            const jsonifiedResult = JSON.parse(JSON.stringify(result));
            let department_id = jsonifiedResult[0].id;
            
            let prof_query = "SELECT * FROM professors where department='" + department_id + "';";
            console.log(prof_query);

            con.query(prof_query, function (err, result, fields) {
                if (err) throw err;
                
                let professors_obj = JSON.parse(JSON.stringify(result));
                let class_query = "SELECT * FROM classes where department='" + department_id + "';";
                console.log(class_query);
                con.query(class_query, function (err, result, fields) {
                    if (err) throw err;
                    
                    let classes_obj = JSON.parse(JSON.stringify(result));

                    let classes = [];
                    let profs = [];

                    for(let db_class of classes_obj){
                        classes.push(db_class.name);
                    }

                    for(let db_prof of professors_obj){
                        profs.push(db_prof.name);
                    }

                    let final_result = JSON.stringify({professors: profs, classes: classes});
                    console.log(final_result);
                    res.send(final_result);
                });
            });
        });
    }
});

//export this router to use in our index.js
module.exports = router;