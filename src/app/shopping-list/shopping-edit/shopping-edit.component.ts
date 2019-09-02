import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingridient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription : Subscription;
  editMode = false;
  editedItemIndex : number;
  editedItem : Ingredient;
  totalIngredientUse = 0;

  constructor( private slService:ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe((index:number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngridient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    });
  }

  onAddItem(form: NgForm){
    const value = form.value;
    const newIngrigient = new Ingredient( value.name, value.amount);
    if (this.editMode) {
      this.slService.updateingredient(this.editedItemIndex, newIngrigient)
    } else {
      
      this.slService.addIngredient(newIngrigient);
    }
    this.onClear();
  }

  onClear(){
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();  
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSaveShoppingList(){
    this.slService.updateShoppingList().subscribe(data => {
      alert("Shopping list saved sucssesfuly");
    }, err => {
      alert("cannot save shopping list tray again");
    });
  }

  getTotalUse(str: string){
    if(str == '' || str == null){
      this.totalIngredientUse = 0;
    } else{
      this.slService.getTotalUseInRecipes(str).subscribe(val => {
        this.totalIngredientUse = +val;
      })
    }
    
  }
}
