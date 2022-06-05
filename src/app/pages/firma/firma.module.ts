import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirmaPageRoutingModule } from './firma-routing.module';

import { FirmaPage } from './firma.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignaturePadModule,
    FirmaPageRoutingModule
  ],
  declarations: [FirmaPage]
})
export class FirmaPageModule {}
