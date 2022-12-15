import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { EventsService } from '../../../../services/events.service';
import { ParamsService } from '../../../../services/params.service';
import { Usuario } from 'src/app/models/usuario';

import { Storage } from '@ionic/storage-angular';

declare var moment:any;

const wait = (ms) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-step-three-reu',
  templateUrl: './step-three-reu.page.html',
  styleUrls: ['./step-three-reu.page.scss'],
})
export class StepThreeReuPage implements OnInit {

  titulo = "NUEVA REUTILIZACIÓN 3 - Tipo Lectura";
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
    console.log(this.usuario);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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

          let fracciones = [];

          let resp = localStorage.getItem('other_resp') ? JSON.parse(localStorage.getItem('other_resp')) : this.usuario.responsabilidades;
          for (let i of resp) {
            if (i.SidFraccion) {
              fracciones.push({id:i.SidFraccion,operacion:i.TipoOperacion, contenedor:i.SidTipoContenedor});
            }else{
              fracciones.push({id:i.sidFraccion,operacion:i.tipoOperacion, contenedor:i.sidTipoContenedor});
            }
          }

          this.consultaService.createLogger('Comprobando Raee Success');

          l.dismiss();

          // if (data.recogido.length) {
          //   this.consultaService.createLogger('Residuo ya recogido Success');
          //   return this.alertCtrl.create({message:"El Residuo ya ha sido recogido",buttons: ['Ok']}).then(a=>a.present());
          // }

          if (data.raee) {
            let result = fracciones.filter(this.onlyUnique).find(x=>x.id == data.raee.sidFraccion && x.operacion == localStorage.getItem('tipo_operativa'));

            if (!result) {
              this.consultaService.createLogger('Residuo no puede ser recogido Success');
              return this.alertCtrl.create({message:"No se puede Recoger esa etiqueta",buttons: ['Ok']}).then(a=>a.present());
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
              estado_raee: raee.sidEstadoRaee,
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

          localStorage.setItem('alt_title_rd','NUEVA REUTILIZACIÓN 3 - RAEE: Listado RAEE');
          localStorage.setItem('alt_title_rd_4','1');
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

        localStorage.setItem('alt_title_sm','NUEVA REUTILIZACIÓN 3 - RAEE: Listado RAEE');
        localStorage.setItem('alt_title_rd_4','1');
        this.nav.navigateForward('/nueva-recogida/step-three/summary');

      })

    });

    if (localStorage.getItem('tipo_operativa') == 'REU') {
      let origen = JSON.parse(localStorage.getItem('origen'));
      this.consultaService.getResponsabilities(
        origen.sidTercero,
        origen.sidDireccionTercero,
        this.usuario.tercero.PidTercero,
        this.usuario.dtercero).subscribe((data:any)=>{
        // console.log(data.resp,this.usuario.responsabilidades)
        console.log(data.resp);
        localStorage.setItem('other_resp',JSON.stringify(data.resp));
      })
    }else{
      localStorage.removeItem('other_resp');
    }
  }

  goSummary()
  {
    localStorage.setItem('alt_title_sm','NUEVA REUTILIZACIÓN 3 - RAEE: Listado RAEE');
    localStorage.setItem('alt_title_rd_4','1');
    this.nav.navigateForward('/nueva-recogida/step-three/summary');
  }

  comprobarRaee(i)
  {
    return new Promise(resolve => {

      this.consultaService.GetRaee(i,parseInt(this.usuario.dtercero),localStorage.getItem('tipo_operativa')).subscribe((data:any)=>{

          var lectura = {
              etiqueta: i,
              fraccion: null,
              residuo: null,
              residuo_especifico: null,
              marca: null,
              tipo_contenedor: null,
              canibalizado: false,
              estado_raee: null,
              prevent_overwrite: false,
              ref: null
          };

          let fracciones = [];

          let resp = localStorage.getItem('other_resp') ? JSON.parse(localStorage.getItem('other_resp')) : this.usuario.responsabilidades;
          for (let i of resp) {
            if (i.SidFraccion) {
              fracciones.push({id:i.SidFraccion,operacion:i.TipoOperacion, contenedor:i.SidTipoContenedor});
            }else{
              fracciones.push({id:i.sidFraccion,operacion:i.tipoOperacion, contenedor:i.sidTipoContenedor});
            }
          }

          // if (data.recogido.length) {
          //   this.consultaService.createLogger('Residuo ya recogido Success');
          //   this.alertCtrl.create({message:"El Residuo "+i+" ya ha sido recogido",buttons: ['Ok']}).then(a=>a.present());
          //   return resolve(true);
          // }

          if (data.raee) {
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

          /*if (data) {
            this.consultaService.createLogger('Residui ya recogido Success');
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

              this.consultaService.createLogger('E | Error al obtener RAEE');

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

          });*/
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
