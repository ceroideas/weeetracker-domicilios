import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Usuario } from 'src/app/models/usuario';

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

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,) {

    this.myForm = this.fb.group({
      origen: ['', Validators.required],
      gestor_recogida: ['', Validators.required],
      nombre: ['', Validators.required],
      firma: ['', Validators.required],
    });
    this.cargarUsuario();
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);
  }

  ngOnInit() {
    const canvas = document.querySelector("#sign-four");

    const signaturePad = new SignaturePad(canvas);

    console.log(signaturePad);
  }

  adelante()
  {
    this.nav.navigateForward('/nueva-recogida/step-five');
  }

  atras() {
    this._location.back();
  }

}
