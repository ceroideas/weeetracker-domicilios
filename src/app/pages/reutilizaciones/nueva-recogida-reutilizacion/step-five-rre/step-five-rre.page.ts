import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Usuario } from 'src/app/models/usuario';
import { ParamsService } from '../../../../services/params.service';
import { EventsService } from '../../../../services/events.service';

import { Storage } from '@ionic/storage-angular';

declare var SignaturePad:any;

@Component({
  selector: 'app-step-five-rre',
  templateUrl: './step-five-rre.page.html',
  styleUrls: ['./step-five-rre.page.scss'],
})
export class StepFiveRrePage implements OnInit {

  titulo = "NUEVA RECOGIDA DE REUTILIZACIÓN 5 - Firma Transportista";
  myForm: FormGroup;

  usuario: Usuario = new Usuario();

  lecturas:any;
  origen = JSON.parse(localStorage.getItem('origen'));
  contenedores:any;
  especificos:any;
  canvas;
  signaturePad;

  agrupadas = [];
  keys = [];

  private _storage: Storage | null = null;

  constructor(private usuarioService: UsuarioService,
    public consultas: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private params: ParamsService,
    private events: EventsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage) {

    this.myForm = this.fb.group({
      gestor_origen: [this.origen.nombre, Validators.required],
      centro_origen: [this.origen.centro, Validators.required],
      gestor_recogida: ['', Validators.required],
      centro_recogida: ['', Validators.required],
      nombre: ['', Validators.required],
      firma: ['', Validators.required],
    });
    this.cargarUsuario();

    let p = this.params.getParam();

    this.contenedores = p.contenedores;
    this.especificos = p.especificos;

    /*this.consultas.contenedores().subscribe((data:any)=>{
      this.contenedores = data;

      this.consultas.todosEspecificos().subscribe((data:any)=>{
        this.especificos = data;

        
      })
    })*/

    this.events.subscribe('reloadStepFive',async ()=>{
      this.lecturas = await this._storage.get('lecturas');

      this.agrupadas = this.consultas.groupBy(this.lecturas,'residuo_especifico');
      this.keys = Object.keys(this.agrupadas);
    });
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    this.myForm.patchValue({gestor_recogida: this.usuario.tercero.Nombre});
    this.myForm.patchValue({centro_recogida: this.usuario.centro});
    console.log(this.usuario);
  }

  async ngOnInit() {
    
    this.consultas.createLogger('Firma de Transportista Success');

    this.canvas = document.querySelector("#sign-five");

    this.signaturePad = new SignaturePad(this.canvas);

    this.signaturePad.addEventListener('endStroke', ()=>{
      let data = this.signaturePad.toDataURL();
      console.log(data);
      this.myForm.patchValue({
        firma: data
      });
    });
    console.log(this.signaturePad);

    const storage = await this.storage.create();
    this._storage = storage;

    // this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
    this.lecturas = await this._storage.get('lecturas');

    this.agrupadas = this.consultas.groupBy(this.lecturas,'residuo_especifico');
    this.keys = Object.keys(this.agrupadas);


    /**/
    

    let firma = await this._storage?.get('firma_transportista');

    if (firma) {
      this.myForm.patchValue({
        gestor_origen: firma.gestor_origen,
        gestor_recogida: firma.gestor_recogida,
        nombre: firma.nombre,
        firma: firma.firma,
      });

      this.signaturePad.fromDataURL(firma.firma, {ratio: 1});
    }
  }

  clearCanvas()
  {
    this.myForm.patchValue({
      firma: null
    });
    this.signaturePad.clear();
  }

  adelante()
  {
    if (!this.myForm.valid) {
      return this.alertCtrl.create({message:"Por favor, rellene todos los datos.", buttons: ["Ok"]}).then(a=>a.present());
    }

    // localStorage.setItem('firma_transportista',JSON.stringify(this.myForm.value));

    this._storage?.set('firma_transportista', this.myForm.value);

    this.nav.navigateForward('/reutilizaciones/nueva-recogida-reutilizacion/step-six-rre');
  }

  atras() {
    this.alertCtrl.create({message:"¿Está seguro de volver atrás? La información de la vista actual se perderá", buttons: [
    {
      text:"Si, regresar",
      handler:()=>{
        this._location.back();
      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present())
  }

}
