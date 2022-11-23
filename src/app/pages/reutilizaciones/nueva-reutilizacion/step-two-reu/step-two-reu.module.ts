import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../../../services/token-interceptor.service';

import { IonicModule } from '@ionic/angular';

import { StepTwoReuPageRoutingModule } from './step-two-reu-routing.module';

import { StepTwoReuPage } from './step-two-reu.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';

import { NgSelect2Module } from 'ng-select2';

@NgModule({
  imports: [
    NgSelect2Module,
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    StepTwoReuPageRoutingModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  declarations: [StepTwoReuPage]
})
export class StepTwoReuPageModule {}
