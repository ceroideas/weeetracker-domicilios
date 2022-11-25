import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PesarReutilizacionesPageRoutingModule } from './pesar-reutilizaciones-routing.module';

import { PesarReutilizacionesPage } from './pesar-reutilizaciones.page';
import { ComponentsModule } from '../../../components/components.module';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    PesarReutilizacionesPageRoutingModule
  ],
  declarations: [PesarReutilizacionesPage]
})
export class PesarReutilizacionesPageModule {}
