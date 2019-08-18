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
  id: String;

  constructor(private recipeService:RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data.recipe;

    this.route.params.subscribe(params => {
      this.recipe = this.route.snapshot.data.recipe;
      this.id = params['id'];
      console.log(this.recipe);
    });
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToSL(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id).subscribe(res => {
      
    });
    this.router.navigate(['/recipes']);
  }
}
