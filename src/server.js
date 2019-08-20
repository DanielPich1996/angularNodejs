const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const app = express();
ObjectId = require('mongodb').ObjectID;

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
password: {type: String},
email: {type: String}
},{ versioinKey: false });

var shoppingListSchema = new Schema({
    user_id: { type: String },
    ingredients: { type: Array }
},{ versioinKey: false });

var RecipeSchema = new Schema({
    name: { type: String },
    description: { type: String },
    image_path: { type: String },
    _user_id: { type: String },
    ingredients: { type: Array },
},{ versioinKey: false });

var BranchSchema = new Schema({
    address: {type: String},
    name: {type: String},
    lng: {type: String},
    lat: {type: String}
},{ versioinKey: false });


var modelRecipes = mongo.model('recipes', RecipeSchema, 'recipes');
var modelBranch = mongo.model('branch', BranchSchema, 'branch');
var modelUsers = mongo.model('users', UserSchema, 'users');
var modelShoppingList = mongo.model('shoppingList', shoppingListSchema, 'shoppingList');


// <------------------------------------Recipes------------------------------------------------------------------------------------->

// Get all recipes and full user data of the creator of the recipe
app.get("/api/getAllRecipes", function(req,res) {
    getAllRecipes(function(data) {        
        res.send(data);
    });	
})

// Get user's recipes by user id
app.get("/api/getAllUserRecipes", function(req,res) {    
    getAllUserRecipes(req.query.userId, function(data) {        
        res.send(data);
    });	
})

// Get recipe by id
app.get("/api/getRecipe", function(req,res){
	
	var id = req.query.id;
	modelRecipes.findOne({_id: id}, function(err,data) {
        if(err || data == null){
			console.log("A recipe with id " + id + " wasn't found");
			
			if(err != null)
				console.log(err);
			
            res.send("-1");
        }
        else {
			console.log("Got recipe " + id);
            res.send(data);
        }
    });
})

// Get recipe by name
app.get("/api/getRecipeByName", function(req,res){
	
	var recipeName = req.query.name;
	modelRecipes.findOne({name: recipeName}, function(err,data) {
        if(err || data == null){
			console.log("A recipe with the name " + recipeName + " wasn't found");
			
			if(err != null)
				console.log(err);
			
            res.send("-1");
        }
        else {
			console.log("Got recipe by name " + recipeName);
            res.send(data);
        }
    });
})

// Get recipe by free search text
app.get("/api/searchRecipe", function(req,res){
    
    var searchString = req.query.string;
    var isCaseSensitive = req.query.isCaseSensitive == undefined ? true : req.query.isCaseSensitive == "true";
    var userId = req.query.userId

    // Search by a user id
    if (userId != undefined) {
         getAllUserRecipes(userId, function(recipes) {
            var matchRecipes = getMatchRecipes(recipes, searchString, isCaseSensitive) 
            res.send(matchRecipes);
        }, false)
    }
    // Search by all existing recipes
    else {
        getAllRecipes(function(recipes) {
            var matchRecipes = getMatchRecipes(recipes, searchString, isCaseSensitive) 
            res.send(matchRecipes);
        }, false)
    }		
})

// Remove recipe by id
app.get("/api/deleteRecipe", function(req,res){

	var id = req.query.id;
    modelRecipes.deleteOne({_id: id}, function(err) {
        if(err){
            console.log(err)
            res.send("-1");
        }
        else {
			console.log("Recipe with id " + id + " has been removed")
            res.send("0");
        }
    });
})

// Add new recipe
app.get("/api/addNewRecipe", function(req,res){

    console.log(req.query);

    if(req.query.userId == null) {
        console.log("No user id supplied to the insertion request! recipe not added")
        res.send("-1")
    }
    else {
        let ingredients = [];
        var user_id = req.query.userId;
        var name = req.query.name ? req.query.name : "No name available";
	    var description = req.query.description ? req.query.description : "No description available";
        var image_path = req.query.image_path ? req.query.image_path : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
        var ings = req.query.ingredients.split(',');

        for(ing of ings){
            const temp = ing.split(':')
            ingredients.push({name:temp[0], amount: +temp[1]});
        }

        var newRecipe = 
        { 
            "name": name, 
            "description": description, 
            "image_path": image_path, 
            "_user_id": user_id,   
            "ingredients": ingredients
        };
     
        modelRecipes.create(newRecipe, function(err, data) {
            if(err) {
                console.log(err)
                res.send("-1");
            }
            else {
                console.log("Recipe with id " + data._id + " has been added")
                console.log(data);
                res.send(data._id);
            }
        });
    } 
})

// Update recipe
app.get("/api/updateRecipe", function(req,res){

    console.log(req.query);

    var recipeId = req.query.id;
    if(recipeId == null) {
        console.log("No recipe id supplied to the updating request! recipe wasn't updated")
        res.send("-1")
    }
    else {
        // Update documents that match to the query
        var searchQuery = { _id: recipeId };

        // Updating the requested fields ONLY!
        var newValues = {};

        let ingredients = [];
        var ings = req.query.ingredients.split(',');

        for(ing of ings){
            const temp = ing.split(':')
            ingredients.push({name:temp[0], amount: +temp[1]});
        }

        if (req.query.name) newValues.name = req.query.name;
        if (req.query.description) newValues.description = req.query.description;
        if (req.query.image_path) newValues.image_path = req.query.image_path;
        if (req.query.ingredients) newValues.ingredients = ingredients;
 
        modelRecipes.updateOne(searchQuery, newValues, function(err, updated_data) {
            if(err) {
                console.log(err)
                res.send("-1");
            }
            else {
                console.log("Recipe with id " + recipeId + " has been updated")
                console.log(updated_data);
                res.send("0");
            }
        });
    } 
})

// Getting all existing recipes
function getAllRecipes(callback, printToConsole = true) {

    console.log("Getting all recipes")
    modelRecipes.aggregate([
		{ $lookup:
			{
				from: 'users',
				localField: '_user_id',
				foreignField: '_id',
				as: 'user'
			}
		}], (err,results) => {
			 if(err){                
                console.log(err);
                callback("-1");
			}
			else {
                if(printToConsole) { console.log(results.length + " match recipes were found") }
                callback(results);
			}
		})
}

// Getting all existing recipes by user id
function getAllUserRecipes(userId, callback, printToConsole = true) {

    console.log("Getting all recipes by user id " + userId)
	modelRecipes.find({_user_id: userId}, function(err,data) {
        if(err){
			console.log(err);
            callback("-1");
        }
        else {
			if(printToConsole) { console.log(data.length + " match recipes were found for user id " + userId) }
            callback(data);
        }
    });
}

// Getting match recipes by a search string and a given recipes list
function getMatchRecipes(recipes, searchString, isCaseSensitive) {

    if (recipes != null) {
        var matchRecipes = []

        for (var i = 0; i < recipes.length; i++) { 
    
            var isMatch = isRecipeMatch(recipes[i], searchString, isCaseSensitive)
            if(isMatch) { matchRecipes.push(recipes[i]) }
        }
    
        console.log(matchRecipes.length + " match recipes were found to the search '" 
        + searchString + "' " + (isCaseSensitive ? "with" : "without") + " case-sensitive")
        return matchRecipes
    }
    else {
        return "-1"
    }     
}

// Checking if the given recipe contains the search string in any property
function isRecipeMatch(recipe, string, isCaseSensitive = true) {

    string = isCaseSensitive ? string : string.toLowerCase()
    var name = isCaseSensitive ? recipe.name : recipe.name.toLowerCase()
    var description =  isCaseSensitive ? recipe.description : recipe.description.toLowerCase()

    if (name.includes(string)) { return true }
    if (description.includes(string)) { return true }

    for (var i = 0; i < recipe.ingredients.length; i++) { 

        var ingredient = isCaseSensitive ? recipe.ingredients[i] : recipe.ingredients[i].toLowerCase()
        if (ingredient.includes(string)) { return true }
    }
    
    return false
}


// <------------------------------------Users--------------------------------------------------------------------------------------->

// app.get("/api/getAllUsers", function(req,res){
//     modelUsers.find({}, function(err,data) {
//         if(err){
//             res.send(err);
//         }
//         else {
//             res.send(data);
//         }
//     });
// })

// In line 89-140 we have defined our API calls, which allow us to store, update, find and delete the user data from the database.
// app.post("/api/saveUser", function(req,res){
//     var mod = new model(req.body);
//     if(req.body.mode == "Save")
//     {
//         mod.save(function(err, data) {
//             if(err) {
//                 res.send(err);
//             }
//             else {
//                 res.send({data: "Record has been Inserted..!!"});
//             }
//         });
//     }
//     else 
//     {
//         model.findByIdAndUpdate(req.body.id, {name: req.body.name, address: req.body.address},
//             function(err,data) {
//                 if(err){
//                     res.send(err);
//                 }
//                 else {
//                     res.send({data: "Record has been Updated..!!"});
//                 }
//         });
//     }
// })

// app.post("/api/deleteUser", function(req,res){
//     console.log("start")
//     model.remove({ _id: req.body.id }, function(err) {
//         if(err){
//             console.log("nope")
//             res.send(err);
//         }
//         else {
//             res.send({data: "Record has been Deleted..!!"});
//         }
//     });
// })

// app.post("/api/getUser", function(req,res){
//     model.find({}, function(err,data) {
//         if(err){
//             res.send(err);
//         }
//         else {
//             res.send(data);
//         }
//     });
// })

//<-------------------------------   Authenticate  --------------------------------------------------------------------------------->

app.get("/api/login", function(req, res){
    var query = {email: req.query.email, password: req.query.password}

    modelUsers.findOne(query, function(err, data){
        if(err ){
            res.send(err);
        }else if(data){
            res.send(data._id);
        } else{
            res.send("0");
        }
    });
});

app.get("/api/signup", function(req, res){
    var emailQ = {email: req.query.email} 
                   //"password": req.query.password}
    var user = {"email": req.query.email,
                "password": req.query.password}
    modelUsers.findOne(emailQ, function(err, data){
        if(err){
            res.send("0");
        }else{
            if(data){
                res.send("0");
            }else{
                modelUsers.create(user, function(err, data){
                    if(err){
                        res.send("0");
                    }else{
                        res.send(data._id)
                    }
                });
            }

        }
    });
    // modelUsers.findOneAndUpdate(emailQ, 
    //                             { $setOnInsert: { password: req.query.password } }, 
    //                             { upsert: true },
    //                             function(err, data){
    //     if(err){
    //         res.send("0");
    //     }else if(data){
    //         res.send(data._id);
    //     } else{
    //         res.send("1");
    //     }
    // });
});


// <------------------------------Shopping Lists------------------------------------------------------------------------------------>

// app.get("/api/getAllShoppingLists", function(req,res){
//     modelShoppingList.find({}, function(err,data) {
//         if(err){
//             res.send(err);
//         }
//         else {
//             res.send(data);
//         }
//     });
// })

app.get("/api/getShoppingListById", function(req,res){
    var userId = req.query.userId;
    
    modelShoppingList.findOne({user_id: userId}, function(err,data) {
        if(err){
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
})

app.get("/api/updateShoppingList", function(req,res){

    var userId = req.query.userId;
    if(userId == null) {
        console.log("No recipe id supplied to the updating request! recipe wasn't updated")
        res.send("-1")
    }
    else {
        // Update documents that match to the query
        var searchQuery = { user_id: userId };
        
        let ingredients = [];
        var ings = req.query.ingredients.split(',');

        for(ing of ings){
            const temp = ing.split(':')
            ingredients.push({name:temp[0], amount: +temp[1]});
        }

        var newSP =
        { 
            "user_id"  : userId,
            "ingredients": ingredients
        }
        console.log(newSP)

        modelShoppingList.update(searchQuery, newSP, {upsert: true}, function(err, updated_data) {
            if(err) {
                console.log(err)
                res.send("-1");
            }
            else {
                console.log("Shopping list " + userId + " has been updated")
                console.log(updated_data);
                res.send("0");
            }
        });
    } 
})

app.get('/api/getBranches', function(req, res){
    modelBranch.find(function(err, data){
        console.log(data);
        if(err){
            res.send(err);
        } else { 
            res.send(data);
        }
    })
})


app.listen(8080, function () {
    console.log('NodeJS server listening on port 8080...')
})

