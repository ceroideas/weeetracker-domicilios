import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from 'src/app/models/usuario';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ConsultasService } from '../../services/consultas.service';
import { EventsService } from '../../services/events.service';

// import { File } from '@awesome-cordova-plugins/file/ngx';

declare var $: any;

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  // providers: [File]
})
export class LoginPage implements OnInit {

  usuario: string;
  usuarios: any;
  usuario_centro: any;
  password: string;
  usuarioObj: Usuario = new Usuario();
  message : string = "";
  helper = new JwtHelperService();
  mostrarFooter : boolean = true;
  loading;

  loaded;

  constructor(private usuarioService: UsuarioService,
    private translate: TranslateService,
    private navCtrl: NavController,
    private consultas: ConsultasService,
    private loadingCtrl: LoadingController,
    // public file: File,
    private camera: Camera,
    // private fTP: FTP,
    private events: EventsService,
    private inAppBrowser : InAppBrowser
  ) {
    if(environment.message){
      this.message = environment.message;
    }
 
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e){
      document.body.classList.add('keyboard-is-open');
    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){
      document.body.classList.remove('keyboard-is-open');
    }

    this.nombreUsuario();

    // this.consultas.upload({Nombre:"Prueba", Tipo: 1, ArchivoCodificado: "iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAJUlEQVR42u3NQQEAAAQEsJNcdFLw2gqsMukcK4lEIpFIJBLJS7KG6yVo40DbTgAAAABJRU5ErkJggg=="})
    // .subscribe(data=>{
    //   console.log(data);
    // })
  }

  terminal;
  direccion;
  nombre;
  exist = "";

  photo()
  {
    this.navCtrl.navigateForward('/nueva-recogida/qr');
    /*const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     console.log("imageData",imageData);
     // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });*/
  }

  ngOnInit() {

    // setTimeout(()=>{

    //   this.ftp();

    // },3000)

    /*this.consultas.getIdentificacion("18410708002022559").subscribe(data=>{
      console.log(data)
    });*/

    this.events.destroy('setLoaded');
    this.events.subscribe('setLoaded',()=>{
      this.loaded = true;
    });

    this.events.destroy('getConfigInformation');
    this.events.subscribe('getConfigInformation',(config:any)=>{

      console.log(config);

      localStorage.setItem('config',JSON.stringify(config));

      this.consultas.getConfigInformation(config.gestor, config.centro)
        .subscribe((data:any)=>{
          console.log(data);
          this.terminal = config.pda;
          this.direccion = data.config._centro.direccion;
          this.nombre = data.config._gestor.nombre;
          this.loaded = true;

          this.consultas.listarUsuarios(config.centro).subscribe((data:any)=>{

            this.loadingCtrl.dismiss();
            
            console.log(data);
            this.consultas.createLogger('ListarUsuarios Success');

            this.usuarios = data.users;

          })
        },err=>{
          console.log(JSON.stringify(err));
          this.consultas.createLogger('E | ListarUsuarios error '+JSON.stringify(err));
        })

    });

    // this.file.checkDir(this.file.externalRootDirectory,'CONFIG').then(_=>{
    //   this.exist+=" | existe config / ";
    // });

    // this.file.checkDir('/storage/emulated/','0').then(_=>{
    //   this.exist+=" | existe emulated / ";
    // });

    /*this.loading = this.loadingCtrl.create({message:"Obteniendo información del dispositivo..."}).then(a=>{
      
      // a.present();

      let path:any;

      this.file.checkDir('/storage/emulated/0/Android/data/com.ecolec.weeetracker/files/','config').then(_ => {
        
        console.log('Directory exists 1');

        path = this.file.dataDirectory+'/config/CONFIG.xml';

        console.log(path);

        this.consultas.getXML(path).subscribe((data:any)=>{
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(data,"text/xml");

          console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

          this.consultas.getConfigInformation(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue)
          .subscribe((data:any)=>{
            this.terminal = xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue;
            this.direccion = data.config._centro.direccion;
            this.nombre = data.config._gestor.nombre;
          })
        })

      })
      .catch(err =>{console.log('no existe el directorio')});


    })*/


    // console.log(xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue);
    
  }

  ionViewWillEnter() {
    this.nombreUsuario();
  }

  async nombreUsuario() {
    this.usuario = await this.usuarioService.cargarNombreUsuario();
  }

  async login() {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CARGANDO"));
    this.usuarioService.login(this.usuario, this.password).subscribe(async (res: any) => {

      /* Obtenemos el usuario */
      let decodeToken: any = this.helper.decodeToken(res.token);
      console.log(decodeToken);

      this.consultas.createLogger('Login Success');

      if (!localStorage.getItem('centro_config')) {
        localStorage.setItem('centro',decodeToken.DTercero);
      }

      await this.usuarioService.guardarUsuario(decodeToken);
      await this.usuarioService.guardarToken(res.token)
      this.usuario = "";
      this.password = "";
      this.navCtrl.navigateForward("/home");
      this.usuarioService.cerrarSpinner();
      // loading.dismiss(); 
    }, async error => {
      this.usuarioService.cerrarSpinner();
      // loading.dismiss(); 
      this.usuarioService.mostrarAlerta(this.translate.instant("LOGIN.ERROR"));
      this.consultas.createLogger('E | Login ERROR');
    });
  }

  async acceso()
  {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CARGANDO"));
    this.usuarioService.loginWithId(this.usuario_centro, this.password, parseInt(localStorage.getItem('centro_config'))).subscribe(async (res: any) => {

      /* Obtenemos el usuario */
      let decodeToken: any = this.helper.decodeToken(res.token);
      console.log(decodeToken);

      this.consultas.createLogger('Acceso Terminal Success');

      await this.usuarioService.guardarUsuario(decodeToken);
      await this.usuarioService.guardarToken(res.token)
      this.usuario = "";
      this.password = "";
      this.navCtrl.navigateForward("/home");
      this.usuarioService.cerrarSpinner();
      // loading.dismiss(); 
    }, async error => {
      this.usuarioService.cerrarSpinner();
      // loading.dismiss(); 
      this.usuarioService.mostrarAlerta('Usuario no válido');
      this.consultas.createLogger('E | Acceso Terminal ERROR | Usuario no válido');
    });
  }

  changeEvent(e)
  {
    this.usuario_centro = e.detail.value;
  }

  
  abrir(){
    this.inAppBrowser.create('https://test.weee-tracker.com/document/manual.pdf','_blank');
  }

}
