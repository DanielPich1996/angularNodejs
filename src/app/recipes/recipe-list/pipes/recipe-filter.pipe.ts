import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { AuthService } from 'src/app/auth/auth.service';

@Pipe({
  name: 'recipeFilter'
})
export class RecipeFilterPipe implements PipeTransform {
  constructor(private authService: AuthService){}

  transform(recipes: Recipe[], min: number, max: number, showMy: boolean): any {
    
    if(showMy){
      var userid = this.authService.getUserId()
      return recipes.filter(recipe =>
        recipe.ingredients.length >= min &&
        recipe.ingredients.length <= max && 
        recipe.userId == userid);  
    }
    
    return recipes.filter(recipe =>
      recipe.ingredients.length >= min &&
      recipe.ingredients.length <= max);
  }

}
