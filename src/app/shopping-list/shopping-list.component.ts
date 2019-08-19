import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingridient.model';
import { ShoppingListService } from './shopping-list.service'; 
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingridients:Ingredient[];
  subscription : Subscription;

  constructor(private slService:ShoppingListService) { }

  ngOnInit() {
    this.slService.getShoppingList().subscribe(res => {
      this.ingridients = this.slService.getIngredients();
    });
    this.subscription = this.slService.ingredientChanged.subscribe(
      (ingredients:Ingredient[]) => {
        this.ingridients = ingredients;
      }
    );
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
