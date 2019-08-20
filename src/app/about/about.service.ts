import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: Http) { }

  getBranches(){
    return this.http.get("http://localhost:8080/api/getBranches").map(data => {
      var json = data.json();
      var branches = []
      for(let branch of json){
        branches.push({name: branch.name, adress: branch.address, lng: +branch.lng, lat: +branch.lat})
      }
      console.log(branches);
      return branches.slice();
    })
  }
}
