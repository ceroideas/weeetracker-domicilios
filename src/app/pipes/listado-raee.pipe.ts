import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listadoRaee'
})
export class ListadoRaeePipe implements PipeTransform {

  transform(value: any, array: any, type: any): any {
    if (type == 'contenedor') {
      let f = array.find(x=>x.pidTipoContenedor == value);
      return f ? f.nombre : '--';
    }

    if (type == 'residuo') {
      let f = array.find(x=>x.pidResiduoEspecifico == value);
      return f ? f.nombre : '--';
    }
  }

}
