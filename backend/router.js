var mysql = require('mysql');
var express = require('express');
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('dotenv').config()

const { json } = require('body-parser');

var dayjs = require('dayjs');

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

process.env.SECRET_KEY = crypto.randomBytes(256).toString('hex');

function generateAccessToken(username) {
    return jwt.sign(username, process.env.SECRET_KEY, { expiresIn: '900s' });
}

function authenticateToken(req, res, next) {
    if(!req.cookies.jwt){
        console.log("failure");
        return res.send("failure");
        //return res.sendStatus(401);
    }
    //const authHeader = req.headers['authorization']
    //const token = authHeader && authHeader.split(' ')[1]
    const token = req.cookies.jwt;

    if (token == null) return res.send("failure"); //res.sendStatus(401)
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      console.log(err)
  
      if (err) return res.send("failure"); //res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }

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
        let query = "SELECT * FROM users where email='" + obj.email + "';";
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
    const email = obj.email;
    if(email && obj.password){
        let query = "SELECT * FROM users where email='" + email + "' and pw='" + obj.password + "';";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            const jsonifiedResult = JSON.parse(JSON.stringify(result));
            if(result.length == 0){
                console.log(JSON.stringify({outcome: "incorrect"}));
                res.send(JSON.stringify({outcome: "incorrect"}));
            } else{
                const token = generateAccessToken({ username: email });
                console.log(JSON.stringify({outcome: "correct", token:token}));

                res.cookie("jwt", token, {
                    httpOnly: true,
                    expires: dayjs().add(60, "minutes").toDate()
                  });        
                res.json({outcome: "correct", token:token});  
            }
        });
    }
});

router.post('/forgotpassword', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.email){
        let query = "SELECT * FROM users where email='" + obj.email + "';";
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

router.post('/addreview', authenticateToken, function(req, res){
    //verify the JWT token generated for the user
    const parameters = JSON.parse(JSON.stringify(req.body));
    jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            //res.sendStatus(403);
            res.send('failure');
        } else {
            if(!(parameters.dept && parameters.class_Name && parameters.professorName && parameters.yearTaken && parameters.quarter && parameters.grade && parameters.overallScore && parameters.ease && parameters.workload && parameters.helpfulness && parameters.clarity && parameters.reviewText)){
                res.sendStatus(422);
                return;
            }

            let datenow = new Date();

            function generateDatabaseDateTime(date) {
                return date.toISOString().replace("T"," ").substring(0, 19);
            }

            //If token is successfully verified, we can send the autorized data 
            let query = `INSERT INTO reviews (class, prof, recordDate, grade, quarterTaken, yearTaken, overallRating, ease, helpfulness, clarity, workload, reviewBody) VALUES (${parameters.class_Name},${parameters.professorName},"${generateDatabaseDateTime(datenow)}","${parameters.grade}","${parameters.quarter}",${parameters.yearTaken},${parseInt(parameters.overallScore)},${parseInt(parameters.ease)},${parseInt(parameters.helpfulness)},${parseInt(parameters.clarity)},${parseInt(parameters.workload)},"${parameters.reviewText}")`;
            console.log(query);
            con.query(query, function (err, result, fields) {
                if (err) throw err;
            });
            console.log('success');
            return res.send('success');
        }
    })
});

router.post('/addreviewinfo', function(req, res){
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
                        classes.push({name: db_class.name, id: db_class.id});
                    }

                    for(let db_prof of professors_obj){
                        profs.push({name: db_prof.name, id: db_prof.id});
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