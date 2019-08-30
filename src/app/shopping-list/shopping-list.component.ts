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
  ingridients:Ingredient[] = [];
  subscription : Subscription;
  filterMin=0;
  filterMax=999;
  filterName = '';
  searchIsAnabaled = false;
  ingredientsCount : number;

  constructor(private slService:ShoppingListService) { }

  ngOnInit() {
    this.slService.getShoppingList().subscribe(res => {
      this.ingridients = this.slService.getIngredients();
    });

    this.getIngredientCount();
    
    this.subscription = this.slService.ingredientChanged.subscribe(
      (ingredients:Ingredient[]) => {
        this.ingridients = ingredients;
        this.ingredientsCount = ingredients.length;
      }
    );
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  showSearch(){
    this.searchIsAnabaled = !this.searchIsAnabaled;
    this.filterMin=0;
    this.filterMax=999;
    this.filterName = '';
  }

  getIngredientCount(){
    this.slService.getIngredientsCount().subscribe(res => {
      if(res != -1){
        this.ingredientsCount = +res[0].total;
      }
    });
  }
}
