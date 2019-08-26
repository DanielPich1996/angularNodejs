import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conectedUsers'
})
export class ConectedUsersPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
