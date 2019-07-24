const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const app = express();

var mongo = require("mongoose");
//instantiate a MongoDB database locally in lines 5–9.
var db = mongo.connect("mongodb://localhost:27017/angular_course", function(err, response){
    if(err){ console.log(err); } //in case of an error and the DB being unable to connect we throw the error to the user.
    else{ console.log('Connected to ' + db, ' + ', response); }
});


app.use(cors());
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static( __dirname ) );

//Line number 18–24 allows us to define the headers.
app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline',img-src *");
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //allows us to define the website we wish to connect to, which in our case is http://localhost:4200.
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE'); //helps us define the request methods we wish to allow in our code.
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With "XMLHttpRequest",Content-Type,Accept,X-Access-Token'); //defines the request headers we wish to allow.
    res.setHeader('Access-Control-Allow-Credentials', true); //allows the website to include cookies in the request sent to the API.

    next();
});



// Line 26–31 helps us define our database schema. In our example we are only going to store the name and address of the user which are both Strings.
var Schema = mongo.Schema;

var UserSchema = new Schema({
name: { type: String },
},{ versioinKey: false });


var model = mongo.model('recipes', UserSchema, 'recipes');


// In line 36–87 we have defined our API calls, which allow us to store, update, find and delete the user data from the database.
app.post("/api/saveUser", function(req,res){
    var mod = new model(req.body);
    if(req.body.mode == "Save")
    {
        mod.save(function(err, data) {
            if(err) {
                res.send(err);
            }
            else {
                res.send({data: "Record has been Inserted..!!"});
            }
        });
    }
    else 
    {
        model.findByIdAndUpdate(req.body.id, {name: req.body.name, address: req.body.address},
            function(err,data) {
                if(err){
                    res.send(err);
                }
                else {
                    res.send({data: "Record has been Updated..!!"});
                }
            });


    }
})

app.post("/api/deleteUser", function(req,res){
    console.log("start")
    model.remove({ _id: req.body.id }, function(err) {
        if(err){
            console.log("nope")
            res.send(err);
        }
        else {
            res.send({data: "Record has been Deleted..!!"});
        }
    });
})



app.post("/api/getUser", function(req,res){
    model.find({}, function(err,data) {
        if(err){
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
})

app.get("/api/getAllRecipes", function(req,res){
    model.find({}, function(err,data) {
        if(err){
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
})

app.listen(8080, function () {
    console.log('NodeJS server listening on port 8080...')
})

