import { NgModule } from '@angular/core';
import { CortarFechaPipe } from './cortar-fecha.pipe';
import { ContadorPipe } from './contador.pipe';

@NgModule({
  declarations: [CortarFechaPipe, ContadorPipe],
  exports: [
    CortarFechaPipe,
    ContadorPipe
  ]
})
export class PipesModule { }
