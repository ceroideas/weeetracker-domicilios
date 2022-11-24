import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaReutilizacionEntregaDirectaPageRoutingModule } from './nueva-reutilizacion-entrega-directa-routing.module';

import { NuevaReutilizacionEntregaDirectaPage } from './nueva-reutilizacion-entrega-directa.page';
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
    NuevaReutilizacionEntregaDirectaPageRoutingModule
  ],
  declarations: [NuevaReutilizacionEntregaDirectaPage]
})
export class NuevaReutilizacionEntregaDirectaPageModule {}
