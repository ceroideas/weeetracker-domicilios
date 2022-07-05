import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalGestoresPageRoutingModule } from './modal-gestores-routing.module';

import { ModalGestoresPage } from './modal-gestores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalGestoresPageRoutingModule
  ],
  declarations: [ModalGestoresPage]
})
export class ModalGestoresPageModule {}
