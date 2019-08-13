import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe:Recipe;
  id: number;

  constructor(private recipeService:RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data.recipe;
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   const tmpRecipe = this.recipeService.getRecipe(this.id);
    //   if (typeof tmpRecipe === 'undefined') {
    //     this.router.navigate(['/recipes'])
    //   } else {
    //     this.recipe = tmpRecipe;
    //   }   
    // });
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToSL(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
