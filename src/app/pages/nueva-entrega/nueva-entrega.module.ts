import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaEntregaPageRoutingModule } from './nueva-entrega-routing.module';

import { NuevaEntregaPage } from './nueva-entrega.page';
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
    NuevaEntregaPageRoutingModule
  ],
  declarations: [NuevaEntregaPage]
})
export class NuevaEntregaPageModule {}
