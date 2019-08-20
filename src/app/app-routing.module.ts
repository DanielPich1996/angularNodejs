import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeResolver } from './recipes/recipeResolver';
import { AuthComponent } from './auth/auth.component';
import { AuthGaurd } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes  = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full'},
    { 
        path: 'recipes', 
        component: RecipesComponent, 
        canActivate:[AuthGaurd], 
        children:[
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: {recipe: RecipeResolver} },
            { path: ':id/edit', component: RecipeEditComponent, resolve: {recipe: RecipeResolver} }
        ]
    },
    { 
        path: 'shopping-list', 
        canActivate:[AuthGaurd],
        component: ShoppingListComponent 
    },
    { path: 'auth', component: AuthComponent},
    { path: 'about', component: AboutComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes)],
    exports: [ RouterModule ]
})

export class AppRoutingModule {

}