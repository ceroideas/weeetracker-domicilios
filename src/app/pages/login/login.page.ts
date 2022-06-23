import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from 'src/app/models/usuario';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ConsultasService } from '../../services/consultas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: string;
  password: string;
  usuarioObj: Usuario = new Usuario();
  message : string = "";
  helper = new JwtHelperService();
  mostrarFooter : boolean = true;

  constructor(private usuarioService: UsuarioService,
    private translate: TranslateService,
    private navCtrl: NavController,
    private consultas: ConsultasService,
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
  }

  terminal;
  direccion;
  nombre;

  ngOnInit() {

    this.consultas.getXML().subscribe((data:any)=>{
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
    });
  }

  
  abrir(){
    this.inAppBrowser.create('https://test.weee-tracker.com/document/manual.pdf','_blank');
  }

}
