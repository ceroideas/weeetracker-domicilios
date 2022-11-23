import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../../../services/token-interceptor.service';

import { IonicModule } from '@ionic/angular';

import { StepSixReuPageRoutingModule } from './step-six-reu-routing.module';

import { StepSixReuPage } from './step-six-reu.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
    HttpClientModule,
    PipesModule,
    StepSixReuPageRoutingModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  declarations: [StepSixReuPage]
})
export class StepSixReuPageModule {}
