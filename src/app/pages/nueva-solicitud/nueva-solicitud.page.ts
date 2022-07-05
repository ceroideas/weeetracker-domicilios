import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { Centro } from 'src/app/models/centro';
import { Residuo } from 'src/app/models/residuos';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LectorService } from 'src/app/services/lector.service';
import { TranslateService } from '@ngx-translate/core';
import { ASolicitud, ALinea } from '../../models/aSolicitud';
import { ConsultasService } from 'src/app/services/consultas.service';

@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.page.html',
  styleUrls: ['./nueva-solicitud.page.scss'],
})
export class NuevaSolicitudPage implements OnInit {

  centro: Centro = new Centro();
  albaran: string;
  observaciones: string;
  residuo: Residuo = new Residuo();
  cantidad: number = 1;
  solicitud: ASolicitud = new ASolicitud();
  usuario: Usuario = new Usuario();
  myForm: FormGroup;

  residuos: ALinea[] = [];

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private fb: FormBuilder,
    private lectorService: LectorService,
    private translate: TranslateService,
    private alertCtrl: AlertController) {
    this.myForm = this.fb.group({
      albaran: ['', Validators.compose([
        Validators.maxLength(100)
      ])],
      centro: ['', Validators.required],
      residuo: ['', Validators.required],
      observaciones: [''],
      cantidad: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.myForm.get('cantidad').setValue(1);
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
    if (this.usuario.centros.length == 1) {
      this.myForm.get('centro').disable();
      this.myForm.get('centro').setValue(this.usuario.centros[0].PidDireccionTercero);
    }
  }


  lector(valor) {
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

  sumar() {
    this.cantidad++;
    this.myForm.get('cantidad').setValue(this.cantidad);
  }
  restar() {
    if (this.cantidad > 1) {
      this.cantidad--;
      this.myForm.get('cantidad').setValue(this.cantidad);
    }
  }

  cargarCantidad() {
    this.cantidad = this.myForm.get('cantidad').value;
  }

  async enviarSolicitud() {
    this.solicitud.idCentro = String(this.myForm.get('centro').value);
    this.solicitud.Albaran = this.myForm.get('albaran').value;
    this.solicitud.Observaciones = this.myForm.get('observaciones').value;
    this.solicitud.ListaResiduosEspecificos = this.residuos;
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.GUARDANDO"))
    this.consultaService.altaSolicitud(this.solicitud).subscribe((res: any) => {
      let solicitudObj = res.solicitud.xmlRecepcionSolicitudesResult.root.solicitud
      console.log(solicitudObj);
      if (!solicitudObj.error) {
        this.mostrarModal(solicitudObj.codigo);
      } else {
        this.mostrarError(solicitudObj.codigo);
      }
      this.usuarioService.cerrarSpinner();
    }, error =>{
      this.usuarioService.cerrarSpinner();
      this.usuarioService.mostrarAlerta(this.translate.instant("ERROR.ERROR01"));
    });
  }

  async mostrarModal(texto: string) {
   // await this.usuarioService.mostrarAlerta("Se ha creado una nueva solicitud de recogida con numero " + texto);
    const alerta = await this.alertCtrl.create({
      header: this.translate.instant("ALERTA.CABECERA"),
      subHeader : "Nueva Solicitud",
      message: "Se ha creado una nueva solicitud de recogida con numero " + texto,
      buttons: [
        {
          text: "Ok",
          handler: () => {
           this.atras();
          }
        }
      ],
      backdropDismiss: true
    });
    await alerta.present();
  }

  async mostrarError(codigo: string) {
    let codigoError = codigo.substring(0, 2);
    let texto: string = "No se ha podido crear la solicitud de recogida. </br></br>";
    switch (codigoError) {
      case "-3":
        texto += this.translate.instant("ALTASOLICITUD.-3");
        break;
      case "-4":
        texto += this.translate.instant("ALTASOLICITUD.-4");
        break;
      case "-5":
        texto += this.translate.instant("ALTASOLICITUD.-5");
        break;
      case "-6":
        texto += this.translate.instant("ALTASOLICITUD.-6");
        break;
      case "-7":
        texto += this.translate.instant("ALTASOLICITUD.-7");
        break;

      default:
        break;
    }
    await this.usuarioService.mostrarAlerta(texto);
  }

  nuevaSolicitud() {
    let id = this.myForm.get('residuo').value;
    let residuo = this.usuario.residuos.find(r => r.Id === this.myForm.get('residuo').value);
    let obj: ALinea = { Nombre: residuo.Nombre, Unidades: this.myForm.get('cantidad').value, idResiduo: residuo.Id };
    let count = 0;
    let existe = false;
    this.residuos.forEach(element => {
      if (element.Nombre === residuo.Nombre) {
        existe = true;
      }
      if (!existe) count++;
    });
    if (existe) {
      this.residuos.splice(count, 1);
    }
    this.residuos.unshift(obj);
  }

  eliminar(index: number) {
    this.residuos.splice(index, 1);
  }

  atras() {
    this._location.back();
  }


}
