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
  titulo = "NUEVA RECOGIDA 3 - RAEE: Listado RAEE";
  contenedores = [];
  especificos = [];
  selected = null;

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

    const storage = await this.storage.create();
    this._storage = storage;

    this.events.destroy('updateLecturas');
    this.events.subscribe('updateLecturas',()=>{
      this._storage.get('lecturas').then((storage)=>{
        this.lecturas = storage;
        console.log(storage);
      })
    });

    this.consultas.contenedores().subscribe((data:any)=>{
      this.contenedores = data;

      this.consultas.todosEspecificos().subscribe(async (data:any)=>{
        this.especificos = data;

        // this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
        this.lecturas = await this._storage.get('lecturas');
      })
    })
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

    this.nav.navigateForward('/nueva-recogida/step-four');
  }

  atras()
  {
    this.nav.navigateRoot('/nueva-recogida/step-three');
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

    this.nav.navigateForward('/nueva-recogida/step-three/edit-read');
  }

}