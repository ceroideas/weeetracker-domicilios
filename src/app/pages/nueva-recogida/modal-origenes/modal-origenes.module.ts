import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOrigenesPageRoutingModule } from './modal-origenes-routing.module';

import { ModalOrigenesPage } from './modal-origenes.page';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ModalOrigenesPageRoutingModule
  ],
  declarations: [ModalOrigenesPage]
})
export class ModalOrigenesPageModule {}
