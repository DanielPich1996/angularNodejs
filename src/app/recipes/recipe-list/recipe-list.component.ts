import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
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
  subscription: Subscription
  recipes:Recipe[] = [];

  constructor(private recipeService: RecipeService, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe(new_recipes => {      
        this.recipes = new_recipes.slice();
      }, err => console.log(err)
    ); 

    this.subscription = this.recipeService.recipesChanged.subscribe(newRecipes => {
      this.recipes = newRecipes
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
  }
}
