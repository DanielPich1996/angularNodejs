import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  private userId = null;

  signUp(email: string, password: string): Observable<string>{
    return  this.http.get("http://localhost:8080/api/signUp?" +
                  "email=" + email+ 
                  "&&password=" + password).map(data => {
                    var id = data.json();
                    if (id != "-1"){
                      this.saveId(id);
                    }
                    return id;
                  });
  }

  getUserId(){
    return this.userId;
  }

  login(email: string, password: string): Observable<string>{
    return  this.http.get("http://localhost:8080/api/login?" +
                  "email=" + email+ 
                  "&&password=" + password).map(data => {
                    var id = data.json();
                    if (id != "-1"){
                      this.saveId(id);
                    }
                    return id;
                   });
  }

  saveId(id: string){
    if (id){
      this.userId = id;
    }
    localStorage.setItem('userId', id);
  }

  aotoLogin(){
    var id = localStorage.getItem("userId");
    if (!id){
      return;
    } 
    this.userId = id;
  }

  logOut(){
    this.userId = null;
    localStorage.removeItem("userId");
  }
}
