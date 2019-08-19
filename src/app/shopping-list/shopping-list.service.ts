import { Ingredient } from '../shared/ingridient.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class ShoppingListService {
    ingredientChanged = new EventEmitter<Ingredient[]>();
    startedEditing = new Subject<number>();

    constructor( private http:Http ){}

    private ingridients:Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomats', 10)
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

    updateShoppingList(userId: string){
        let shoppingList = '';

        for (let ing of this.ingridients){
            shoppingList += ing.name + ":" + ing.amount + ",";
        }
        shoppingList = shoppingList.slice(0, -1);

        return this.http.get("http://localhost:8080/api/updateShoppingList?userId=" + userId +
                      "&&ingredients=" + shoppingList).map(
            data => {
            }
        ); 
    }

    getShoppingList(){
        return this.http.get("http://localhost:8080/api/getShoppingListById?userId=" + "5d31fe7f13c11734dc3afbb1" ).map(
            data => {
                var json = data.json();
                this.ingridients = json.ingredients.slice();
            }
        ); 
    }
}