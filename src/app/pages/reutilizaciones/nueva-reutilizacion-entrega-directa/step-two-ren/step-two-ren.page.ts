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
  selector: 'app-step-two-ren',
  templateUrl: './step-two-ren.page.html',
  styleUrls: ['./step-two-ren.page.scss'],
})
export class StepTwoRenPage implements OnInit {

  titulo = "NUEVA REUTILIZACIÓN ENTREGA DIRECTA 2 - Origen del Residuo";
  myForm: FormGroup;

  usuario: Usuario = new Usuario();

  date = localStorage.getItem('date');

  solicitud = JSON.parse(localStorage.getItem('solicitud'))['response'];

  private _storage: Storage | null = null;

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

    console.log(this.solicitud);

    this.myForm = this.fb.group({

    });
    this.cargarUsuario();
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    // console.log(this.usuario);
  }

  ngOnInit() {
    this.consultaService.createLogger('NUEVA REUTILIZACIÓN ENTREGA DIRECTA');

    this.storage.create().then(async (storage)=>{

      this._storage = storage;

    });
  }

  adelante()
  {
      this.consultaService.createLogger('Nueva reutilización entrega directa seleccionada Success');
      this.nav.navigateForward('/reutilizaciones/nueva-reutilizacion-entrega-directa/step-three-ren');
  }

  atras() {
    this._location.back();
  }

}
