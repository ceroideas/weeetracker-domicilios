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

    this.consultaService.contenedores().subscribe(data=>{
      localStorage.setItem('contenedores',JSON.stringify(data));
      this.consultaService.fracciones().subscribe((data:any)=>{
        localStorage.setItem('fracciones',JSON.stringify(data));
      });
    });

    this.myForm = this.fb.group({
      type: ['individual', Validators.required],
      // request_n: [''],
    });
    this.cargarUsuario();
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log('usuario',this.usuario);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  prueba()
  {
    console.log('hola');
    this.events.publish('data:scan',{scanData: "intent", time: new Date().toLocaleTimeString()});
  }

  async ngOnInit() {

    this.consultaService.createLogger('Seleccionar Tipo de Lectura Success');

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
      this.consultaService.createLogger('Nueva Lectura Success');
      console.log('new Read')
      this.myForm.patchValue({type:'individual'});
      setTimeout(()=>{
        this.adelante();
      },100);
    });

    this.events.destroy('getLecturas');
    this.events.subscribe('getLecturas',async data=>{
      this.consultaService.createLogger('Obtener Lecturas Success');
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
        
        this.consultaService.GetRaee(data,parseInt(this.usuario.dtercero),localStorage.getItem('tipo_operativa')).subscribe((data:any)=>{

          if (data.statusCode && data.statusCode == 422) {
            l.dismiss();
            return this.alertCtrl.create({message:data.value,buttons: ['Ok']}).then(a=>a.present());
          }

          let fracciones = [];

          for (let i of this.usuario.responsabilidades) {
            fracciones.push({id:i.SidFraccion,operacion:i.TipoOperacion, contenedor:i.SidTipoContenedor});
          }

          this.consultaService.createLogger('Comprobando Raee Success');

          l.dismiss();

          // if (data.recogido.length) {
          //   this.consultaService.createLogger('Residuo ya recogido Success');
          //   return this.alertCtrl.create({message:"La etiqueta "+localStorage.getItem('etiqueta')+" ya ha sido recogida",buttons: ['Ok']}).then(a=>a.present());
          // }

          if (data.raee) {

            if (localStorage.getItem('geoFracciones') && localStorage.getItem('geoFracciones') != "[]") {
              fracciones = fracciones.filter(x=>JSON.parse(localStorage.getItem('geoFracciones')).includes(x.id));
            }

            let result = fracciones.filter(this.onlyUnique).find(x=>x.id == data.raee.sidFraccion && x.operacion == localStorage.getItem('tipo_operativa'));

            if (!result) {
              this.consultaService.createLogger('Residuo no puede ser recogido Success');
              return this.alertCtrl.create({message:"No se puede Recoger la etiqueta "+localStorage.getItem('etiqueta'),buttons: ['Ok']}).then(a=>a.present());
            }

            let raee = data.raee;

            var lectura = {
              etiqueta: raee.pidRaee,
              fraccion: raee.sidFraccion,
              residuo: raee.sidResiduo,
              residuo_especifico: raee.sidResiduoEspecifico,
              marca: raee.sidMarca,
              tipo_contenedor: raee.sidTipoContenedor,
              canibalizado: raee.canibalizado,
              estado_raee: raee.sidEstadoRaee ? raee.sidEstadoRaee : 1,
              prevent_overwrite: true,
              ref: null
            };
            /*this.lecturas.push({values: lectura, photos: null});
            localStorage.setItem('lecturas',JSON.stringify(this.lecturas));*/

            // localStorage.setItem('etiqueta_objeto',JSON.stringify(data[0]));
            // this.alertCtrl.create({message:"La etiqueta ya existe"}).then(a=>a.present());
            this.params.setParam({values:lectura, photos:null});

            // this.nav.navigateForward('/nueva-recogida/step-three/readed');
          }

          this.nav.navigateForward('/nueva-recogida/step-three/readed');

          // if (!data) {
          //   this.nav.navigateForward('/nueva-recogida/step-three/readed');
          // }

          /*this.loadingCtrl.create({message:"Obteniendo Valores RAEE"}).then(l=>{

            this.consultaService.getIdentificacion(data).subscribe((data:any)=>{
              l.dismiss();

              console.log(data);

              
            },err=>{
              this.consultaService.createLogger('E | Error al obtener Raee '+JSON.stringify(err));
              l.dismiss();

              this.nav.navigateForward('/nueva-recogida/step-three/readed');
            });

          });*/
        },err=>{
          
          this.consultaService.createLogger('E | Error al obtener Raee '+JSON.stringify(err));

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
          this.consultaService.createLogger('Comproabar RAEE '+i+' Success');
          await this.comprobarRaee(i);
        }

        // localStorage.setItem('lecturas',JSON.stringify(this.lecturas));

        if (!this.lecturas.length) {
          load.dismiss();
          return this.alertCtrl.create({message:"No hay etiquetas que procesar",buttons: ['Ok']}).then(a=>a.present());
        }

        await this._storage?.set('lecturas', this.lecturas);

        load.dismiss();

        this.nav.navigateForward('/nueva-recogida/step-three/summary');

      })

    });
  }

  comprobarRaee(i)
  {
    return new Promise(resolve => {

      this.consultaService.GetRaee(i,parseInt(this.usuario.dtercero),localStorage.getItem('tipo_operativa')).subscribe((data:any)=>{

        if (data.statusCode && data.statusCode == 422) {
            this.alertCtrl.create({message:data.value,buttons: ['Ok']}).then(a=>a.present());
            return resolve(true);
          }

          var lectura = {
              etiqueta: i,
              fraccion: null,
              residuo: null,
              residuo_especifico: null,
              marca: null,
              tipo_contenedor: null,
              canibalizado: false,
              estado_raee: 1,
              prevent_overwrite: false,
              ref: null
          };

          let fracciones = [];

          for (let j of this.usuario.responsabilidades) {
            fracciones.push({id:j.SidFraccion,operacion:j.TipoOperacion, contenedor:j.SidTipoContenedor});
          }

          /*if (data.recogido.length) {
            this.consultaService.createLogger('Residuo ya recogido Success');
            this.alertCtrl.create({message:"La etiqueta "+i+" ya ha sido recogida",buttons: ['Ok']}).then(a=>a.present());
            return resolve(true);
          }*/

          if (data.raee) {

            if (localStorage.getItem('geoFracciones') && localStorage.getItem('geoFracciones') != "[]") {
              fracciones = fracciones.filter(x=>JSON.parse(localStorage.getItem('geoFracciones')).includes(x.id));
            }
            
            let result = fracciones.filter(this.onlyUnique).find(x=>x.id == data.raee.sidFraccion && x.operacion == localStorage.getItem('tipo_operativa'));

            if (!result) {
              this.consultaService.createLogger('Residuo no puede ser recogido Success');
              this.alertCtrl.create({message:"No se puede Recoger la etiqueta "+i,buttons: ['Ok']}).then(a=>a.present());
              return resolve(true);
            }else{
              lectura = {
                etiqueta: data.raee.pidRaee,
                fraccion: data.raee.sidFraccion,
                residuo: data.raee.sidResiduo,
                residuo_especifico: data.raee.sidResiduoEspecifico,
                marca: data.raee.sidMarca,
                tipo_contenedor: data.raee.sidTipoContenedor,
                canibalizado: data.raee.canibalizado,
                estado_raee: data.raee.sidEstadoRaee,
                prevent_overwrite: true,
                ref: null
              };
            }
          }

          this.lecturas.push({values:lectura, photos:null});
          return resolve(true);
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
    this.alertCtrl.create({message:"¿Está seguro de volver atrás? La información actual se perderá", buttons: [
    {
      text:"Si, regresar",
      handler:()=>{
        this.nav.navigateRoot('/home');
      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present())
    // this._location.back();
  }

}
