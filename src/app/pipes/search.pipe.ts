import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, query: any): any {
      if(!query)return value;
      return value.filter(x=>x['nombre'].toLowerCase().includes(query.toLowerCase()));
  }

}
