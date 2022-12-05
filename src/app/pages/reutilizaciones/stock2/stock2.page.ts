import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController, LoadingController } from '@ionic/angular';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Stock, StockResiduoEspecifico } from 'src/app/models/stock';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { Residuo } from 'src/app/models/residuos';
import { Router, NavigationExtras } from '@angular/router';
import { Centro } from 'src/app/models/centro';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-stock2',
  templateUrl: './stock2.page.html',
  styleUrls: ['./stock2.page.scss'],
})
export class Stock2Page implements OnInit {

  titulo: string = "Consulta de stock";
  verDetalle: boolean = false;
  detalleStock: number;
  listaEtiqueta: number;
  detalleStockBtn: boolean = false;
  detalleEtiquetakBtn: boolean = false;
  // stock: Stock = new Stock();
  stock = [];
  totalStock: number = 0;
  usuario: Usuario = new Usuario();
  idCentro: any;
  idTercero: any;
  visualizarTabla = false;
  sum = 0;
  residuo: StockResiduoEspecifico;
  totalResiduo: number;
  residuos: Residuo[] = [];
  residuoObj: Residuo = new Residuo();
  centro: number;
  loading: any;

  details = [];
  fr:any;

  constructor(private _location: Location,
    private translate: TranslateService,
    private consultasService: ConsultasService,
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController) {
    this.cargarDatos();
  }

  ngOnInit() {

  }

  obtenerCentro(centro) {
    this.idCentro = centro.detail.value;
    this.centro = this.idCentro;

    this.cargarStock(this.idCentro, this.usuario.tercero.PidTercero);
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
      this.idCentro =  this.usuario.dtercero;
      this.idTercero = this.usuario.tercero.PidTercero;
      this.cargarStock(this.idCentro, this.idTercero);
  }

  async cargarStock(idCentro, idTercero) {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CONSULTANDO"));
    this.consultasService.getConsultaStock2(idTercero, idCentro).subscribe((res: any) => {
      this.stock = res.stock;
      this.visualizarTabla = true;
      this.usuarioService.cerrarSpinner();
    });
  }

  atras() {
    this._location.back();
  }

  volver()
  {
    this.verDetalle = false;
  }

  detalle(indx: number,fr) {
    this.detalleStock = indx;
    this.residuo = this.stock[indx];
    this.detalleStockBtn = true;
    this.fr = fr;
  }

  filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof(obj[key] == "object")){
                var item = obj[key];
                if(item[prop] == value){
                    filtered.push(item);
                }
            }
        }

    }    

    return filtered;

}

  verDetalleEtiqueta()
  {
    this.verDetalle = true;
    this.details = this.filterByProperty(this.stock,'sidDireccionTercero',this.idCentro);

    console.log(this.details);
  }

}
