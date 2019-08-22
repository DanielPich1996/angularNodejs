import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { HttpModule, BrowserXhr } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';

import { CustExtBrowserXhr } from 'src/cust-ext-browser-xhr';

import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeService } from './recipes/recipe.service';
import { RecipeResolver } from './recipes/recipeResolver';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import { AuthGaurd } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { AgmCoreModule } from '@agm/core';
import { GraphDirective } from './shared/graph.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    RecipeStartComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    AuthComponent,
    AboutComponent,
    GraphDirective
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    AppRoutingModule,
    HttpModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({apiKey: "AIzaSyChHqn4cqme0MTgu6QRmaJHppcGs_NbeIc"})
  ],
  providers: [ShoppingListService, RecipeService, RecipeResolver, AuthService, AuthGaurd,
    {provide: BrowserXhr, useClass:CustExtBrowserXhr},],
  bootstrap: [AppComponent]
})
export class AppModule { }
