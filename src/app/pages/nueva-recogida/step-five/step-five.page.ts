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

declare var SignaturePad:any;

@Component({
  selector: 'app-step-five',
  templateUrl: './step-five.page.html',
  styleUrls: ['./step-five.page.scss'],
})
export class StepFivePage implements OnInit {

  titulo = "NUEVA RECOGIDA 5 - Firma Transportista";
  myForm: FormGroup;

  usuario: Usuario = new Usuario();

  lecturas:any;
  gestor = JSON.parse(localStorage.getItem('gestor'));
  origen = JSON.parse(localStorage.getItem('origen'));
  contenedores:any;
  especificos:any;
  canvas;
  signaturePad;

  constructor(private usuarioService: UsuarioService,
    private consultas: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private params: ParamsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,) {

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

    this.lecturas = JSON.parse(localStorage.getItem('lecturas'));

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

  ngOnInit() {
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
    localStorage.setItem('firma_transportista',JSON.stringify(this.myForm.value));
    this.nav.navigateForward('/nueva-recogida/step-six');
  }

  atras() {
    this._location.back();
  }

}
