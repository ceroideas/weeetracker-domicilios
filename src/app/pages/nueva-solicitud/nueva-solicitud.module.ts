import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaSolicitudPageRoutingModule } from './nueva-solicitud-routing.module';

import { NuevaSolicitudPage } from './nueva-solicitud.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    ComponentsModule,
    PipesModule,
    NuevaSolicitudPageRoutingModule
  ],
  declarations: [NuevaSolicitudPage]
})
export class NuevaSolicitudPageModule {}
