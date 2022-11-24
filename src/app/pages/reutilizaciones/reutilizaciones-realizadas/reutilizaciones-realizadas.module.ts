import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReutilizacionesRealizadasPageRoutingModule } from './reutilizaciones-realizadas-routing.module';

import { ReutilizacionesRealizadasPage } from './reutilizaciones-realizadas.page';
import { ComponentsModule } from '../../../components/components.module';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    ReutilizacionesRealizadasPageRoutingModule
  ],
  declarations: [ReutilizacionesRealizadasPage]
})
export class ReutilizacionesRealizadasPageModule {}
