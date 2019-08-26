import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conectedUsers'
})
export class ConectedUsersPipe implements PipeTransform {

  transform(value: number): any {
    return "conected users: " + value;
  }
}
