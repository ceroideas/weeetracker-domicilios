import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cortarFecha'
})
export class CortarFechaPipe implements PipeTransform {

  transform(value: string): any {
    
    
    let fecha = value.substring(0,6);
    fecha += value.substring(8,10);
    
    return fecha;
  }

}
