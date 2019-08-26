var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var RecipeSchema = new Schema({
    name: { type: String },
    description: { type: String },
    image_path: { type: String },
    _user_id: { type: String },
    ingredients: { type: Array },
});

var Recipe = mongoose.model("recipes", RecipeSchema);
module.exports = Recipe;
