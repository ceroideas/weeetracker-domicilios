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

const last2 = new Date().getFullYear().toString().slice(-2);

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

  constructor(private usuarioService: UsuarioService,
    private consultas: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private params: ParamsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {


    this.myForm = this.fb.group({
      certificado: ['...', Validators.required],
      albaran_origen: [null, Validators.required],
      codigo_externo: [null, Validators.required],
      fecha_operacion: [localStorage.getItem('date'), Validators.required],
      gestor_recogida: [JSON.parse(localStorage.getItem('gestor')).nombreComercial, Validators.required],
    });
    this.cargarUsuario();

    let p = this.params.getParam();

    this.contenedores = p.contenedores;
    this.especificos = p.especificos;

    this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
  }

  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);

    this.initial = 'R'+last2+this.usuario.terminal;

    this.consultas.recuperarCertificado(this.initial).subscribe((data:any)=>{

      if (!data.certificado) {
        this.initial += '00001';
      }else{
        this.initial += this.padLeft(parseInt(data.certificado.pidCertificado.slice(-5))+1,5);
      }
      this.myForm.patchValue({
        certificado: this.initial
      });

    });


    console.log(this.myForm.value);
  }

  ngOnInit() {
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
