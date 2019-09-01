import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  amountStr = "";
  recipe:Recipe;
  id: String;
  currUserId: string;

  constructor(private recipeService:RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data.recipe;
    this.currUserId = this.authService.getUserId();

    this.route.params.subscribe(params => {
      this.recipe = this.route.snapshot.data.recipe;
      this.id = params['id'];
      console.log(this.recipe);
      this.getAmountByName();
      this.currUserId = this.authService.getUserId();
    });
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id).subscribe(res => {
      
    });
    this.router.navigate(['/recipes']);
  }

  getAmountByName(){
    this.recipeService.getAmountByName(this.recipe.name).subscribe(res => {
      if (res != "-1"){
        this.amountStr = "there is " + res + " " + this.recipe.name + " recipes";
      }
    });
  }

}
