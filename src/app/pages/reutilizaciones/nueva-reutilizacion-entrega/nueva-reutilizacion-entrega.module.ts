import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaReutilizacionEntregaPageRoutingModule } from './nueva-reutilizacion-entrega-routing.module';

import { NuevaReutilizacionEntregaPage } from './nueva-reutilizacion-entrega.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    ReactiveFormsModule,
    NuevaReutilizacionEntregaPageRoutingModule
  ],
  declarations: [NuevaReutilizacionEntregaPage]
})
export class NuevaReutilizacionEntregaPageModule {}
