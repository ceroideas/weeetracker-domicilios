import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisorImgPageRoutingModule } from './visor-img-routing.module';

import { VisorImgPage } from './visor-img.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisorImgPageRoutingModule
  ],
  declarations: [VisorImgPage]
})
export class VisorImgPageModule {}
