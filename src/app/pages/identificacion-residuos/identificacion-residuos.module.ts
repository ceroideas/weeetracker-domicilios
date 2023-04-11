import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentificacionResiduosPageRoutingModule } from './identificacion-residuos-routing.module';

import { IdentificacionResiduosPage } from './identificacion-residuos.page';
import { ComponentsModule } from '../../components/components.module';
// import { FirmaPageModule } from '../firma/firma.module';
// import { FirmaPage } from '../firma/firma.page';
// import { VisorImgPage } from '../visor-img/visor-img.page';
// import { VisorImgPageModule } from '../visor-img/visor-img.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  entryComponents:[
    // FirmaPage,
    // VisorImgPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    // FirmaPageModule,
    // VisorImgPageModule,
    TranslateModule,
    IdentificacionResiduosPageRoutingModule
  ],
  declarations: [IdentificacionResiduosPage]
})
export class IdentificacionResiduosPageModule {}
