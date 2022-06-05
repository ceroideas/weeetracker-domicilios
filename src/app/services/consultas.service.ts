import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Identificacion } from '../models/identificacion';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {


  constructor(private http: HttpClient) {
  }
  
  getIdentificacion(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + '/residuo', etiquetaObj);
  }

  getConsultaResiduo(idTercero, idCentro, idResiduo) {
    let residuo = { idTercero: idTercero, idCentro: idCentro, idResiduo: idResiduo };
    return this.http.post(apiUrl + '/residuo/especifico', residuo);
  }

  altaIdentificacion(residuo: Identificacion) {
    return this.http.post(apiUrl + '/residuo/alta', residuo);
  }

  getEtiquetasAlbaran(idTercero, albaran) {
    let etiquetaObj = { idTercero: idTercero, Albaran: albaran };
    return this.http.post(apiUrl + '/residuo/albaran', etiquetaObj);
  }

  getEntrada(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + '/estado/entrada', etiquetaObj);
  }

  getEntradaCentro(etiqueta: string, centro) {
    let etiquetaObj = { Etiqueta: etiqueta, idCentro: centro };
    return this.http.post(apiUrl + `/estado/entrada/centro`, etiquetaObj);
  }

  getSalida(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + `/estado/salida`, etiquetaObj);
  }

  putEstadoEntrada(residuo: Identificacion) {
    return this.http.put(apiUrl + `/estado/entrada`, residuo);
  }

  putEstadoSalida(residuo: Identificacion) {
    return this.http.put(apiUrl + `/estado/salida`, residuo);
  }

  getConsultaStock(idTercero, idCentro) {
    let stock = { idTercero: idTercero, idCentro: idCentro };
    return this.http.post(apiUrl + '/stock', stock);
  }

  fechaActual() {
    let fecha: Date = new Date();
    return fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
  }

  //Solicitudes

  consultaSolicitudes(idTercero, idCentro){
    let solicitud = { idTercero : idTercero , idCentro : idCentro};
    return this.http.post(apiUrl + '/solicitud/consulta', solicitud);
  }

  altaSolicitud(solicitud){
    return this.http.post(apiUrl + '/solicitud/alta',  solicitud);
  }

  consultaSolicitudesAsignadas(solicitud){
    return this.http.post(apiUrl + '/solicitud/consulta', solicitud);
  }

  validacionSolicitud(solicitud){
    return this.http.post(apiUrl + '/solicitud/validacion', solicitud);
  }
  
  fechaActualSolicitud() {
    let fecha: Date = new Date();
    return fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
  }

}
