import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';


@Injectable()
export class RecipeResolver implements Resolve<Recipe> {
  constructor(private recipeService: RecipeService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Recipe> {
    console.log(route.data);
    return this.recipeService.getRecipeById(route.data['id']);
  }
}