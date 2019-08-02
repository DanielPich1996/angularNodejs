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

                var recipe_id = recipe_data._id
                var recipe_name = recipe_data.name
                var recipe_description = recipe_data.description
                var recipe_image_path = recipe_data.image_path

                var ingredients_array:Ingredient[] = []
                var ingredients_keys = Object.keys(recipe_data.ingredients)
              
                for (let ing_index = 0; ing_index < ingredients_keys.length; ing_index++) {
                    var ingredient_key = ingredients_keys[ing_index]
                    var ingredient_amount = recipe_data.ingredients[ingredient_key];

                    ingredients_array.push(new Ingredient(ingredient_key, ingredient_key,ingredient_amount))
                }

                recipes.push(new Recipe(recipe_id, recipe_name, recipe_description, recipe_image_path, ingredients_array))
            }

            this.recipes = recipes
            return recipes
        })
    }

    getRecipe(index: number){
        if(typeof this.recipes === 'undefined') {
            return undefined
        }
        else {
            return this.recipes[index];
        }
        
    }

    addIngredientsToSL(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }
    
    // DeleteRecipe(recipe: Recipe){
    //    for (let index = 0; index < this.recipes.length; index++) {
    //        if (this.recipes[index].name == recipe.name) {
    //            this.recipes.splice(index, 1);
    //        }
    //    }
    // }

    addRecipeToList(recipe: Recipe){
        this.recipes.push(recipe);
    }

    getRecipes(){
        return this.recipes.slice();
    }


    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}