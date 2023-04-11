import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaEtiquetasPageRoutingModule } from './busqueda-etiquetas-routing.module';

import { BusquedaEtiquetasPage } from './busqueda-etiquetas.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    BusquedaEtiquetasPageRoutingModule
  ],
  declarations: [BusquedaEtiquetasPage]
})
export class BusquedaEtiquetasPageModule {}
