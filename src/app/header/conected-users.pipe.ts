import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conectedUsers'
})
export class ConectedUsersPipe implements PipeTransform {

  transform(value: number): any {
    if(value){
      return "conected users: " + value;
    }else{
      return "";
    }
    
  }
}
