import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntradasSalidasPageRoutingModule } from './entradas-salidas-routing.module';

import { EntradasSalidasPage } from './entradas-salidas.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { VisorImgPageModule } from '../visor-img/visor-img.module';
import { VisorImgPage } from '../visor-img/visor-img.page';

@NgModule({
  entryComponents:[
    VisorImgPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
    VisorImgPageModule,
    EntradasSalidasPageRoutingModule
  ],
  declarations: [EntradasSalidasPage]
})
export class EntradasSalidasPageModule {}
