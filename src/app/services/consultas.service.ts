import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  GetRaee(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + '/residuo/GetRaee', etiquetaObj);
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

  contenedores() {
    return this.http.get(apiUrl + '/residuo/contenedores');
  }
  fracciones() {
    return this.http.get(apiUrl + '/residuo/fracciones');
  }

  fechaActual() {
    let fecha: Date = new Date();
    return fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
  }

  especificos(id)
  {
    return this.http.get(apiUrl + '/residuo/especificos/'+id);
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

  buscarCentro(data){
    return this.http.post(apiUrl + '/solicitud/findCentros', data);
  }
  nuevoOrigen(data){
    return this.http.post(apiUrl + '/solicitud/nuevoOrigen', data);
  }

  centroData(idCentro)
  {
    return this.http.get(apiUrl + '/solicitud/infoTercero/'+idCentro);
  }
  ubicacionCentro(data)
  {
    return this.http.post(apiUrl + '/solicitud/centroUbicacion',data);
  }

  getConfigInformation(gestor, centro){
    return this.http.get(apiUrl + '/users/config/'+gestor+'/'+centro);
  }

  // solo si es un dispositivo zebra
  listarUsuarios(centro){
    return this.http.get(apiUrl + '/users/listar/'+centro);
  }
  
  fechaActualSolicitud() {
    let fecha: Date = new Date();
    return fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
  }


  getXML(path) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'text/xml') 
        .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method");

    return this.http.get(path,{headers: headers, responseType: 'text'});
  }

  getPaises()
  {
    return this.http.get(apiUrl + '/solicitud/getPaises');
  }

  getProvincias(idPais)
  {
    return this.http.get(apiUrl + '/solicitud/getProvincias/'+idPais);
  }

  getMunicipios(idProd)
  {
    return this.http.get(apiUrl + '/solicitud/getMunicipios/'+idProd);
  }

}
