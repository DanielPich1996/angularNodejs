import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  selectedRecipe:Recipe;

  // dependency injection - brings an instance of recipe service to this component
  constructor(private recipeService:RecipeService) { }

  ngOnInit() {
    if (this)
    this.recipeService.recipeSelected.subscribe(
      (recipe:Recipe) => {
        this.selectedRecipe = recipe;
      }
    );
  }

}
