import { Component, OnInit } from '@angular/core';
import { Centro } from 'src/app/models/centro';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Solicitud } from 'src/app/models/solicitud';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-consulta-solicitud',
  templateUrl: './consulta-solicitud.page.html',
  styleUrls: ['./consulta-solicitud.page.scss'],
})
export class ConsultaSolicitudPage implements OnInit {

  centro: Centro = new Centro();
  pagina: string;
  validacionSolicitudes = false;
  consultaSolicitudes = false;
  titulo: string = "Validación de solicitudes de recogida";
  listaEtiqueta: number;
  detalleEtiquetakBtn: boolean = false;
  usuario: Usuario = new Usuario();
  solicitudes: Solicitud[] = [];
  validacionSolicitud: Solicitud[] = [];
  solicitud: Solicitud = new Solicitud();
  myForm: FormGroup;

  constructor(private usuarioService: UsuarioService,
    private alertCtrl: AlertController,
    private _location: Location,
    private translate: TranslateService,
    private fb: FormBuilder,
    private consultasService: ConsultasService,
    private route: ActivatedRoute,
    private router: Router) {
    this.myForm = this.fb.group({
      centro: ['']
    });

    this.cargarDatos();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let pagina = this.router.getCurrentNavigation().extras.state.nombrePagina;
        if (pagina == "Validación de recogidas") {
          this.titulo = "Validación de solicitudes de recogida"
          this.validacionSolicitudes = true;
        } else if (pagina == "Consulta del estado de solicitudes") {
          this.titulo = "Consulta de solicitudes"
          this.consultaSolicitudes = true;
        }
      }
    });
  }

  ngOnInit() {

  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
    if (this.usuario.centros.length == 1) {
      this.myForm.get('centro').disable();
      this.myForm.get('centro').setValue(this.usuario.centros[0].PidDireccionTercero);
    }
  }

  async cargarSolicitudes() {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CARGANDO"));
    if (this.consultaSolicitudes) {
      this.consultasService.consultaSolicitudes(this.usuario.tercero.PidTercero, this.myForm.get('centro').value).subscribe((res: any) => {
        this.usuarioService.cerrarSpinner();
        if (res == undefined) {
          this.solicitudes = [];
        } else {
          this.solicitudes = res.solicitud;
        }
      });
    }

    if (this.validacionSolicitudes) {
      let solicitud = {
        idTercero: this.usuario.tercero.PidTercero,
        idCentro: this.myForm.get('centro').value,
        Estado: "ASG"
      };
      this.consultasService.consultaSolicitudesAsignadas(solicitud).subscribe((res: any) => {
        this.usuarioService.cerrarSpinner();
        this.validacionSolicitud = res.solicitud;
        console.log(this.validacionSolicitud);
      });
    }

  }

  async atender() {

    this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.GUARDANDO"));
    let solicitud = {
      codSolicitud: this.solicitud.cod,
      fechaRec: this.consultasService.fechaActualSolicitud()
    };
    this.consultasService.validacionSolicitud(solicitud).subscribe(res => {
      this.usuarioService.cerrarSpinner();
      console.log(res);
      this.mostrarModal();
    });

  }


  async mostrarModal() {
    const alerta = await this.alertCtrl.create({
      header: this.translate.instant("ALERTA.CABECERA"),
      message: this.translate.instant("VALIDARSOLICITUD.OK",{value : this.solicitud.cod}),
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            this.atras();
          }
        }
      ],
      backdropDismiss: true
    });

    await alerta.present();

  }

  verDetalle() {
    let navigationExtras: NavigationExtras = {
      state: {
        solicitud: this.solicitud
      }
    };
    this.listaEtiqueta = null;
    this.detalleEtiquetakBtn = false;
    this.router.navigate(['/detalle-solicitud'], navigationExtras);
  }

  atras() {
    this._location.back();
  }

  detalleEtiqueta(indx) {
    this.listaEtiqueta = indx;
    this.detalleEtiquetakBtn = true;
    this.solicitud = this.solicitudes[indx];
  }

  detalleEtiquetaValidacion(indx) {
    this.listaEtiqueta = indx;
    this.detalleEtiquetakBtn = true;
    this.solicitud = this.validacionSolicitud[indx];
  }

  ionViewWillEnter() {
    if (this.myForm.get('centro').value) {
      this.cargarSolicitudes();
    }
  }
}
