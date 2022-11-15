import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ConsultasService } from 'src/app/services/consultas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';

declare var moment:any;

@Component({
  selector: 'app-operativas-realizadas',
  templateUrl: './operativas-realizadas.page.html',
  styleUrls: ['./operativas-realizadas.page.scss'],
})
export class OperativasRealizadasPage implements OnInit {

  titulo: string = "Operativas Realizadas";
  usuario: Usuario = new Usuario();
  idCentro: any;
  idTercero: any;
  operativas:any;
  operativas_aux:any;
  visualizarTabla = false;
  detalleOperativa = null;
  detalleOperativaBtn = false;
  verDetalle = false;

  filter:any;

  tipooperativas = [];

  raees = [];

  observaciones;

  constructor(private _location: Location,
    private consultasService: ConsultasService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private nav: NavController,
    private usuarioService: UsuarioService,) {
    this.cargarDatos();
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();

    let res = [];

    for (let i of this.usuario.responsabilidades)
    {
      res.push(i.TipoOperacion);
    }

    this.tipooperativas = res.filter(this.onlyUnique);

      this.idCentro =  this.usuario.dtercero;
      this.idTercero = this.usuario.tercero.PidTercero;

      console.log(this.usuario)
      this.cargarOperativas(this.idCentro, this.idTercero);
  }

  ngOnInit() {

  }

  async cargarOperativas(idt,idg)
  {
    await this.usuarioService.mostrarSpinner("Obteniendo Operativas");
    this.consultasService.getOperativas(this.idTercero, this.idCentro).subscribe((res: any) => {
      console.log(res);
      this.operativas = res.operativas.reverse();
      this.operativas_aux = res.operativas.reverse();
      this.visualizarTabla = true;
      this.usuarioService.cerrarSpinner();
    });
  }

  volver()
  {
    this.verDetalle = false;
  }

  atras() {
    this._location.back();
  }

  filtrar()
  {
    this.detalleOperativa = null;
    this.detalleOperativaBtn = null;
    this.operativas = this.operativas_aux.filter(x=>x.sidTipoOperativa == this.filter);
  }

  detalle(i)
  {
    this.detalleOperativa = i;
    this.detalleOperativaBtn = true;
  }

  verDetalleEtiqueta()
  {
    this.verDetalle = true;

    this.raees = [];
    this.observaciones = this.operativas[this.detalleOperativa].observaciones;

    this.loadingCtrl.create().then(l=>{
      l.present();

      this.consultasService.GetRaees(this.operativas[this.detalleOperativa].pidCertificado).subscribe((data:any)=>{
        l.dismiss();
        this.raees = data;
      })
    })
  }

  saveObservations()
  {
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.consultasService.saveObservations({pidCertificado:this.operativas[this.detalleOperativa].pidCertificado, observaciones:this.observaciones}).subscribe(data=>{
        this.verDetalle = false;

        this.operativas[this.detalleOperativa].observaciones = this.observaciones;

        this.alertCtrl.create({message:"Se han guardado las observaciones sobre este Certificado", buttons: ['Ok']}).then(a=>a.present());
        l.dismiss();
      })
    })
  }

}
