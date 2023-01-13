import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

import { IonicStorageModule } from '@ionic/storage-angular';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { PipesModule } from './pipes/pipes.module';

import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';

import { NgSelect2Module } from 'ng-select2';

import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

import { Device } from '@awesome-cordova-plugins/device/ngx';



/*export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}*/

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    NgSelect2Module,
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipesModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es'},
    Device,
    NativeAudio,
    File,
    StatusBar,
    SplashScreen,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    BarcodeScanner,
    Camera,
    Keyboard,
    InAppBrowser,
    Geolocation,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
