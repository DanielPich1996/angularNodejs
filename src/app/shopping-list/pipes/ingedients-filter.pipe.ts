import { Pipe, PipeTransform } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingridient.model';

@Pipe({
  name: 'ingedientsFilter'
})
export class IngedientsFilterPipe implements PipeTransform {

  transform(ingredients: Ingredient[], str: string, min: number, max: number): any {
    return ingredients.filter(ingredient => ingredient.name.toLocaleLowerCase().includes(str.toLocaleLowerCase()) &&
                              ingredient.amount >= min &&  
                              ingredient.amount <= max);
  }

}
