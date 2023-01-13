import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipotercero'
})
export class TipoterceroPipe implements PipeTransform {

  tipos = [
    {id:16,cod:'ADH'},
    {id:19,cod:'PT'},
    {id:21,cod:'CAT'},
    {id:23,cod:'OL'},
    {id:28,cod:'SCRAP'},
    {id:34,cod:'OFI'},
    {id:37,cod:'BIL'},
    {id:38,cod:'OPRM'},
    {id:39,cod:'PRnS'},
    {id:40,cod:'PRnM'},
    {id:41,cod:'ADIS'},
    {id:42,cod:'AEELL'},
    {id:43,cod:'DEU'},
    {id:44,cod:'AGES'},
    {id:45,cod:'AGO'},
    {id:47,cod:'CPR'},
    {id:48,cod:'REC'}
  ];

  transform(value: any) {
    
    let tipo = this.tipos.find(x=>x.id == value);
    return tipo ? tipo.cod : "--";

  }

}
