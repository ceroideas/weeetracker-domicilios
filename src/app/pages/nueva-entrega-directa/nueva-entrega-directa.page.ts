import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

declare var moment:any;

@Component({
  selector: 'app-nueva-entrega-directa',
  templateUrl: './nueva-entrega-directa.page.html',
  styleUrls: ['./nueva-entrega-directa.page.scss'],
  providers: [Geolocation]
})
export class NuevaEntregaDirectaPage implements OnInit {

  titulo = "NUEVA ENTREGA DIRECTA 0 - Fecha Operación";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  blockedDays:any;

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private lectorService: LectorService,
    private translate: TranslateService,
    private geolocation: Geolocation,
    private alertCtrl: AlertController) {

    this.geolocation.getCurrentPosition().then((resp) => {
      localStorage.setItem('lat',resp.coords.latitude.toString());
      localStorage.setItem('lng',resp.coords.longitude.toString());
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.blockedDays = (dateString: string) => {
      const date = new Date(dateString);
      const days = moment().subtract(3,'months');
      const tomo = moment();

      /**
       * Date will be enabled if it is not
       * Sunday or Saturday
       */
      return date > days && date < tomo;
    };

    this.myForm = this.fb.group({
      date: [this.today, Validators.required],
    });
  }

  ngOnInit() {
  }

  adelante()
  {
    localStorage.setItem('date',this.myForm.value.date);

    this.nav.navigateForward('/nueva-entrega-directa/step-one-end');
  }

  atras() {
    this._location.back();
  }

}
