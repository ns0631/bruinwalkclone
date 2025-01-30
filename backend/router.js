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
        var query = "";
        if(!obj.restriction || obj.restriction == "both"){
            query = "SELECT * FROM classes where name like '%" + obj.text + "%' UNION SELECT * FROM professors where name like '%" + obj.text + "%' ORDER BY name;";
        } else if(obj.restriction == "profs"){
            query = "SELECT * FROM professors where name like '%" + obj.text + "%' ORDER BY name;";
        } else {
            query = "SELECT * FROM classes where name like '%" + obj.text + "%' ORDER BY name;";
        }
        con.query(query, function (err, result, fields) {
        if (err) throw err;
        let arr = [];
        result = JSON.parse(JSON.stringify(result));
        res.send(result);
        });
    }
});

router.post('/signup', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.email && obj.password){
        let query = "SELECT * FROM users where email='" + obj.email + "';";
        con.query(query, function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0){
            res.send(JSON.stringify({outcome: "already exists"}));
        } else{
            let query = "INSERT INTO users (email, pw) VALUES ('" + obj.email + "','" + obj.password + "');";
            con.query(query, function (err, result, fields) {
            if (err) throw err;
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
            
            if(result.length == 0){
                res.send(JSON.stringify({outcome: "incorrect"}));
            } else{
                const token = generateAccessToken({ username: email, id: result[0].id  });

                res.cookie("jwt", token, {
                    httpOnly: true,
                    expires: dayjs().add(30, "minutes").toDate()
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
            
            if(result.length > 0){
                var mailOptions = {
                    from: 'nickcrumpet.litty@gmail.com',
                    to: obj.email,
                    subject: 'Bruinwalk 2.0 Login Credentials',
                    text: 'Your Account Credentials:\nEmail: ' + result[0].email + '\nPassword: ' + result[0].pw
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
            const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
            var userid = decoded.id;

            let query = `INSERT INTO reviews (class, prof, userid, recordDate, grade, quarterTaken, yearTaken, overallRating, ease, helpfulness, clarity, workload, reviewBody) VALUES (${parameters.class_Name},${parameters.professorName},${userid},"${generateDatabaseDateTime(datenow)}","${parameters.grade}","${parameters.quarter}",${parameters.yearTaken},${parseInt(parameters.overallScore)},${parseInt(parameters.ease)},${parseInt(parameters.helpfulness)},${parseInt(parameters.clarity)},${parseInt(parameters.workload)},"${parameters.reviewText}")`;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
            });
            return res.send('success');
        }
    })
});

router.post('/deletereview', authenticateToken, function(req, res){
    //verify the JWT token generated for the user
    const parameters = JSON.parse(JSON.stringify(req.body));
    jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            //res.sendStatus(403);
            res.send('failure');
        } else {
            if(!(parameters.id)){
                res.sendStatus(422);
                return;
            }

            let query = `DELETE FROM reviews WHERE id=${parameters.id};`;
            console.log(query);
            con.query(query, function (err, result, fields) {
                if (err) throw err;
            });
            return res.send('success');
        }
    })
});

router.post('/addreviewinfo', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.department){
        let prof_query = `SELECT
                            p.id,
                            p.name
                        from departments d join professors p
                        on d.name="${obj.department}" and p.department = d.id;`;
        

        let class_query = `SELECT
                        c.id,
                        c.name
                    from departments d join classes c
                    on d.name="${obj.department}" and c.department = d.id;`;
        
        con.query(prof_query, function (err, prof_result, fields) {
            if (err) throw err;

            con.query(class_query, function (err, class_result, fields) {
                if (err) throw err;
                
                let profs = JSON.parse(JSON.stringify(prof_result));
                let classes = JSON.parse(JSON.stringify(class_result));
                
                let final_result = JSON.stringify({professors: profs, classes: classes});
                res.send(final_result);
            });
        });
    }
});

router.post('/myreviews', authenticateToken, function(req, res){
    //verify the JWT token generated for the user
    const parameters = JSON.parse(JSON.stringify(req.body));
    jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            //res.sendStatus(403);
            res.send('failure');
        } else {
            let datenow = new Date();

            function generateDatabaseDateTime(date) {
                return date.toISOString().replace("T"," ").substring(0, 19);
            }

            const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
            var userid = decoded.id;

            //If token is successfully verified, we can send the authorized data 
            let query = `SELECT
                        r.id,
                        r.recordDate,
                        r.reviewBody,
                        r.quarterTaken,
                        r.yearTaken,
                        r.overallRating,
                        r.ease,
                        r.helpfulness,
                        r.clarity,
                        r.workload,
                        p.name as prof,
                        c.name as class,
                        r.overallRating as rating
                    from reviews r join professors p join classes c
                    on r.userid=${userid} and r.class=c.id and r.prof=p.id;`;

            console.log(query);
            con.query(query, function (err, result, fields) {
                if (err) throw err;

                let parsedresult = JSON.parse(JSON.stringify(result));
                return res.send(parsedresult);
            });
        }
    })
});

router.post('/fetchreviewbyid', authenticateToken, function(req, res){
    const parameters = JSON.parse(JSON.stringify(req.body));
    //verify the JWT token generated for the user
    jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            //res.sendStatus(403);
            res.send('failure');
        } else {
            if(!(parameters.id)){
                res.send('failure');
                return;
            }

            const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
            var userid = decoded.id;

            let query = `SELECT
                        a.id,
                        a.userid,
                        a.reviewBody,
                        a.overallRating,
                        a.helpfulness,
                        a.clarity,
                        a.ease,
                        a.workload,
                        a.quarterTaken,
                        a.yearTaken,
                        a.recordDate,
                        b.name AS prof,
                        c.name AS class
                    from reviews a join professors b join classes c
                    on a.id = ${parseInt(parameters.id)} and b.id = a.prof and c.id = a.class;`;
            console.log(query);
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                if(result.length == 0){
                    return res.send("not found");
                } else{
                    let parsedresult = JSON.parse(JSON.stringify(result))[0];

                    if(userid !== parsedresult.userid){
                        return res.send("failure");
                    }

                    return res.send(parsedresult);
                }
            });
        }
    })
});


router.post('/editreview', authenticateToken, function(req, res){
    //verify the JWT token generated for the user
    const parameters = JSON.parse(JSON.stringify(req.body));
    jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            //res.sendStatus(403);
            res.send('failure');
        } else {
            if(!(parameters.id && parameters.overallScore && parameters.ease && parameters.workload && parameters.helpfulness && parameters.clarity && parameters.reviewText)){
                res.sendStatus(422);
                return;
            }

            let datenow = new Date();

            function generateDatabaseDateTime(date) {
                return date.toISOString().replace("T"," ").substring(0, 19);
            }

            //If token is successfully verified, we can send the autorized data 
            const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
            var userid = decoded.id;

            let query = `SELECT * FROM reviews WHERE id=${parseInt(parameters.id)};`;
            console.log(query);
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                if(result.length == 0){
                    return res.send("not found");
                } else{
                    let parsedresult = JSON.parse(JSON.stringify(result))[0];
                    if(userid !== parsedresult.userid){
                        return res.send("failure");
                    }
                }
            });

            let updatequery = `UPDATE reviews SET recordDate="${generateDatabaseDateTime(datenow)}",overallRating=${parseInt(parameters.overallScore)},ease=${parseInt(parameters.ease)},helpfulness=${parseInt(parameters.helpfulness)},clarity=${parseInt(parameters.clarity)},workload=${parseInt(parameters.workload)},reviewBody="${parameters.reviewText}" WHERE id=${parameters.id}`;
            console.log(updatequery);
            con.query(updatequery, function (err, result, fields) {
                if (err) throw err;
            });
            return res.send('success');
        }
    })
});

async function fetchProfessorNameById(id){
    let query = `SELECT * FROM professors where id=${id}`;

    const name = await new Promise((resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result[0]));
            resolve(jsonifiedresult.name);
        });
    })
    return name;
}


async function fetchClassNameById(id){
    let query = `SELECT * FROM classes where id=${id}`;

    const name = await new Promise((resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0){
                return false;
            }
            let jsonifiedresult = JSON.parse(JSON.stringify(result[0]));
            resolve(jsonifiedresult.name);
        });
    })
    return name;
}


async function fetchClassIdByName(name){
    let query = `SELECT * FROM classes where name='${name}'`;

    const id = await new Promise((resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if(result.length === 0){
                return false;
            }
            let jsonifiedresult = JSON.parse(JSON.stringify(result[0]));
            resolve(jsonifiedresult.id);
        });
    })
    return id;
}

async function fetchAllReviewsForClass(id){
    let query = `SELECT * FROM reviews where class=${id}`;

    const allReviews = await new Promise( (resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            resolve(jsonifiedresult);
        });
    } ) 
    return allReviews;
}

async function fetchAllReviewsForProf(id){
    let query = `SELECT * FROM reviews where prof=${id}`;

    const allReviews = await new Promise( (resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            resolve(jsonifiedresult);
        });
    } ) 
    return allReviews;
}

async function fetchAvgRatingForClass(id, category){
    let query = `SELECT AVG(${category}) AS avgRating FROM reviews WHERE class=${id};`;
    const avg = await new Promise((resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            resolve(jsonifiedresult[0].avgRating);
        });
    });
    if(avg === null){
        return "N/A";
    }
    return avg.toFixed(1);
}


async function fetchAvgRatingForProf(id, category){
    let query = `SELECT AVG(${category}) AS avgRating FROM reviews WHERE prof=${id};`;
    const avg = await new Promise((resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            resolve(jsonifiedresult[0].avgRating);
        });
    });
    if(avg === null){
        return "N/A";
    }
    return avg.toFixed(1);
}

async function fetchAvgRatingForProfandClass(profid, classid, category){
    let query = `SELECT AVG(${category}) AS avgRating FROM reviews WHERE prof=${profid} AND class=${classid};`;
    const avg = await new Promise((resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            console.log(jsonifiedresult[0].avgRating);
            resolve(jsonifiedresult[0].avgRating);
        });
    });
    if(avg === null){
        return "N/A";
    }
    return avg.toFixed(1);
}

async function fetchProfsForClass(id){
    let query = `SELECT DISTINCT
                        
                        p.name,
                        p.id
                    from reviews r join professors p
                    on r.class=${id} and r.prof=p.id;`;

    const profs = await new Promise( (resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            resolve(jsonifiedresult);
        });
    })

    for(let i = 0 ; i < profs.length ; i++){
        profs[i] = [ profs[i].name, await fetchAvgRatingForProfandClass(profs[i].id, id, 'overallRating') ];
    }

    if(profs.length > 4){
        return profs.slice(0, 4);
    }
    return profs;
}

async function fetchClassesForProf(id){
    let query = `SELECT DISTINCT
                        c.name,
                        c.id,
                        c.fullName
                    from reviews r join classes c
                    on r.prof=${id} and r.class=c.id;`;

    const profClasses = await new Promise( (resolve) => {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            resolve(jsonifiedresult);
        });
    })

    for(let i = 0 ; i < profClasses.length ; i++){
        profClasses[i] = [ profClasses[i].name, await fetchAvgRatingForProfandClass(id, profClasses[i].id, 'overallRating'), profClasses[i].fullName ];
    }

    if(profClasses.length > 4){
        return profClasses.slice(0, 4);
    }
    return profClasses;
}

router.post('/overviewinfo', function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.id && (obj.prof !== null)){
        if(obj.prof === 1){
            //Professors
            let query = `SELECT * FROM professors where id=${obj.id}`;
            con.query(query, async function (err, result, fields) {
                if (err) throw err;

                let jsonifiedresult = JSON.parse(JSON.stringify(result[0]));
                const avgRating = await fetchAvgRatingForProf(obj.id, 'overallRating');
                const profClasses = await fetchClassesForProf(obj.id);

                jsonifiedresult['profClasses'] = profClasses;
                jsonifiedresult['avgRating'] = avgRating;

                console.log(jsonifiedresult);

                return res.send(jsonifiedresult);
            });
        } else if(obj.prof === 0){
            //Classes

            let query = `SELECT * FROM classes where id=${obj.id}`;
            con.query(query, async function (err, result, fields) {
                if (err) throw err;

                let jsonifiedresult = JSON.parse(JSON.stringify(result[0]));
                const avgRating = await fetchAvgRatingForClass(obj.id, 'overallRating');
                const profs = await fetchProfsForClass(obj.id);

                jsonifiedresult['profs'] = profs;
                jsonifiedresult['avgRating'] = avgRating;

                return res.send(jsonifiedresult);
            });
        }
    }
});

router.post('/classoverview', async function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.classname){
        //Professors
        let query = `SELECT DISTINCT
                        p.name,
                        p.id,
                        c.id AS classid,
                        c.name AS classname,
                        c.fullname as fullclassname
                    from reviews r join professors p join classes c
                    on c.name="${obj.classname}" and r.prof=p.id and r.class=c.id;`;
            
            const profs = await new Promise( (resolve) => {
                con.query(query, function (err, result, fields) {
                    if (err) throw err;
                    
                    let jsonifiedresult = JSON.parse(JSON.stringify(result));
                    console.log(jsonifiedresult);
                    resolve(jsonifiedresult);
                });
            })

            if(profs.length == 0){
                return res.send("failure");
            }

            for(let i = 0 ; i < profs.length ; i++){
                let id = profs[i].classid;
                profs[i] = [ profs[i].name, await fetchAvgRatingForProfandClass(profs[i].id, id, 'overallRating'), await fetchAvgRatingForProfandClass(profs[i].id, id, 'ease'), await fetchAvgRatingForProfandClass(profs[i].id, id, 'helpfulness'), await fetchAvgRatingForProfandClass(profs[i].id, id, 'clarity'), await fetchAvgRatingForProfandClass(profs[i].id, id, 'workload'), profs[i].classname, profs[i].fullclassname ];
            }

            if(profs.length > 4){
                return profs.slice(0, 4);
            }
            return res.json(profs);
    }
});

router.post('/fetchreviews', async function(req, res){
    const parameters = JSON.parse(JSON.stringify(req.body));
    //verify the JWT token generated for the user
    if(!(parameters.profname && parameters.classname)){
        res.send('failure');
        return;
    }

    let review_query = `SELECT
                a.id,
                a.userid,
                a.reviewBody,
                a.overallRating,
                a.helpfulness,
                a.clarity,
                a.ease,
                a.workload,
                a.quarterTaken,
                a.yearTaken,
                a.recordDate,
                b.id as profid,
                b.name AS prof,
                c.name AS class,
                b.id AS profid,
                c.id AS classid,
                c.fullname as fullclassname
            from reviews a join professors b join classes c
            on b.name = "${parameters.profname}" and c.name = "${parameters.classname}" and a.prof = b.id and a.class = c.id;`;
        
    console.log(review_query);
    const reviews = await new Promise( (resolve) => {
        con.query(review_query, async function (err, result, fields) {
            if (err) throw err;
            let parsed_reviews = JSON.parse(JSON.stringify(result));
            resolve(parsed_reviews);
        });
    } );

    if(reviews.length == 0){
        return res.send("failure");
    }
            
    /*const profs = await new Promise( (resolve) => {
        con.query(info_query, function (err, result, fields) {
            if (err) throw err;
                    
            let jsonifiedresult = JSON.parse(JSON.stringify(result));
            console.log(jsonifiedresult);
            resolve(jsonifiedresult);
        });
    })*/

    let prof_class_summary = {overall: parseFloat(await fetchAvgRatingForProfandClass(reviews[0].profid, reviews[0].classid, 'overallRating')).toFixed(1), ease: parseFloat(await fetchAvgRatingForProfandClass(reviews[0].profid, reviews[0].classid, 'ease')).toFixed(1), helpfulness: parseFloat(await fetchAvgRatingForProfandClass(reviews[0].profid, reviews[0].classid, 'helpfulness')).toFixed(1), clarity: parseFloat(await fetchAvgRatingForProfandClass(reviews[0].profid, reviews[0].classid, 'clarity')).toFixed(1), workload: parseFloat(await fetchAvgRatingForProfandClass(reviews[0].profid, reviews[0].classid, 'workload')).toFixed(1), classcode: reviews[0].class, fullclassname: reviews[0].fullclassname};
    prof_class_summary['num_reviews'] = reviews.length;

    let result = {info: prof_class_summary, reviews:reviews};
    console.log(result);

    return res.send(result);
});

//export this router to use in our index.js
module.exports = router;