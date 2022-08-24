import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { EventsService } from '../../../services/events.service';
import { ParamsService } from '../../../services/params.service';
import { Usuario } from 'src/app/models/usuario';

import { Storage } from '@ionic/storage-angular';

declare var moment:any;

const wait = (ms) => new Promise(res => setTimeout(res, ms));

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

  goEdit = false;

  private _storage: Storage | null = null;

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private params: ParamsService,
    private events: EventsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private storage: Storage,
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

  async ngOnInit() {

    const storage = await this.storage.create();
    this._storage = storage;

    // this.lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];
    this.lecturas = await this._storage.get('lecturas');

    if (!this.lecturas) {
      this.lecturas = [];
    }

    console.log(this.lecturas)  

    this.events.destroy('newRead');
    this.events.subscribe('newRead',data=>{
      console.log('new Read')
      this.myForm.patchValue({type:'individual'});
      setTimeout(()=>{
        this.adelante();
      },100);
    });

    this.events.destroy('getLecturas');
    this.events.subscribe('getLecturas',async data=>{
      // this.lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];
      this.lecturas = await this._storage.get('lecturas');
      if (!this.lecturas) {
        this.lecturas = [];
      }
    });

    this.events.destroy('lectura');
    this.events.subscribe('lectura',data=>{

      localStorage.setItem('etiqueta',data);


      this.loadingCtrl.create({message:"Comprobando etiqueta..."}).then(l=>{
        l.present();
        
        this.consultaService.GetRaee(data).subscribe((data:any)=>{

          l.dismiss();

          if (data) {
            return this.alertCtrl.create({message:"El Residuo ya ha sido recogido",buttons: ['Ok']}).then(a=>a.present());
          }

          if (!data) {
            this.nav.navigateForward('/nueva-recogida/step-three/readed');
          }

          this.loadingCtrl.create().then(l=>{

            this.consultaService.getIdentificacion(data[0].sidRaee).subscribe((data:any)=>{
              l.dismiss();

              console.log(data);

              if (data.length) {

                  let raee = data[0];

                  var lectura = {
                    etiqueta: raee.pidRaee,
                    fraccion: raee.sidFraccion,
                    residuo: raee.sidResiduo,
                    residuo_especifico: raee.sidResiduoEspecifico,
                    marca: raee.sidMarca,
                    tipo_contenedor: raee.sidTipoContenedor,
                    canibalizado: raee.canibalizado,
                    estado_raee: raee.sidEstadoRaee,
                    ref: null
                  };
                  /*this.lecturas.push({values: lectura, photos: null});
                  localStorage.setItem('lecturas',JSON.stringify(this.lecturas));*/

                // localStorage.setItem('etiqueta_objeto',JSON.stringify(data[0]));
                // this.alertCtrl.create({message:"La etiqueta ya existe"}).then(a=>a.present());
                this.params.setParam({values:lectura, photos:null});
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

    this.events.destroy('lecturaGrupal');
    this.events.subscribe('lecturaGrupal',data=>{

      localStorage.setItem('etiquetas',data);

      this.loadingCtrl.create({message:"Comprobando etiquetas..."}).then(async load=>{
        load.present();

        for(let i of data)
        {
          await this.comprobarRaee(i);
        }

        localStorage.setItem('lecturas',JSON.stringify(this.lecturas));

        load.dismiss();

        this.nav.navigateForward('/nueva-recogida/step-three/summary');

      })

    });
  }

  comprobarRaee(i)
  {
    return new Promise(resolve => {

      this.consultaService.GetRaee(i).subscribe((data:any)=>{

          var lectura = {
              etiqueta: i,
              fraccion: null,
              residuo: null,
              residuo_especifico: null,
              marca: null,
              tipo_contenedor: null,
              canibalizado: null,
              estado_raee: null,
              ref: null
          };

          if (data) {
            this.alertCtrl.create({message:"El Residuo "+i+" ya ha sido recogido",buttons: ['Ok']}).then(a=>a.present());
            return resolve(true);
          }

          if (!data) {
            // this.nav.navigateForward('/nueva-recogida/step-three/readed');
            this.lecturas.push({values:lectura, photos:null});
            return resolve(true);
          }

          this.loadingCtrl.create().then(async l=>{

            this.consultaService.getIdentificacion(data[0].sidRaee).subscribe((data:any)=>{
              l.dismiss();

              console.log(data);

              if (data.length) {

                let raee = data[0];

                lectura = {
                  etiqueta: raee.pidRaee,
                  fraccion: raee.sidFraccion,
                  residuo: raee.sidResiduo,
                  residuo_especifico: raee.sidResiduoEspecifico,
                  marca: raee.sidMarca,
                  tipo_contenedor: raee.sidTipoContenedor,
                  canibalizado: raee.canibalizado,
                  estado_raee: raee.sidEstadoRaee,
                  ref: null
                };
                // this.params.setParam({values:lectura, photos:null});
              }

              this.lecturas.push({values:lectura, photos:null});
              resolve(true);
              // this.nav.navigateForward('/nueva-recogida/step-three/readed');
            },err=>{
              l.dismiss();
              // this.nav.navigateForward('/nueva-recogida/step-three/readed');
            });

          });
        },err=>{
          resolve(false);
          this.loadingCtrl.dismiss();
        });
    })
  }

  adelante()
  {
    localStorage.setItem('read_type',this.myForm.value.type);
    this.nav.navigateForward('/nueva-recogida/qr');
  }

  atras() {
    this.nav.navigateRoot('/home');
    // this._location.back();
  }

}