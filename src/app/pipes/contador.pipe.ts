import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contador',
  pure: false
})
export class ContadorPipe implements PipeTransform {

  transform(value: any, key: any, key2: any = null) {
    let total = 0;

    if (key2) {
      for(let j of value)
      {
        for (let i of j[key])
        {
          total+=i[key2];
        }
      }
    }else{

      for (let i of value)
      {
        total+=i[key];
      }
    }
    return total;
  }

}
