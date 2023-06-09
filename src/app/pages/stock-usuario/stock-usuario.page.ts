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
  selector: 'app-stock-usuario',
  templateUrl: './stock-usuario.page.html',
  styleUrls: ['./stock-usuario.page.scss'],
})
export class StockUsuarioPage implements OnInit {

  usuario: Usuario = new Usuario();
  idCentro;
  myForm: FormGroup;
  titulo: string = "Consulta de stock";
  verDetalle: boolean = false;
  detalleStock: number;
  listaEtiqueta: number;
  detalleStockBtn: boolean = false;
  detalleEtiquetakBtn: boolean = false;
  stock: Stock = new Stock();
  totalStock: number = 0;
  visualizarTabla = false;
  sum = 0;
  residuo: StockResiduoEspecifico;
  totalResiduo: number;
  residuos: Residuo[] = [];
  residuoObj: Residuo = new Residuo();
  centro: number;
  loading: any;

  constructor(private _location: Location,
    private translate: TranslateService,
    private consultasService: ConsultasService,
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.cargarDatos();
    this.myForm = this.fb.group({
      centro: ['', Validators.required]
    });
  }
  obtenerCentro(centro)
  {
    this.idCentro = centro.detail.value;

    this.cargarStock(this.usuario.id,this.idCentro);
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
    if (this.usuario.centros.length == 1) {
      this.myForm.get('centro').disable();
      this.myForm.get('centro').setValue(this.usuario.centros[0].PidDireccionTercero);
      this.idCentro =  this.usuario.centros[0].PidDireccionTercero;
      this.cargarStock(this.idCentro, this.usuario.tercero.PidTercero);
    }
  }

  async cargarStock(idUsuario,idCentro) {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CONSULTANDO"));

    this.consultasService.getStockUsuario(idUsuario,idCentro).subscribe((res:any)=>{
      this.stock = res.stock;
      this.calcularStock();
      this.visualizarTabla = true;
      this.usuarioService.cerrarSpinner();
    });
  }

  calcularStock() {
    this.sum = 0;
    if (this.stock.listaStock.length == 0) { this.totalStock = 0; }
    this.stock.listaStock.forEach(element => {
      this.totalStock = this.sum + element.cantidad;
      this.sum = this.totalStock;
    });
  }

  atras() {
    this._location.back();
  }

  detalle(indx: number) {
    this.detalleStock = indx;
    this.residuo = this.stock.listaStock[indx];
    this.detalleStockBtn = true;
  }

  verDetalleEtiqueta() {
    this.verDetalle = true;
    this.detalleStockBtn = false;
    this.detalleStock = null;
    this.cargarEtiquetasResiduo(this.idCentro, this.usuario.id, this.residuo.id);
  }

  async cargarEtiquetasResiduo(idCentro, idUsuario, idResiduo) {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CONSULTANDO"));
    this.consultasService.getConsultaResiduoUsuario(idUsuario, idCentro, idResiduo).subscribe((res: any) => {
      this.residuos = [];
      res.residuo.forEach(element => {
        let residuo: Residuo = new Residuo();
        residuo = element;
        this.residuos.unshift(residuo);
        this.usuarioService.cerrarSpinner();
      });
    })
  }

  detalleEtiqueta(indx: number) {
    this.listaEtiqueta = indx;
    this.detalleEtiquetakBtn = true;
    this.residuoObj = this.residuos[indx];
  }

  verEtiqueta() {
    this.listaEtiqueta = null;
    this.detalleEtiquetakBtn = false;
    //this.navCtrl.navigateForward("/detalle-etiqueta");
    let navigationExtras: NavigationExtras = {
      state: {
        residuo: this.residuoObj
      }
    };
    this.router.navigate(['/detalle-etiqueta'], navigationExtras);
  }

}
