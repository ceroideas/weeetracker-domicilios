import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Usuario } from '../models/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  usuario: Usuario = new Usuario();
  helper = new JwtHelperService();
  loading: HTMLIonLoadingElement;

  constructor(private http: HttpClient,
    private storage: Storage,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController) {
      this.storage.create();
    }

  login(usuario: string, password: string) {
    return this.http.post(apiUrl + '/users/login', { Login: usuario, Password: password }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
  loginWithId(id: number, dt: number) {
    return this.http.get(apiUrl + '/users/loginWithId/'+id+'/'+dt);
  }

  async guardarUsuario(token) {
    this.usuario.id = token.Id;
    this.usuario.estado = token.Estado;
    this.usuario.login = token.Login;
    // this.usuario.tipoTercero = token.TipoTercero;
    this.usuario.dtercero = JSON.parse(token.DTercero);
    this.usuario.terminal = JSON.parse(token.Terminal);
    this.usuario.sidsig = JSON.parse(token.SidSIG);
    this.usuario.tercero = JSON.parse(token.Tercero);
    this.usuario.responsabilidades = JSON.parse(token.Resps);
    this.usuario.centros = JSON.parse(token.Centros);
    this.usuario.marcas = JSON.parse(token.Marcas);
    // this.usuario.perfiles = JSON.parse(token.Perfiles);
    this.usuario.residuos = JSON.parse(token.Residuos);
    // this.usuario.direcciones = JSON.parse(token.Direcciones).DireccionesTerceros;
    this.storage.set('usuario', this.usuario);
    this.storage.set('login', this.usuario.login);
  }

  async guardarToken(token) {
    this.storage.set('token', token);
  }

  async cargarToken() {
    let usuario: Usuario = await (this.storage.get('usuario'));
    return usuario;
  }

  async cargarNombreUsuario() {
    let nombre: string = await this.storage.get('login');
    return nombre;
  }

  async eliminarToken() {
    this.storage.remove('usuario');
    this.storage.remove('token');
  }

  async tokenValido() {
    let helper = new JwtHelperService();
    let token = await this.storage.get('token');
    if (helper.isTokenExpired(token)) {
      this.eliminarToken();
      return false;
    } else {
      return true;
    }
  }


  async mostrarAlerta(cuerpo) {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant("ALERTA.CABECERA"),
      message: cuerpo,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarSpinner(cuerpo) {
    this.loading = await this.loadingCtrl.create({
      message: cuerpo
    });

    await this.loading.present();
  }

  cerrarSpinner(){
    this.loading.dismiss();
  }


}
