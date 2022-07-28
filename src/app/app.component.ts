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


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [File,WebView,/*FileTransfer,*/AndroidPermissions]
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
    this.initializeApp();

    this.events.subscribe('loadPostLogout',()=>{
      if (this.platform.is('cordova')) {
        this.configXML();
      }else{
        setTimeout(()=>{
          this.events.publish('setLoaded');
          // this.configXMLdesktop();
        },100)

      }
    })
  }

  initializeApp() {
    this.platform.ready().then(async () => {
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
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
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
                  this.configXML();
                }
              });
            }
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        );

      }else{

        setTimeout(()=>{
          this.events.publish('setLoaded');
          // this.configXMLdesktop();
        },100)
      }
    
      // this.insertarResiduosDomicilio();
      
    });
  }

  async configXML()
  {
    this.estaLogeado().then(a=>{
      if (!a) {
      let path = this.fileNavigator.externalRootDirectory+'Android/data/com.ecolec.weeetracker/files/config/config.xml';
        // path = this.webview.convertFileSrc(path);
        
        this.fileNavigator.checkDir(this.fileNavigator.externalRootDirectory+'Android/data/com.ecolec.weeetracker/files/','config').then(_ => {
        // this.fileNavigator.checkDir('file:///','config').then(_ => {
          // console.log(path,this.webview.convertFileSrc(path));
          console.log('directorio encontrado',this.webview.convertFileSrc(path),path.replace('file://','_app_file_'))

          // const fileTransfer: FileTransferObject = this.transfer.create();

          // let options: FileUploadOptions = {
          //   fileKey: 'file',
          //   fileName: 'xml.jpg',
          //   chunkedMode: false,
          //   mimeType: "text/xml",
          //   httpMethod: 'POST',
          //   headers: {}
          // }

          // fileTransfer.upload(path.replace('file://',''), 'https://betatestpro.com/benbros/public/api/uploadXML', options)
          //    .then((data) => {
          //      console.log(data);
          //    }, (err) => {
          //      // error
          //      console.log(err);
          //    })

          this.loadingCtrl.create({message:"Comprobando PDA"}).then(l=>{
            l.present();

            this.consultas.getXML(path.replace('file://','_app_file_')).subscribe((data:any)=>{
              let parser = new DOMParser();
              let xmlDoc = parser.parseFromString(data,"text/xml");

              console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

              this.events.publish('getConfigInformation',({
                gestor:xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue,
                centro:xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue,
                pda:xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue
              }));

              // this.consultas.getConfigInformation(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue)
              // .subscribe((data:any)=>{
              //   this.terminal = xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue;
              //   this.direccion = data.config._centro.direccion;
              //   this.nombre = data.config._gestor.nombre;
              // })
            })
          })

        },err=>{
          setTimeout(()=>{
            this.events.publish('setLoaded');
          },100)
        });
      }
    });
  }

  async configXMLdesktop()
  {
    this.estaLogeado().then(a=>{
      if (!a) {
        this.loadingCtrl.create({message:"Comprobando PDA"}).then(l=>{
          l.present();
          
          this.consultas.getXML('/assets/config.xml').subscribe((data:any)=>{
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data,"text/xml");

            console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

            this.events.publish('getConfigInformation',({
              gestor:xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue,
              centro:xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue,
              pda:xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue
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
