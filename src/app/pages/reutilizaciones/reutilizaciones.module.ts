import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReutilizacionesPageRoutingModule } from './reutilizaciones-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { ReutilizacionesPage } from './reutilizaciones.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    ReutilizacionesPageRoutingModule
  ],
  declarations: [ReutilizacionesPage]
})
export class ReutilizacionesPageModule {}
