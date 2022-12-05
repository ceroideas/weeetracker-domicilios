import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../services/token-interceptor.service';

import { IonicModule } from '@ionic/angular';

import { CambioPasswordPageRoutingModule } from './cambio-password-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';
import { CambioPasswordPage } from './cambio-password.page';
import { TranslateModule } from '@ngx-translate/core';

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
    CambioPasswordPageRoutingModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  declarations: [CambioPasswordPage]
})
export class CambioPasswordPageModule {}
