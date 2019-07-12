import { Ingredient } from '../shared/ingridient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {
    ingredientChanged = new EventEmitter<Ingredient[]>();

    private ingridients:Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomats', 10)
    ];

    getIngredients(){
        return this.ingridients.slice();
    }

    addIngredient(ingredient:Ingredient){
        this.ingridients.push(ingredient);
        this.ingredientChanged.emit(this.ingridients.slice());
    }

    addIngredients(ingredients:Ingredient[]){
        this.ingridients.push(...ingredients);
        this.ingredientChanged.emit(this.ingridients.slice());
    }
}