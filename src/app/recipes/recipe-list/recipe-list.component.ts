import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit, OnDestroy {
 
  filterMin=0;
  filterMax=999;
  filterName = '';
  searchIsAnabaled = false;

  // display my recipes ONLY
  showMy = false;

  subscription: Subscription
  recipes:Recipe[] = [];
  searchRecipes: Recipe[] = [];
  allRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe(new_recipes => {      
        this.allRecipes = new_recipes.slice();
        this.recipes = this.allRecipes;
      }, err => console.log(err)
    ); 

    this.subscription = this.recipeService.recipesChanged.subscribe(newRecipes => {
      this.allRecipes = newRecipes.slice();
      this.recipes = this.allRecipes;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe(); 
  }

  onAddNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  showSearch(){
    this.searchIsAnabaled = !this.searchIsAnabaled;
    this.filterMin=0;
    this.filterMax=999;
    this.filterName = '';
    this.onSearchChange();
  }

  onSearchChange(){
    if(this.filterName == null || this.filterName == ''){
      this.recipes = this.allRecipes;
    } else{
      this.recipeService.freeSearchRecipes(this.filterName).subscribe(recipes => {
        this.recipes = recipes;
        console.log(recipes);
      });
    }
  }

  showMyChecked(){
    console.log(this.showMy);
  }

}
