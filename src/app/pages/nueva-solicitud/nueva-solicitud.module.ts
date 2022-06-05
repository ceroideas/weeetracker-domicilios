import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaSolicitudPageRoutingModule } from './nueva-solicitud-routing.module';

import { NuevaSolicitudPage } from './nueva-solicitud.page';
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
    NuevaSolicitudPageRoutingModule
  ],
  declarations: [NuevaSolicitudPage]
})
export class NuevaSolicitudPageModule {}
