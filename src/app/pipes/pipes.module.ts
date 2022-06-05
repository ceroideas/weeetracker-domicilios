import { NgModule } from '@angular/core';
import { CortarFechaPipe } from './cortar-fecha.pipe';

@NgModule({
  declarations: [CortarFechaPipe],
  exports: [
    CortarFechaPipe
  ]
})
export class PipesModule { }
