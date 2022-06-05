import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { IdentificacionService } from './services/identificacion.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private usuarioService : UsuarioService,
    private screenOrientation : ScreenOrientation,
    private translateService : TranslateService,
    private identificacionService : IdentificacionService,
    private keyboard : Keyboard
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
       //Language
       this.translateService.setDefaultLang('es');
       this.translateService.use('es');

      if(await this.estaLogeado()){
        this.router.navigateByUrl("/home");
      }else{
        this.router.navigateByUrl("/");
      }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#0D8B7A")
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.splashScreen.hide();
    
      // this.insertarResiduosDomicilio();
      
    });
  }

  async estaLogeado(){
    if(await this.usuarioService.tokenValido()){
      if(await this.usuarioService.cargarToken()){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    };
  }

  insertarResiduosDomicilio(){
    setInterval(()=>{
      this.identificacionService.hayIdentificaciones()
    },1000 * 60 * 60);   
  }
  
}
