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

declare var SignaturePad:any;

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.page.html',
  styleUrls: ['./step-four.page.scss'],
})
export class StepFourPage implements OnInit {

  titulo = "NUEVA RECOGIDA 4 - Firma Origen";
  myForm: FormGroup;

  usuario: Usuario = new Usuario();

  lecturas:any;
  gestor = JSON.parse(localStorage.getItem('gestor'));
  origen = JSON.parse(localStorage.getItem('origen'));
  contenedores:any;
  especificos:any;
  canvas;
  signaturePad;

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
      origen: [this.origen.direccion, Validators.required],
      gestor_recogida: [this.gestor.nombre, Validators.required],
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
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);
  }

  async ngOnInit() {
    this.canvas = document.querySelector("#sign-four");

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
    
    // localStorage.setItem('firma_origen',JSON.stringify(this.myForm.value));
    
    this._storage?.set('firma_origen', this.myForm.value);

    this.nav.navigateForward('/nueva-recogida/step-five');
  }

  atras() {
    // this.nav.navigateRoot('/nueva-recogida/step-three');
    this._location.back();
    // this._location.back();
  }

}