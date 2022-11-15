import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Usuario } from 'src/app/models/usuario';

import { Storage } from '@ionic/storage-angular';

declare var moment:any;

@Component({
  selector: 'app-step-one-rcp',
  templateUrl: './step-one-rcp.page.html',
  styleUrls: ['./step-one-rcp.page.scss'],
})
export class StepOneRcpPage implements OnInit {

  titulo = "";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  usuario: Usuario = new Usuario();

  date = localStorage.getItem('date');

  private _storage: Storage | null = null;

  forceButtons = false;

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage) {

    this.myForm = this.fb.group({
      type: ['request', Validators.required],
      request_n: [''],
    });
    this.cargarUsuario();
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();

    if (this.usuario.responsabilidades.find(x=>x.TipoOperacion == 'CSR')) {
      this.titulo = "NUEVA RECEPCIÓN 1 - Solicitud";
    }else{
      this.titulo = "NUEVA RECEPCIÓN - 1";
      this.myForm.patchValue({type: 'notpermission'});
    }
    console.log(this.usuario);
  }

  ngOnInit() {
    this.consultaService.createLogger('NUEVA RECOGIDA');

    this.storage.create().then(async (storage)=>{

      this._storage = storage;

      await this._storage.remove('firma_origen');
      await this._storage.remove('firma_transportista');

      localStorage.removeItem('albaran_origen');
      localStorage.removeItem('codigo_externo');

      localStorage.removeItem('alt_title_rd');
      localStorage.removeItem('alt_title_sm');
      localStorage.removeItem('alt_title_rd_2');
      localStorage.removeItem('alt_title_rd_3');

    });
  }

  adelante()
  {
    if (this.myForm.value.type == 'request') {
      localStorage.setItem('tipo_operativa','RED');
      if (!this.myForm.value.request_n) {
        this.alertCtrl.create({message:"Debe escribir el número de la Solicitud", buttons:["Ok"]}).then(a=>a.present());
        this.consultaService.createLogger('E | No se ha escrito numero de solicitud');
      }else{

        this.loadingCtrl.create().then(l=>{
          l.present();

          let solicitud = {
            pidSolicitud: this.myForm.value.request_n,
            fecha: localStorage.getItem('date')+' 00:00:00.0000',
            tercero: this.usuario.tercero.PidTercero,
            dtercero: localStorage.getItem('centro_config') ? localStorage.getItem('centro_config') : localStorage.getItem('centro')
          };
          this.consultaService.validacionSolicitud(solicitud).subscribe((res:any) => {

            l.dismiss();

            if (!res.solicitud) {
              this.consultaService.createLogger('E | No se encuentra la Solicitud');
              return this.alertCtrl.create({message:"No se encuentra la Solicitud", buttons:["Ok"]}).then(a=>a.present());
            }

            localStorage.setItem('buscarDirecciones','1');
            localStorage.setItem('solicitud',JSON.stringify(res.solicitud));
            
            this.consultaService.createLogger('Solicitud Encontrada Success');

            this.nav.navigateForward('/nueva-recepcion/step-two-rcp');
          },err=>{
            console.log(err);
            l.dismiss();
          });
        });

      }
    }else if(this.myForm.value.type == 'norequest'){
      this.consultaService.createLogger('Nueva Recogida sin solicitud seleccionada Success');
      // localStorage.setItem('tipo_operativa','REF');
      localStorage.removeItem('solicitud');
      // this.nav.navigateForward('/nueva-recepcion/step-two-rcp');
      this.forceButtons = true;
    }
  }

  nuevaRecepcion(t)
  {
    localStorage.setItem('tipo_operativa',t);
    this.nav.navigateForward('/nueva-recepcion/step-two-rcp');
  }

  atras() {
    if (!this.usuario.responsabilidades.find(x=>x.TipoOperacion == 'CSR')) {
      this._location.back();
    }else{
      if (this.forceButtons) {
        return this.forceButtons = false;
      }
      this._location.back();
    }
  }

  promptBack()
  {
    this.alertCtrl.create({message:"¿Desea volver al menú inicial?", buttons: [{
      text:"Si",
      handler:()=>{
        this.nav.navigateRoot('/home');
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
  }

}
