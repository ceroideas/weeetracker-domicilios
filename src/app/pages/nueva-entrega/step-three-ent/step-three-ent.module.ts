import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../../services/token-interceptor.service';

import { IonicModule } from '@ionic/angular';

import { StepThreeEntPageRoutingModule } from './step-three-ent-routing.module';

import { StepThreeEntPage } from './step-three-ent.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
    HttpClientModule,
    StepThreeEntPageRoutingModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  declarations: [StepThreeEntPage]
})
export class StepThreeEntPageModule {}
