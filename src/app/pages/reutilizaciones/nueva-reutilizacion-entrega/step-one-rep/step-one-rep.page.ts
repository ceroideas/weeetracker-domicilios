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
  selector: 'app-step-one-rep',
  templateUrl: './step-one-rep.page.html',
  styleUrls: ['./step-one-rep.page.scss'],
})
export class StepOneRepPage implements OnInit {

  titulo = "NUEVA REUTILIZACIÓN ENTREGA 1 - Fracción";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  usuario: Usuario = new Usuario();

  date = localStorage.getItem('date');

  private _storage: Storage | null = null;

  fracciones = [];
  seleccionado = null;

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

    // this.consultaService.getRexResponsabilities(this.usuario.tercero.PidTercero,this.usuario.dtercero).subscribe(data=>{

    // });
    let fracciones = [];
    let resps = this.usuario.responsabilidades.filter(x=>x.TipoOperacion == 'REP');
    console.log(resps);
    let i:any;
    for (i of resps)
    {
      fracciones.push(i.SidFraccion);
    }
    this.consultaService.getFracciones({fracciones:fracciones.filter(this.onlyUnique)}).subscribe((data:any)=>{
      console.log(data);
      this.fracciones = data.fr;
    })
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  ngOnInit() {
    this.consultaService.createLogger('NUEVA REUTILIZACIÓN ENTREGA');

    this.storage.create().then(async (storage)=>{

      this._storage = storage;

      await this._storage.remove('firma_origen');
      await this._storage.remove('firma_transportista');
      await this._storage.remove('firma_destino');

      localStorage.removeItem('albaran_origen');
      localStorage.removeItem('codigo_externo');
      localStorage.removeItem('solicitud');
      
      localStorage.removeItem('alt_title_rd');
      localStorage.removeItem('alt_title_sm');
      localStorage.removeItem('alt_title_rd_2');
      localStorage.removeItem('alt_title_rd_3');
      localStorage.removeItem('alt_title_rd_4');
      localStorage.removeItem('alt_title_rd_5');
      localStorage.removeItem('alt_title_rd_6');
      localStorage.removeItem('alt_title_rd_7');

    });
  }

  adelante()
  {
    localStorage.setItem('fraccion_seleccionada',JSON.stringify(this.fracciones[this.seleccionado]));

    localStorage.setItem('tipo_operativa','REP');
    
    this.consultaService.createLogger('Nueva Reutilización Entrega seleccionada Success');
    // localStorage.removeItem('solicitud');
    this.nav.navigateForward('/reutilizaciones/nueva-reutilizacion-entrega/step-two-rep');
  }

  atras() {
    this._location.back();
  }

}
