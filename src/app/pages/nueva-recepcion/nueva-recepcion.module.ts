import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaRecepcionPageRoutingModule } from './nueva-recepcion-routing.module';

import { NuevaRecepcionPage } from './nueva-recepcion.page';
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
    NuevaRecepcionPageRoutingModule
  ],
  declarations: [NuevaRecepcionPage]
})
export class NuevaRecepcionPageModule {}
