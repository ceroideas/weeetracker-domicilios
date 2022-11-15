import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { EventsService } from './services/events.service';
import { TranslateService } from '@ngx-translate/core';
import { IdentificacionService } from './services/identificacion.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { ConsultasService } from './services/consultas.service';

import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';

import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [File,WebView,/*FileTransfer,*/AndroidPermissions]
})

export class AppComponent {

  constructor(
    private nativeAudio: NativeAudio,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private usuarioService : UsuarioService,
    private screenOrientation : ScreenOrientation,
    private translateService : TranslateService,
    private fileNavigator: File,
    private identificacionService : IdentificacionService,
    private keyboard : Keyboard,
    private webview: WebView,
    // private transfer: FileTransfer,
    private events: EventsService,
    private loadingCtrl: LoadingController,
    private androidPermissions: AndroidPermissions,
    public consultas: ConsultasService
  ) {

    this.nativeAudio.preloadSimple('uniqueId1', 'assets/beep.mp3').then(()=>{
      console.log('Beep loaded ok')
    }, (err)=>{
      console.log(err)
    });


    this.platform.backButton.subscribe(() => {
      try {
        $('.select2-dropdown').remove();
      }
      catch(e) {
        
      }
    })

    this.initializeApp();

    this.events.subscribe('loadPostLogout',()=>{
      if (this.platform.is('cordova')) {
        this.configXML();
      }else{
        setTimeout(()=>{
          localStorage.removeItem('config');
          this.events.publish('setLoaded');
          // this.configXMLdesktop();
        },100)

      }
    })
  }

  initializeApp() {
    this.platform.ready().then(async () => {

      // this.consultas.createLogger({nombre:"jorge", apellido:"solano"});
       //Language
       this.translateService.setDefaultLang('es');
       this.translateService.use('es');

      // if(await this.estaLogeado()){
      //   this.router.navigateByUrl("/home");
      // }else{
      //   this.router.navigateByUrl("/");
      // }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#0D8B7A")
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
          result => {
            if (result.hasPermission) {
              // code
              this.configXML();
            } else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
                if (result.hasPermission) {
                  // code
                  // this.configXML();
                  this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE).then(result => {
                    if (result.hasPermission) {
                      // code
                      this.configXML();
                    }
                  });
                }
              });

            }
          },
          err => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE);
          }
        );

      }else{

        setTimeout(()=>{
          localStorage.removeItem('config');
          // this.events.publish('setLoaded');
          this.configXMLdesktop();
        },100)
      }
    
      // this.insertarResiduosDomicilio();

      
    });
  }

  async configXML()
  {
    this.estaLogeado().then(a=>{
      if (!a) {
      let path = this.fileNavigator.externalRootDirectory+'CONFIG/CONFIG.XML';
        // path = this.webview.convertFileSrc(path);
        
        this.fileNavigator.checkDir(this.fileNavigator.externalRootDirectory,'CONFIG').then(_ => {

          localStorage.setItem('zebra','1');

          console.log('directorio encontrado '+(this.webview.convertFileSrc(path)) + path.replace('file://','_app_file_'))

          this.loadingCtrl.create({message:"Comprobando PDA"}).then(l=>{
            l.present();

            this.consultas.getXML(path.replace('file://','_app_file_')).subscribe((data:any)=>{
              let parser = new DOMParser();
              let xmlDoc = parser.parseFromString(data,"text/xml");

              console.log(data);

              console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

              localStorage.setItem('centro_config',xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

              this.events.publish('getConfigInformation',({
                gestor:xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue,
                centro:xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue,
                pda:xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue,
                sidsig:xmlDoc.getElementsByTagName("SIG")[0].childNodes[0].nodeValue,
              }));
              /**/
            })
          })

        },err=>{
          setTimeout(()=>{
            localStorage.removeItem('zebra');
            console.log("Ha ocurrido un error al leer el archivo Config.XML");
            // alert('Directorio no encontrado')
            this.events.publish('setLoaded');
          },100)
        });
      }
    });
  }

  async configXMLdesktop()
  {
    localStorage.removeItem('zebra');
    this.estaLogeado().then(a=>{
      if (!a) {
        this.loadingCtrl.create({message:"Comprobando PDA"}).then(l=>{
          l.present();
          
          this.consultas.getXML('/assets/config.xml').subscribe((data:any)=>{
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data,"text/xml");

            console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

            localStorage.setItem('centro_config',xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

            this.events.publish('getConfigInformation',({
              gestor:xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue,
              centro:xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue,
              pda:xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue,
              sidsig:xmlDoc.getElementsByTagName("SIG")[0].childNodes[0].nodeValue,
            }));

            // this.consultas.getConfigInformation(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue)
            // .subscribe((data:any)=>{
            //   this.terminal = xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue;
            //   this.direccion = data.config._centro.direccion;
            //   this.nombre = data.config._gestor.nombre;
            // })
          })
        })
      }
    })
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
