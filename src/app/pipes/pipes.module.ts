import { NgModule } from '@angular/core';
import { CortarFechaPipe } from './cortar-fecha.pipe';
import { CheckRespPipe } from './check-resp.pipe';
import { ListadoRaeePipe } from './listado-raee.pipe';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [CortarFechaPipe, CheckRespPipe, ListadoRaeePipe, SearchPipe],
  exports: [CortarFechaPipe,CheckRespPipe,ListadoRaeePipe, SearchPipe]
})
export class PipesModule { }
