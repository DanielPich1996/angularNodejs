import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingridient.model';
import { ShoppingListService } from './shopping-list.service'; 

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingridients:Ingredient[];

  constructor(private slService:ShoppingListService) { }

  ngOnInit() {
    this.ingridients = this.slService.getIngredients();
    this.slService.ingredientChanged.subscribe(
      (ingredients:Ingredient[]) => {
        this.ingridients = ingredients;
      }
    );
  }
}
