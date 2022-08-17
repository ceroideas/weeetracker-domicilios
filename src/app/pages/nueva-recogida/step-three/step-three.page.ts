import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { EventsService } from '../../../services/events.service';
import { Usuario } from 'src/app/models/usuario';

declare var moment:any;

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.page.html',
  styleUrls: ['./step-three.page.scss'],
})
export class StepThreePage implements OnInit {

  titulo = "NUEVA RECOGIDA 3 - Tipo Lectura";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  usuario: Usuario = new Usuario();

  date = localStorage.getItem('date');

  lecturas = [];

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private events: EventsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,) {

    this.myForm = this.fb.group({
      type: ['individual', Validators.required],
      // request_n: [''],
    });
    this.cargarUsuario();
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);
  }

  ngOnInit() {

    this.lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];

    this.events.destroy('getLecturas');
    this.events.subscribe('getLecturas',data=>{
      this.lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];
    });

    this.events.destroy('lectura');
    this.events.subscribe('lectura',data=>{

      localStorage.setItem('etiqueta',data);


      this.loadingCtrl.create({message:"Comprobando etiqueta..."}).then(l=>{
        l.present();
        
        this.consultaService.GetRaee(data).subscribe((data:any)=>{

          console.log(data);

          l.dismiss();

          if (data) {
            return this.alertCtrl.create({message:"El Residuo ya ha sido recogido",buttons: ['Ok']}).then(a=>a.present());
          }

          this.loadingCtrl.create().then(l=>{

            this.consultaService.getIdentificacion(data).subscribe((data:any)=>{
              l.dismiss();

              if (data.length) {
                localStorage.setItem('etiqueta_objeto',JSON.stringify(data[0]));
                // this.alertCtrl.create({message:"La etiqueta ya existe"}).then(a=>a.present());
              }

              this.nav.navigateForward('/nueva-recogida/step-three/readed');
            },err=>{
              l.dismiss();

              this.nav.navigateForward('/nueva-recogida/step-three/readed');
            });

          });
        },err=>{
          l.dismiss();
        });

      })

    });
  }

  adelante()
  {
    this.nav.navigateForward('/nueva-recogida/qr');
  }

  atras() {
    this.nav.navigateRoot('/home');
    // this._location.back();
  }

}
