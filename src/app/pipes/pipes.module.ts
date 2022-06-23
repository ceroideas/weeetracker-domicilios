import { NgModule } from '@angular/core';
import { CortarFechaPipe } from './cortar-fecha.pipe';
import { CheckRespPipe } from './check-resp.pipe';

@NgModule({
  declarations: [CortarFechaPipe, CheckRespPipe],
  exports: [
    CortarFechaPipe,
    CheckRespPipe
  ]
})
export class PipesModule { }
