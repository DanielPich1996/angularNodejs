import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingridient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {

    recipeSelected =new EventEmitter<Recipe>();

    constructor(private slService:ShoppingListService){}

    private recipes:Recipe[] = [
        new Recipe(
            'Burger', 
            'The best one', 
            'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg',
            [new Ingredient('Meat', 5),
             new Ingredient('Bred', 10)]),
        new Recipe(
            'Pasta', 
            'For vegans', 
            'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg',
            [new Ingredient('Pasta', 5),
             new Ingredient('Tomats', 10)])
    ];

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientsToSL(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

}