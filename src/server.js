//dependencies
const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const app = express();
var request = require("request");
var cheerio = require("cheerio");
var ahoCorasick = require('ahocorasick');
const WebSocket = require('ws')

ObjectId = require('mongodb').ObjectID;

var mongo = require("mongoose");
//instantiate a MongoDB database locally in lines 5–9.
var db = mongo.connect("mongodb://localhost:27017/angular_course", function(err, response){
    if(err){ console.log(err); } //in case of an error and the DB being unable to connect we throw the error to the user.
    else{ console.log('Connected to ' + db, ' + ', response); }
});

app.use(express.static(process.cwd() + "/public"));
//Require set up handlebars
var exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


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

var BranchSchema = new Schema({
    address: {type: String},
    name: {type: String},
    lng: {type: String},
    lat: {type: String}
},{ versioinKey: false });


var Recipe = require("../src/models/Recipe");
var modelBranch = mongo.model('branch', BranchSchema, 'branch');
var modelUsers = mongo.model('users', UserSchema, 'users');
var modelShoppingList = mongo.model('shoppingList', shoppingListSchema, 'shoppingList');



// <------------------------------------Scraper------------------------------------------------------------------------------------->
app.get("/api/freeSearchRecipes", function(req,res) {
    var string = req.query.string;
    
    if (string != undefined) {
        // Total requested searches
        var stringArr = string.toLocaleLowerCase().split(" ")

        console.log("The given searches: " + stringArr)

        // The algo
        var ac = new ahoCorasick(stringArr);
        // Final result
        var matchRecipes = []

        getAllRecipes(function(recipes) {
            if(recipes != "-1") {
               recipes.forEach(recipe => {
                    // Search by recipe name and description
                    var searchString = recipe.name + " " + recipe.description    
                    var results = ac.search(searchString.toLocaleLowerCase());
                
                    if(results.length > 0)
                         matchRecipes.push(recipe)    
                 });
            }

            console.log("Found matches for free string search: " + matchRecipes.length)
            res.send(matchRecipes)        
         })
    }
    else {
        console.log("The search text function MUST receive a string!")
        res.send("-1")    
    }
})

// Load several recipes from several pages from 'allrecipes.com' site
function LoadScraper() {
    try {
        LoadAllRecipesWebScraper("https://www.allrecipes.com/")
        LoadAllRecipesWebScraper("https://www.allrecipes.com/recipes/276/desserts/cakes/")
        LoadAllRecipesWebScraper("https://www.allrecipes.com/recipes/78/breakfast-and-brunch/")
        LoadAllRecipesWebScraper("https://www.allrecipes.com/recipes/201/meat-and-poultry/chicken/")
        LoadAllRecipesWebScraper("https://www.allrecipes.com/recipes/88/bbq-grilling/")
        LoadAllRecipesWebScraper("https://www.allrecipes.com/recipes/86/world-cuisine/")
    } catch (error) {
        console.log("Can't access \'allrecipes.com\'")
    }   
}

// The actual scraping function
// Taking recipes data from outsource web pages
function LoadAllRecipesWebScraper(allrecipes_url) {
    console.log("Start scraper for " + allrecipes_url)

    request(allrecipes_url, function(error, response, html) {
      var $ = cheerio.load(html);
      var titlesArray = [];
  
      $(".fixed-recipe-card").each(function(i, element) {
        var result = {}; 
        result._user_id = ""

        result.name = $(this)        
          .children(".fixed-recipe-card__info")
          .children(".fixed-recipe-card__h3")
          .children("a")
          .children("span")
          .text();
        result.description = $(this)
          .children(".fixed-recipe-card__info")
          .children("a")
          .children(".fixed-recipe-card__description")
          .contents()
          .text()
        result.image_path = $(this)        
          .children(".favorite")
          .attr("data-imageurl")
          .replace(/'/g, "") // replace all ' with empty char (g = replace all match chars)

        var ingredientsLink = $(this)
        .children(".fixed-recipe-card__info")
        .children(".fixed-recipe-card__h3")
        .children("a")
        .attr("href")

        // Loading ingredients before saving
        LoadIngredients(ingredientsLink, function(ingredientsArray) {
           result.ingredients = ingredientsArray
            
          // Default values if one of them not found
          if(!result.image_path)
                 result.image_path = "https://vignette.wikia.nocookie.net/joke-battles/images/0/0f/Everyday-is-taco-tuesday-t-shirt-teeturtle-marvel_800x.jpg"

            if(!result.description)
                result.description = ""

            if(!result.ingredients)
                result.ingredients = []

            // Saving to mongo if not already exists (by recipe name)
            if (result.name != "" && titlesArray.indexOf(result.name) == -1) {
                titlesArray.push(result.name);  

                Recipe.countDocuments({ name: result.name }, function(err, test) {
                    if (test === 0) {
                        var entry = new Recipe(result);
    
                        entry.save(function(err, doc) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("--------------------------------------------------");
                                console.log("Name: " + doc.name)
                            }
                        });
                    }
                });
            } else {
                console.log("Recipe already exists.");
            }
        });
    });
})
}


// Getting ingredients of a given url
function LoadIngredients(allrecipes_ing_url, callback) {
    request(allrecipes_ing_url, function(error, response, html) {
        var $ = cheerio.load(html);
        
        var ingredientsArray = [];
        $(".checkList__line").each(function(i, element) {
          var ingredientName = $(this)        
          .children("label")
          .attr("title")

          // Checking if the ingredient is a string and not an Object or undefined types
          var type = typeof ingredientName
          if(ingredientName != undefined && type == "string") {
                var ingredient = {}; 
                ingredient.name = ingredientName
                ingredient.amount = 1 

                ingredientsArray.push(ingredient)
          }
        })

        console.log("Ingredients found: " + ingredientsArray)
        callback(ingredientsArray)
    })
}


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
	Recipe.findOne({_id: id}, function(err,data) {
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
	Recipe.findOne({name: recipeName}, function(err,data) {
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
    Recipe.deleteOne({_id: id}, function(err) {
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
     
        Recipe.create(newRecipe, function(err, data) {
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
 
        Recipe.updateOne(searchQuery, newValues, function(err, updated_data) {
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

app.get("/api/getRecipesAmount", function(req, res){
    var recipeName = req.query.name; 
    Recipe.mapReduce(
        mapFunction, reduceFunction, { out: "totals", query: {name: recipeName}}, 
        function(err, data){
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
        }
    );
});

mapFunction = function(){
    emit(this.name, this._user_id);
};

reduceFunction = function(name, users){
    return  users.length;
};

app.get("/api/getUserTotalIngredientsAmount", function(req,res) {
    
    var user_id = req.query.userId

    if(user_id == undefined)
    {
        console.log("Operation must recieve a user id!");
        res.send("-1");
    }
    else
    {
        Recipe.aggregate([

            // applying group for docs that contains this user id
            {$match:{"_user_id": user_id}},

            // Count the ingredients of each recipe
             {$project:{count: {$size:"$ingredients"}}},
    
            // sum all recipe's ingredients
             {$group:{_id: user_id, total: {$sum: "$count"}}}
    
        ]).exec(function(err, data){
            if(err){
                console.log(err)
                res.send("-1");
            }
            else {
                console.log(data)
                res.send(data);
            }
        });
    }
})

app.get("/api/getRecipeAmount", function(req,res){	
        var recipeName = req.query.name;
        Recipe.find({name: recipeName}, function(err,data) {
            if(err || data == null){
                console.log("A recipe with the name " + recipeName + " wasn't found");
                
                if(err != null)
                    console.log(err);
                
                res.send("-1");
            }
            else {
                console.log("Got recipe by name " + recipeName +" "+data.length);
                res.send(data.length.toString());
            }
        });
});


// Getting all existing recipes
function getAllRecipes(callback, printToConsole = true) {

    console.log("Getting all recipes")
    Recipe.aggregate([
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
	Recipe.find({_user_id: userId}, function(err,data) {
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


//<-------------------------------   Authenticate  --------------------------------------------------------------------------------->

app.get("/api/login", function(req, res){
    var query = {email: req.query.email, password: req.query.password}

    modelUsers.findOne(query, function(err, data){
        if(err ){
            res.send("-1");
        }else if(data){
            res.send(data._id);
        } else{
            res.send("-1");
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
            res.send("-1");
        }else{
            if(data){
                res.send("-1");
            }else{
                modelUsers.create(user, function(err, data){
                    if(err){
                        res.send("-1");
                    }else{
                        res.send(data._id)
                    }
                });
            }

        }
    });
});


// <------------------------------Shopping Lists------------------------------------------------------------------------------------>

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

//<-----------------------------------------------WebSocket---------------------------------->
const WebSocket = require('ws')
    process.on('uncaughtException', function (err) {
        // The 'parent' error ocour when we try to access a site with cheerio and we can't 
        // Mostly because they have blocked us
        if(err.message = "Cannot read property 'parent' of undefined")
            console.log("Error! Can't access \'allrecipes.com\'")
        else
            console.log("Error! " + err.message)
    });

    LoadScraper()
})

const wss = new WebSocket.Server({ port: 8085 })
wss.on('connection', ws => {

    ws.on('message', message => {
        console.log(wss.clients.size);
        ws.send(wss.clients.size);
    })

    ws.on('close', message => {
        wss.clients.forEach( client => {
            console.log(wss.clients.size);
            client.send(wss.clients.size);
        })
    })

    wss.clients.forEach( client => {
        console.log(wss.clients.size);
        client.send(wss.clients.size);
    })
})
