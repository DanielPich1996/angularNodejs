import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingridient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import {Http, Response} from "@angular/http";
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    private recipes:Recipe[];
    recipeSelected = new EventEmitter<Recipe>();

    constructor(private http:Http, private slService:ShoppingListService) {}

    getAllRecipes(): Observable<Recipe[]> {
        
        return this.http.get('http://localhost:8080/api/getAllRecipes/')
            .map((response: Response) => {

                var res = response.json()
                var recipes:Recipe[] =[]

                for (let index = 0; index < res.length; index++) {
                    const recipe_data = res[index];

                    var recipe_id = recipe_data._id;
                    var recipe_name = recipe_data.name;
                    var recipe_description = recipe_data.description;
                    var recipe_image_path = recipe_data.image_path;
                    var ingredients_array = recipe_data.ingredients;
                    console.log(recipe_data.ingredients);

                    recipes.push(new Recipe(recipe_id, recipe_name, recipe_description, recipe_image_path, ingredients_array))
                }
                console.log(recipes)
                this.recipes = recipes
                return recipes
            });
    }

    addIngredientsToSL(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    getRecipes(){
        return this.recipes.slice();
    }


    addRecipe(recipe: Recipe){
        let ingredients = '';

        for (let ing of recipe.ingredients){
            ingredients += ing.name + ":" + ing.amount + ",";
        }
        ingredients = ingredients.slice(0, -1);

        return this.http.get("http://localhost:8080/api/addNewRecipe?userId=5d31fe7f13c11734dc3afbb1"+
                      "&&name=" + recipe.name + 
                      "&&description=" + recipe.description + 
                      "&&image_path=" + recipe.imagePath + 
                      "&&ingredients=" + ingredients).map(
            data => {
                let newRecipe = recipe;
                newRecipe.id = data.json();
                this.recipes.push(newRecipe);
                this.recipesChanged.next(this.recipes.slice());
            }
        );  
    }

    updateRecipe(id: string, newRecipe: Recipe){
        let ingredients = '';

        for (let ing of newRecipe.ingredients){
            ingredients += ing.name + ":" + ing.amount + ",";
        }
        ingredients = ingredients.slice(0, -1);

        return this.http.get("http://localhost:8080/api/updateRecipe?id=" + id +
                      "&&name=" + newRecipe.name +              
                      "&&description=" + newRecipe.description + 
                      "&&image_path=" + newRecipe.imagePath + 
                      "&&ingredients=" + ingredients).map(
            data => {
              for(let i = 0; i< this.recipes.length; i++){
                  if (this.recipes[i].id === id){
                    this.recipes[i] = newRecipe;
                    this.recipes[i].id = id;
                  }
              }
              this.recipesChanged.next(this.recipes.slice());
            }
        ); 
    }

    deleteRecipe(id: String){
        return this.http.get("http://localhost:8080/api/deleteRecipe?id=" + id).map(res => {
            let index;
            for(let i = 0; i< this.recipes.length; i++){
                if (this.recipes[i].id === id){
                  index = 1
                }
            }

            this.recipes.splice(index, 1);
            this.recipesChanged.next(this.recipes.slice());
        });
    }

    getRecipeById(id: number): Observable<Recipe>{
       return this.http.get("http://localhost:8080/api/getRecipe/?id=" + id).map(response => {
        const json = response.json();
        if (json != -1) {

            const recipe = new Recipe(json["_id"], 
                                      json["name"], 
                                      json["description"],
                                      json["image_path"], 
                                      json["ingredients"]);
            console.log(recipe);
            return recipe;
        } else {
            return null
        }        
       });
    }
}