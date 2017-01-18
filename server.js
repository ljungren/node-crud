var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        port : 3306, //port mysql
        database : 'university',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.get('/',function(req,res){
    res.send('Go to <a href="/api/student">/api/student</a>');
});


//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var api = router.route('/student/');

//show the CRUD interface | GET
api.get(function(req,res,next){

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT s.student_id, s.name, s.email, p.program_name " + 
            "FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id",function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('student',{title:"University",data:rows});

        });
    });

});

//post data to DB | POST
api.post(function(req,res,next){

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        program_name:req.body.program_name
    };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO students (name, email, program_id) " +
            "SELECT '" + data.name + "', '" + data.email + "', program_id FROM programs " + 
            "WHERE program_name='" + data.program_name + "';", function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//filter data
var api3 = router.route('/student/filter/:filter');

api3.all(function(req,res,next){
    //console.log("You need to smth about api2 Route ? Do it here");
    console.log(req.params);
    next();
});

//show the CRUD interface | GET
api3.get(function(req,res,next){

    var filter = req.params.filter;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("CALL sp_filter('" + filter + "');",function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            // console.log(rows[0]);
            res.render('student',{title:"University",data:rows[0], filter:filter});

        });
    });

});

//now for Single route (GET,DELETE,PUT)
var api2 = router.route('/student/:student_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove api2.all() if you dont want it
------------------------------------------------------*/
api2.all(function(req,res,next){
    //console.log("You need to smth about api2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to edit
api2.get(function(req,res,next){

    var student_id = req.params.student_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT s.student_id, s.name, s.email, p.program_name " + 
            "FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id " + 
            "WHERE student_id = " + student_id + ";", function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if student not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('edit',{title:"Edit student",data:rows});
        });

    });

});

//update data
api2.put(function(req,res,next){
    var student_id = req.params.student_id;

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        program_name:req.body.program_name
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        //save id for update
        var program_id;
        var query = conn.query("SELECT program_id FROM programs WHERE program_name='" + data.program_name + "';", function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            } else{
                program_id = rows[0].program_id;
                //console.log(program_id);

                //do update on callback
                var query = conn.query("UPDATE students s INNER JOIN programs p ON s.program_id = p.program_id " + 
                    "SET s.name = '" + data.name + "', s.email = '" + data.email + "', s.program_id = '" + program_id + "' " +
                    "WHERE s.student_id = " + student_id + ";", function(err,rows){

                    if(err){
                        console.log(err);
                        return next("Mysql error, check your query");
                    }

                  res.sendStatus(200);

                });
            }
        });
    });

});

//delete data
api2.delete(function(req,res,next){

    var student_id = req.params.student_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM students WHERE student_id = ? ",[student_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);

});
