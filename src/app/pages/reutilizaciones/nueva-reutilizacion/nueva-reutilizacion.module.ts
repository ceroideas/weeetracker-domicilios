import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaReutilizacionPageRoutingModule } from './nueva-reutilizacion-routing.module';

import { NuevaReutilizacionPage } from './nueva-reutilizacion.page';
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
    NuevaReutilizacionPageRoutingModule
  ],
  declarations: [NuevaReutilizacionPage]
})
export class NuevaReutilizacionPageModule {}
