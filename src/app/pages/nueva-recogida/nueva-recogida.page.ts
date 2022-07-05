import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';

declare var moment:any;

@Component({
  selector: 'app-nueva-recogida',
  templateUrl: './nueva-recogida.page.html',
  styleUrls: ['./nueva-recogida.page.scss'],
})
export class NuevaRecogidaPage implements OnInit {

  titulo = "NUEVA RECOGIDA 0 - Fecha Operación";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private lectorService: LectorService,
    private translate: TranslateService,
    private alertCtrl: AlertController) {

    this.myForm = this.fb.group({
      date: [this.today, Validators.required],
    });
  }

  ngOnInit() {
  }

  adelante()
  {
    localStorage.setItem('date',this.myForm.value.date);

    this.nav.navigateForward('/nueva-recogida/step-one');
  }

  atras() {
    this._location.back();
  }

}
