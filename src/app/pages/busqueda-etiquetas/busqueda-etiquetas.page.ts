import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { LectorService } from 'src/app/services/lector.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Residuo } from 'src/app/models/residuos';
import { IdentificacionService } from 'src/app/services/identificacion.service';
import { NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { ConsultasService } from 'src/app/services/consultas.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-busqueda-etiquetas',
  templateUrl: './busqueda-etiquetas.page.html',
  styleUrls: ['./busqueda-etiquetas.page.scss'],
})
export class BusquedaEtiquetasPage implements OnInit {

  etiquetasAlbaran: boolean = false;
  myForm: FormGroup;
  visorQr: boolean = false;
  residuos: Residuo[] = [];
  residuoObj: Residuo = new Residuo();
  usuario: Usuario = new Usuario();
  listaEtiqueta: number;
  detalleEtiquetakBtn: boolean = false;
  loading: any;

  constructor(private _location: Location,
    private translate: TranslateService,
    private lectorService: LectorService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private platform: Platform,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private consultasService: ConsultasService,
    private loadingCtrl: LoadingController) {
    this.myForm = this.fb.group({
      albaran: ['', Validators.required],
      etiqueta: ['', Validators.compose([
        Validators.required,
        Validators.pattern('18410708[0-9]{9}')
      ])],
    });
    // Controla el boton atras por hadware  
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (!this.visorQr) {
        this.atras();
        this.changeRef.detectChanges();
      } else {
        console.log("no cierra la pantalla");
        this.visorQr = false;
      }
    });
    this.cargarDatos();

  }

  ngOnInit() {
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
  }

  lector(valor) {
    this.visorQr = true;
    this.lectorService.scan(valor).then(res => {
      this.asignarEtiqueta(valor, res);
    });
  }

  limpiar(valor) {
    this.asignarEtiqueta(valor, "");
  }

  async asignarEtiqueta(valor: string, etiqueta: string) {
    if (etiqueta === "error") {
      this.usuarioService.mostrarAlerta(this.translate.instant("IDENTIFICACION.FORMATONOOK"));
    } else {
      this.myForm.get(valor).setValue(etiqueta);
    }
  }

  atras() {
    this._location.back();
  }

  buscar() {
    if (this.myForm.get('etiqueta').status == 'VALID') {
      this.cargarEtiqueta();
    } else if (this.myForm.get('albaran').status == 'VALID') {
      this.cargarAlbaran();
    }
  }

  async cargarEtiqueta() {
   await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.BUSCANDO"));

    this.consultasService.getIdentificacion(this.myForm.get('etiqueta').value).subscribe((res: any) => {
      console.log(res);
      if (res.length > 0) {
        this.residuoObj = res[0];
        let navigationExtras: NavigationExtras = {
          state: {
            residuo: this.residuoObj
          }
        };
        this.usuarioService.cerrarSpinner();
        this.router.navigate(['/detalle-etiqueta'], navigationExtras);
      }
    }, error => {
      this.usuarioService.cerrarSpinner();
      this.usuarioService.mostrarAlerta(this.translate.instant("BUSQUEDAETIQUETAS.NOEXISTEETIQUETA"));
    });
  }

  async cargarAlbaran() {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.BUSCANDO"));
    this.consultasService.getEtiquetasAlbaran(this.usuario.tercero.PidTercero, this.myForm.get('albaran').value).subscribe((res: any) => {
      this.residuos = [];
      res.residuo.forEach(element => {
        this.residuos.unshift(element);
      });
      this.etiquetasAlbaran = true;
      this.usuarioService.cerrarSpinner();
    }, error => {
      this.usuarioService.cerrarSpinner();
      this.usuarioService.mostrarAlerta(this.translate.instant("BUSQUEDAETIQUETAS.NOEXISTEALBARAN"));
    });
  }

  detalleEtiqueta(indx) {
    this.listaEtiqueta = indx;
    this.detalleEtiquetakBtn = true;
    this.residuoObj = this.residuos[indx];
  }

  verEtiqueta() {
    this.listaEtiqueta = null;
    this.detalleEtiquetakBtn = false;
    let navigationExtras: NavigationExtras = {
      state: {
        residuo: this.residuoObj
      }
    };
    this.router.navigate(['/detalle-etiqueta'], navigationExtras);
  }

}
