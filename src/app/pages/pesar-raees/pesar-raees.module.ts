import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PesarRaeesPageRoutingModule } from './pesar-raees-routing.module';

import { PesarRaeesPage } from './pesar-raees.page';
import { ComponentsModule } from '../../components/components.module';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    PesarRaeesPageRoutingModule
  ],
  declarations: [PesarRaeesPage]
})
export class PesarRaeesPageModule {}
