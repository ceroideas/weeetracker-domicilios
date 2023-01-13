import { NgModule } from '@angular/core';
import { CortarFechaPipe } from './cortar-fecha.pipe';
import { CheckRespPipe } from './check-resp.pipe';
import { ListadoRaeePipe } from './listado-raee.pipe';
import { SearchPipe } from './search.pipe';
import { TipoterceroPipe } from './tipotercero.pipe';

@NgModule({
  declarations: [CortarFechaPipe, CheckRespPipe, ListadoRaeePipe, SearchPipe, TipoterceroPipe],
  exports: [CortarFechaPipe,CheckRespPipe,ListadoRaeePipe, SearchPipe, TipoterceroPipe]
})
export class PipesModule { }
