import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../../../services/token-interceptor.service';

import { IonicModule } from '@ionic/angular';

import { StepOneReuPageRoutingModule } from './step-one-reu-routing.module';

import { StepOneReuPage } from './step-one-reu.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReactiveFormsModule,
    ComponentsModule,
    StepOneReuPageRoutingModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  declarations: [StepOneReuPage]
})
export class StepOneReuPageModule {}
