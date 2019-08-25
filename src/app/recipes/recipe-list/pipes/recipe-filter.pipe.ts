import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Pipe({
  name: 'recipeFilter'
})
export class RecipeFilterPipe implements PipeTransform {

  transform(recipes: Recipe[], str:string, min: number, max: number): any {
    return recipes.filter(recipe => 
                            recipe.name.toLocaleLowerCase().includes(str.toLocaleLowerCase()) &&
                            recipe.ingredients.length >= min &&
                            recipe.ingredients.length <= max);
  }

}
