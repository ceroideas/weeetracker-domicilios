import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ConsultasService } from '../../../../services/consultas.service';
import { ParamsService } from '../../../../services/params.service';
import { EventsService } from '../../../../services/events.service';

import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  lecturas: any;
  titulo = localStorage.getItem('alt_title_sm') ? localStorage.getItem('alt_title_sm') :  "NUEVA RECOGIDA 3 - RAEE: Listado RAEE";
  contenedores = [];
  especificos = [];
  selected = null;

  noFwd = false;

  private _storage: Storage | null = null;

  constructor(private _location: Location,
    private nav: NavController,
    private params: ParamsService,
    private events: EventsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    public consultas: ConsultasService) { }

  async ngOnInit() {

    this.consultas.createLogger('Ver Resumen Success');

    const storage = await this.storage.create();
    this._storage = storage;

    this.events.destroy('updateLecturas');
    this.events.subscribe('updateLecturas',()=>{
      this._storage.get('lecturas').then((storage)=>{
        this.lecturas = storage;
        console.log(storage);
      })
    });

    // this.consultas.contenedores().subscribe((data:any)=>{
      this.contenedores = JSON.parse(localStorage.getItem('contenedores'));

      if (localStorage.getItem('todos_especificos')) {
        this.especificos = JSON.parse(localStorage.getItem('todos_especificos'));
        this.lecturas = await this._storage.get('lecturas');

        this.lecturas = this.lecturas.sort((a, b) => a.values.etiqueta.localeCompare(b.values.etiqueta))
      }else{

        this.consultas.todosEspecificos().subscribe(async (data:any)=>{
          localStorage.setItem('todos_especificos',JSON.stringify(data));
          this.especificos = data;

          // this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
          this.lecturas = await this._storage.get('lecturas');

          this.lecturas = this.lecturas.sort((a, b) => a.values.etiqueta.localeCompare(b.values.etiqueta))
        })
      }
    // })
  }

  ionViewDidEnter()
  {
    if (localStorage.getItem('noFwd')) {
      this.noFwd = true;
    }
  }

  adelante()
  {
    if (this.lecturas.length == 0) {
      return this.alertCtrl.create({message:"No es posible continuar sin haber hecho lectura de al menos 1 etiqueta",
        buttons:["Ok"]}).then(a=>a.present());
    }

    if (this.lecturas.find(x=>x.values.residuo == null)) {
      return this.alertCtrl.create({message:"No es posible continuar sin completar los datos de todas las lecturas",
        buttons:["Ok"]}).then(a=>a.present());
    }

    this.params.setParam({contenedores:this.contenedores,especificos:this.especificos});

    if (localStorage.getItem('alt_title_sm') && localStorage.getItem('alt_title_rd_2')) {
      this.nav.navigateRoot('/nueva-entrega/step-four-ent');
    }else if (localStorage.getItem('alt_title_sm') && localStorage.getItem('alt_title_rd')) {
      this.nav.navigateForward('/nueva-recepcion/step-four-rcp');
    }else{
      this.nav.navigateForward('/nueva-recogida/step-four');
    }
  }

  atras()
  {
    localStorage.removeItem('noFwd');
    if (this.noFwd) {
      return this._location.back();
    }
    if (localStorage.getItem('alt_title_sm') && localStorage.getItem('alt_title_rd_2')) {
      this.nav.navigateRoot('/nueva-entrega/step-three-ent');
    }else if(localStorage.getItem('alt_title_sm') && localStorage.getItem('alt_title_rd')){
      this.nav.navigateRoot('/nueva-recepcion/step-three-rcp');
    }else{
      this.nav.navigateRoot('/nueva-recogida/step-three');
    }
  }

  seleccionar(l)
  {
    this.selected = l.values.etiqueta;
  }

  async eliminar()
  {
    this.alertCtrl.create({message:"¿Quiere borrar el RAEE seleccionado?", buttons:[
      {
        text:"Si",
        handler: async ()=>{
          let idx = this.lecturas.findIndex(x=>x.values.etiqueta == this.selected);
          this.lecturas.splice(idx,1);

          // localStorage.setItem('lecturas',JSON.stringify(this.lecturas));

          await this._storage?.set('lecturas',this.lecturas);
          
          this.events.publish('getLecturas');

          this.events.publish('cargarUsuario');
          this.events.publish('reloadStepFour');
          this.events.publish('reloadStepFive');

          this.selected = null;
        }
      },{
        text:"Cancelar"
      }
    ]}).then(a=>a.present());
  }
  editar()
  {
    this.params.setParam(this.lecturas.find(x=>x.values.etiqueta == this.selected));

    if (localStorage.getItem('alt_title_sm') && localStorage.getItem('alt_title_rd_2')) {
      localStorage.setItem('alt_title_ed','NUEVA ENTREGA 3 - RAEE: Editar RAEE')
    } else if (localStorage.getItem('alt_title_sm') && localStorage.getItem('alt_title_rd')) {
      localStorage.setItem('alt_title_ed','NUEVA RECEPCIÓN 3 - RAEE: Editar RAEE')
    } else {
      localStorage.setItem('alt_title_ed','NUEVA RECOGIDA 3 - RAEE: Editar RAEE')
    }
    this.nav.navigateForward('/nueva-recogida/step-three/edit-read');
  }

  ionViewDidLeave()
  {
    localStorage.removeItem('noFwd');
  }

}
