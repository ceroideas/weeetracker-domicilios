import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaSolicitudPageRoutingModule } from './consulta-solicitud-routing.module';

import { ConsultaSolicitudPage } from './consulta-solicitud.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    TranslateModule,
    ReactiveFormsModule,
    ConsultaSolicitudPageRoutingModule
  ],
  declarations: [ConsultaSolicitudPage]
})
export class ConsultaSolicitudPageModule {}
