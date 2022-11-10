import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaEntregaDirectaPageRoutingModule } from './nueva-entrega-directa-routing.module';

import { NuevaEntregaDirectaPage } from './nueva-entrega-directa.page';
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
    NuevaEntregaDirectaPageRoutingModule
  ],
  declarations: [NuevaEntregaDirectaPage]
})
export class NuevaEntregaDirectaPageModule {}
