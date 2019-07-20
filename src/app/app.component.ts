import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  loadedFeature = "recipes"
  onNavigate(feature: string){
      this.loadedFeature = feature;
  }

  constructor() { }
  Repdata;
  valbutton = "Save";
}
