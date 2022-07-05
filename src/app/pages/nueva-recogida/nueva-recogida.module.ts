import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaRecogidaPageRoutingModule } from './nueva-recogida-routing.module';

import { NuevaRecogidaPage } from './nueva-recogida.page';
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
    NuevaRecogidaPageRoutingModule
  ],
  declarations: [NuevaRecogidaPage]
})
export class NuevaRecogidaPageModule {}
