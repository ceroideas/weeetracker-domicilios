import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperativasRealizadasPageRoutingModule } from './operativas-realizadas-routing.module';

import { OperativasRealizadasPage } from './operativas-realizadas.page';
import { ComponentsModule } from '../../components/components.module';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    OperativasRealizadasPageRoutingModule
  ],
  declarations: [OperativasRealizadasPage]
})
export class OperativasRealizadasPageModule {}
