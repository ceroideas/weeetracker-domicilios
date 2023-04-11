import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockUsuarioPageRoutingModule } from './stock-usuario-routing.module';

import { StockUsuarioPage } from './stock-usuario.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    ComponentsModule,
    StockUsuarioPageRoutingModule
  ],
  declarations: [StockUsuarioPage]
})
export class StockUsuarioPageModule {}
