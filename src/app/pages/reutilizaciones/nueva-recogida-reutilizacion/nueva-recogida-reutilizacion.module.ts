import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaRecogidaReutilizacionPageRoutingModule } from './nueva-recogida-reutilizacion-routing.module';

import { NuevaRecogidaReutilizacionPage } from './nueva-recogida-reutilizacion.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
    NuevaRecogidaReutilizacionPageRoutingModule
  ],
  declarations: [NuevaRecogidaReutilizacionPage]
})
export class NuevaRecogidaReutilizacionPageModule {}
