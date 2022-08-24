import { NgModule } from '@angular/core';
import { CortarFechaPipe } from './cortar-fecha.pipe';
import { CheckRespPipe } from './check-resp.pipe';
import { ListadoRaeePipe } from './listado-raee.pipe';

@NgModule({
  declarations: [CortarFechaPipe, CheckRespPipe, ListadoRaeePipe],
  exports: [CortarFechaPipe,CheckRespPipe,ListadoRaeePipe]
})
export class PipesModule { }
