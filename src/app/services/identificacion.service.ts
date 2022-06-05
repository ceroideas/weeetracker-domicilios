import { Injectable } from '@angular/core';
import { Identificacion } from '../models/identificacion';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConsultasService } from 'src/app/services/consultas.service';

const apiUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class IdentificacionService {

  identificaciones: Identificacion[] = [];
  reqOpts: any;


  constructor(private storage: Storage,
    private consultaService: ConsultasService) {

    this.cargarIdentificaciones();

  }

  guardarIdentificacion(identificacion: Identificacion) {
    this.identificaciones.unshift(identificacion);
    this.storage.set('identificaciones', this.identificaciones);
  }

  async cargarIdentificaciones() {
    const indentificacionesGuardadas = await this.storage.get('identificaciones');
    if (indentificacionesGuardadas) {
      this.identificaciones = indentificacionesGuardadas;
    }

  }

  async hayIdentificaciones() {
    let indentificacionesGuardadas: Identificacion[] = await this.storage.get('identificaciones');
    if (indentificacionesGuardadas.length > 0) {
      indentificacionesGuardadas.forEach((identificacion: Identificacion) => {
        this.consultaService.altaIdentificacion(identificacion);
      });
    }
  }



}
