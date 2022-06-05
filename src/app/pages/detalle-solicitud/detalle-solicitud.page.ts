import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud, Linea } from 'src/app/models/solicitud';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.page.html',
  styleUrls: ['./detalle-solicitud.page.scss'],
})
export class DetalleSolicitudPage implements OnInit {

  solicitud: Solicitud = new Solicitud();
  solicitudAux: any
  usuario: Usuario = new Usuario();
  estado: string;
  mostrarLineas : boolean = false;

  constructor(private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private translate : TranslateService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.solicitud = this.router.getCurrentNavigation().extras.state.solicitud;
        console.log(this.solicitud);
        // this.solicitudAux = this.solicitud.lineas;
        // this.solicitud.lineas = this.solicitudAux.linea;
        this.cargar();
      }
    });
  }

  ngOnInit() {
  }

  async cargar(){
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.CARGANDO"));
    this.cargarDatos().then(res => {
    this.procesarEstado(this.solicitud.est);
    // this.procesarResiduo();
  });
  }

  async procesarEstado(estado) {
    switch (estado) {
      case "CON":
        this.estado = "Confirmada";
        break;
      case "ASG":
        this.estado = "Asignada";
        break;
      case "ATN":
        this.estado = "Atendida";
        break;
      case "REC":
        this.estado = "Recogida";
        break;
      case "ANU":
        this.estado = "Anulada";
        break;
    };
    await this.usuarioService.cerrarSpinner();
  }

  // async procesarResiduo() {
  //   if(Array.isArray(this.solicitud.lineas)){
  //     this.solicitud.lineas.forEach(element => {
  //       let residuo = this.usuario.residuos.find(r => r.Id === parseInt(element.resEspe));
  //       element.descripcion = residuo.Nombre;
  //     });
  //     this.mostrarLineas = true;
  //   }else{
  //     let lineas : any = this.solicitud.lineas;
  //     let residuo : any = this.usuario.residuos.find(r => r.Id === parseInt(lineas.resEspe));
  //     this.solicitud.lineas = [];
  //     this.solicitud.lineas.push(lineas);
  //     this.solicitud.lineas[0].descripcion = residuo.Nombre;
  //     this.mostrarLineas = true;
  //   }
  //  await this.usuarioService.cerrarSpinner();
  // }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
  }

  atras() {
    this._location.back();
  }

}
