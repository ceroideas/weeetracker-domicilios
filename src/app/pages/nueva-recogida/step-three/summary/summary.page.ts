import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ConsultasService } from '../../../../services/consultas.service';
import { ParamsService } from '../../../../services/params.service';
import { EventsService } from '../../../../services/events.service';

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

  constructor(private _location: Location,
    private nav: NavController,
    private params: ParamsService,
    private events: EventsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public consultas: ConsultasService) { }

  ngOnInit() {

    this.events.destroy('updateLecturas');
    this.events.subscribe('updateLecturas',()=>{
      this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
    });

    this.consultas.contenedores().subscribe((data:any)=>{
      this.contenedores = data;

      this.consultas.todosEspecificos().subscribe((data:any)=>{
        this.especificos = data;

        this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
      })
    })
  }

  adelante()
  {
    if (this.lecturas.length == 0) {
      return this.alertCtrl.create({message:"No es posible continuar sin haber hecho lectura de al menos 1 etiqueta",
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

  eliminar()
  {
    this.alertCtrl.create({message:"¿Quiere borrar el RAEE seleccionado?", buttons:[
      {
        text:"Si",
        handler:()=>{
          let idx = this.lecturas.findIndex(x=>x.values.etiqueta == this.selected);
          this.lecturas.splice(idx,1);

          localStorage.setItem('lecturas',JSON.stringify(this.lecturas));
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
