import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleSolicitudPageRoutingModule } from './detalle-solicitud-routing.module';

import { DetalleSolicitudPage } from './detalle-solicitud.page';
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
    DetalleSolicitudPageRoutingModule
  ],
  declarations: [DetalleSolicitudPage]
})
export class DetalleSolicitudPageModule {}
