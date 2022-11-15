import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../../services/token-interceptor.service';

import { IonicModule } from '@ionic/angular';

import { StepSevenEndPageRoutingModule } from './step-seven-end-routing.module';

import { StepSevenEndPage } from './step-seven-end.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    StepSevenEndPageRoutingModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  declarations: [StepSevenEndPage]
})
export class StepSevenEndPageModule {}
