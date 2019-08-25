import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  error:string = null;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit(form: NgForm){
    var email = form.value.email;
    var password = form.value.password;
    this.error = null;

    form.reset();

    if(this.isLoginMode){
      this.authService.login(email, password).subscribe(res => {
        console.log(res);
        if(res == "0"){
          this.error = "email or password incorrect"
        }else{
          this.router.navigate(['/recipes']);
        }
      }, err => {
        this.error = err
      }); 
    }else{

      this.authService.signUp(email, password).subscribe(res => {
        if(res == "0"){
          this.error = "user exist"
        }else{
          this.router.navigate(['/recipes'])
        }
      }, err => {

      });
    }
  } 
}
