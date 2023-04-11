import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaStockPageRoutingModule } from './consulta-stock-routing.module';

import { ConsultaStockPage } from './consulta-stock.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    ComponentsModule,
    ConsultaStockPageRoutingModule
  ],
  declarations: [ConsultaStockPage]
})
export class ConsultaStockPageModule {}
