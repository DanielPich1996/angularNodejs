import { Ingredient } from '../shared/ingridient.model';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

export class ShoppingListService {
    ingredientChanged = new EventEmitter<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingridients:Ingredient[] = [
        new Ingredient('','Apples', 5),
        new Ingredient('','Tomats', 10)
    ];

    getIngredients(){
        return this.ingridients.slice();
    }

    getIngridient(index: number){
        return this.ingridients[index];
    }

    addIngredient(ingredient:Ingredient){
        this.ingridients.push(ingredient);
        this.ingredientChanged.emit(this.ingridients.slice());
    }

    addIngredients(ingredients:Ingredient[]){
        this.ingridients.push(...ingredients);
        this.ingredientChanged.emit(this.ingridients.slice());
    }

    updateingredient( index: number, newIngrigient: Ingredient ){
        this.ingridients[index] = newIngrigient;
        this.ingredientChanged.next(this.ingridients.slice());
    }

    deleteIngredient(index: number){
        this.ingridients.splice(index, 1)
        this.ingredientChanged.next(this.ingridients.slice());
    }
}