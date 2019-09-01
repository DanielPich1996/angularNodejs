import { Ingredient } from '../shared/ingridient.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http } from '@angular/http';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ShoppingListService {
    ingredientChanged = new EventEmitter<Ingredient[]>();
    startedEditing = new Subject<number>();

    constructor( private http:Http, 
                 private authService: AuthService){}

    private ingridients:Ingredient[] = [];

    getIngredients(){
        return this.ingridients.slice();
    }

    getIngridient(index: number){
        return this.ingridients[index];
    }

    addIngredient(ingredient:Ingredient){
        var index = -1
        for(let i = 0; i < this.ingridients.length; i++){
            if (this.ingridients[i].name.toLowerCase() === 
                ingredient.name.toLowerCase()){
                index = i;
                this.ingridients[i].amount = 
                    this.ingridients[i].amount + ingredient.amount
            }
        }

        if (index == -1){
            this.ingridients.push(ingredient);
        }      
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

    updateShoppingList(){
        let shoppingList = '';
        const userId = this.authService.getUserId();

        for (let ing of this.ingridients){
            shoppingList += ing.name + ":" + ing.amount + ",";
        }
        
        shoppingList = shoppingList.slice(0, -1);

        return this.http.get("http://localhost:8080/api/updateShoppingList?userId=" + userId +
                      "&&ingredients=" + shoppingList).map(data => {}
        ); 
    }

    getShoppingList(){
        const userId = this.authService.getUserId();
        return this.http.get("http://localhost:8080/api/getShoppingListById?userId=" + userId ).map(
            data => {
                var json = data.json();
                this.ingridients = json.ingredients.slice();
                this.ingredientChanged.next(this.ingridients.slice());
            }
        ); 
    }

    getIngredientsCount(){
        const userId = this.authService.getUserId();
        return this.http.get("http://localhost:8080/api/getUserTotalIngredientsAmount/?userId=" + userId ).map(
            data => {
                var json = data.json();
                return json;
            }
        ); 
    }
}