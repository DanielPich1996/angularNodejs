import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipe:Recipe = new Recipe("","","","",[],'');
  id: string;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private recipeService:RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.editMode = params['id'] != null;
      this.id = params['id'];
      this.recipe = this.route.snapshot.data.recipe;
      this.initForm();   
    });
  }

  private initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    let recipeIngredients = new FormArray([]);

    if (this.editMode){
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDescription = this.recipe.description;

      if (this.recipe['ingredients']){

        for( let ing of this.recipe.ingredients){
          recipeIngredients.push(new FormGroup({
              'name': new FormControl(ing.name, Validators.required),
              'amount': new FormControl(ing.amount, 
                                       [Validators.required,
                                       Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }

    }

    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName, Validators.required),
      'imagePath' : new FormControl(recipeImagePath, Validators.required),
      'description' : new FormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredients
    });
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
    // const newRecipe = new Recipe("",
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // )

    if (this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value).subscribe(res => {
        alert("Recipe saved sucssesfuly");
        this.router.navigate(['../'], {relativeTo: this.route});
      }, err=> {
        alert("Faild to save recipe, tray again");
      });

    } else {

      this.recipeService.addRecipe(this.recipeForm.value).subscribe(res => {
        alert("Recipe saved sucssesfuly");
        this.router.navigate(['/recipes']);
      }, err=> {
        alert("Faild to save recipe, tray again");
      });
    }
  }

  onAddIngridient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(0, [Validators.required,
                                    Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));    
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
