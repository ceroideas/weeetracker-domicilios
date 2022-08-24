import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Usuario } from 'src/app/models/usuario';
import { ParamsService } from '../../../services/params.service';

import { Storage } from '@ionic/storage-angular';

const last2 = new Date().getFullYear().toString().slice(-2);

declare var moment:any;

@Component({
  selector: 'app-step-six',
  templateUrl: './step-six.page.html',
  styleUrls: ['./step-six.page.scss'],
})
export class StepSixPage implements OnInit {

  titulo = "NUEVA RECOGIDA 6 - Recogida Completada";
  myForm: FormGroup;

  usuario: Usuario = new Usuario();

  lecturas:any;
  gestor = JSON.parse(localStorage.getItem('gestor'));
  origen = JSON.parse(localStorage.getItem('origen'));
  contenedores:any;
  especificos:any;
  initial;

  agrupadas = [];
  keys = [];

  private _storage: Storage | null = null;

  constructor(private usuarioService: UsuarioService,
    private consultas: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private params: ParamsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage) {


    this.myForm = this.fb.group({
      certificado: ['...', Validators.required],
      albaran_origen: [null, Validators.required],
      codigo_externo: [null, Validators.required],
      fecha_operacion: [moment(localStorage.getItem('date')).format('DD-MM-Y'), Validators.required],
      gestor_recogida: [JSON.parse(localStorage.getItem('gestor')).nombreComercial, Validators.required],
      total: [null],
    });
    this.cargarUsuario();

    let p = this.params.getParam();

    this.contenedores = p.contenedores;
    this.especificos = p.especificos;
  }

  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);

    this.initial = 'R'+last2+String(this.usuario.terminal).padStart(4, '0');

    this.consultas.recuperarCertificado(this.initial).subscribe((data:any)=>{

      if (!data.certificado) {
        this.initial += '00001';
      }else{
        this.initial += this.padLeft(parseInt(data.certificado.pidCertificado.slice(-5))+1,5);
      }
      this.myForm.patchValue({
        certificado: this.initial
      });

      this.storage.create().then(async (storage)=>{

        this._storage = storage;
        let firma_1 = await this._storage.get('firma_origen');
        let firma_2 = await this._storage.get('firma_transportista');
        
        firma_1.nombre = 'Fr'+this.initial+'11';
        firma_1.id = this.initial;

        firma_2.nombre = 'Fr'+this.initial+'12';
        firma_2.id = this.initial;

        // this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
        this.lecturas = await this._storage.get('lecturas');

        this.agrupadas = this.consultas.groupBy(this.lecturas,'residuo_especifico');
        this.keys = Object.keys(this.agrupadas);

        this.myForm.patchValue({total:(Object.values(this.agrupadas) as any).flat().length});
      });

    });


    console.log(this.myForm.value);
  }

  async ngOnInit() {

  }

  padLeft(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  adelante()
  {
    
  }

  atras()
  {
    this._location.back();
  }

}
