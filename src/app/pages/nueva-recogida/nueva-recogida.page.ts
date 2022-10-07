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
  selector: 'app-nueva-recogida',
  templateUrl: './nueva-recogida.page.html',
  styleUrls: ['./nueva-recogida.page.scss'],
  providers: [Geolocation]
})
export class NuevaRecogidaPage implements OnInit {

  titulo = "NUEVA RECOGIDA 0 - Fecha Operación";
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

    localStorage.removeItem('alt_title_sm');
    localStorage.removeItem('alt_title_ed');
    localStorage.removeItem('alt_title_rd');

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

    this.nav.navigateForward('/nueva-recogida/step-one');
  }

  atras() {
    this._location.back();
  }

}
