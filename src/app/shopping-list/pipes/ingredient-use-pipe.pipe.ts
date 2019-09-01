import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ingredientUsePipe'
})
export class IngredientUsePipePipe implements PipeTransform {

  transform(value: number, str: string): any {
    var returnStr = '';
    if(str != null && str != ''){
      if (value > 0 ){
        returnStr = str + " sum in recipes is " + value;
      }else{
        returnStr = str + " not found in recipes";
      }
    }

    return returnStr;
  }

}
