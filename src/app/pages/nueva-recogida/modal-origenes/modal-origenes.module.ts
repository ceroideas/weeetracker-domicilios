import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOrigenesPageRoutingModule } from './modal-origenes-routing.module';

import { ModalOrigenesPage } from './modal-origenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalOrigenesPageRoutingModule
  ],
  declarations: [ModalOrigenesPage]
})
export class ModalOrigenesPageModule {}
