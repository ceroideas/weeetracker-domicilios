import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';

declare var moment:any;

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.page.html',
  styleUrls: ['./step-one.page.scss'],
})
export class StepOnePage implements OnInit {

  titulo = "NUEVA RECOGIDA 1 - Solicitud";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  date = localStorage.getItem('date');

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
      type: ['request', Validators.required],
      request_n: [''],
    });
  }

  ngOnInit() {
  }

  adelante()
  {
    if (this.myForm.value.type == 'request') {
      if (!this.myForm.value.request_n) {
        this.alertCtrl.create({message:"Debe escribir el número de la Solicitud", buttons:["Ok"]}).then(a=>a.present());
      }else{

        this.loadingCtrl.create().then(l=>{
          l.present();

          let solicitud = {
            pidSolicitud: this.myForm.value.request_n,
            fecha: localStorage.getItem('date')+' 00:00:00.0000'
          };
          this.consultaService.validacionSolicitud(solicitud).subscribe((res:any) => {

            l.dismiss();

            if (!res.solicitud) {
              return this.alertCtrl.create({message:"No se encuentra la Solicitud", buttons:["Ok"]}).then(a=>a.present());
            }
            localStorage.setItem('solicitud',JSON.stringify(res.solicitud));
            this.nav.navigateForward('/nueva-recogida/step-two');
          },err=>{
            console.log(err);
            l.dismiss();
          });
        });

      }
    }else{
      localStorage.removeItem('solicitud');
      this.nav.navigateForward('/nueva-recogida/step-two');
    }
  }

  atras() {
    this._location.back();
  }

}
