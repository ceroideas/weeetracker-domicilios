import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkResp'
})
export class CheckRespPipe implements PipeTransform {

  transform(resps: [], value: string): any {
    if (!resps) {
      return false;
    }
    return resps.find(x=>x == value);
  }

}
