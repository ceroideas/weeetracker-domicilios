import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stock2PageRoutingModule } from './stock2-routing.module';

import { Stock2Page } from './stock2.page';
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
    Stock2PageRoutingModule
  ],
  declarations: [Stock2Page]
})
export class Stock2PageModule {}
