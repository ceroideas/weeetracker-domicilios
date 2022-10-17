import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Identificacion } from '../models/identificacion';

import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

import { File as _File } from '@awesome-cordova-plugins/file/ngx';

const apiUrl = environment.apiUrl;

declare var $:any;
declare var moment:any;

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  url = environment.apiUrl;

  constructor(private http: HttpClient, private file: _File, private platform: Platform, private keyboard: Keyboard) {
  }
  
  getIdentificacion(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + '/residuo', etiquetaObj);
  }
  GetRaee(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + '/residuo/GetRaee', etiquetaObj);
  }
  GetRaees(certificado: string) {
    return this.http.get(apiUrl + '/residuo/GetRaees/'+certificado);
  }
  GetRaeesFraccion(certificado: string) {
    return this.http.get(apiUrl + '/residuo/GetRaeesFraccion/'+certificado);
  }
  RaeesDia(dia: string, centro: number) {
    return this.http.get(apiUrl + '/solicitud/RaeesDia/'+dia+'/'+centro);
  }

  getConsultaResiduo(idTercero, idCentro, idResiduo) {
    let residuo = { idTercero: idTercero, idCentro: idCentro, idResiduo: idResiduo };
    return this.http.post(apiUrl + '/residuo/especifico', residuo);
  }
  guardarPeso(data) {
    return this.http.post(apiUrl + '/solicitud/guardarPeso', data);
  }
  saveObservations(data) {
    return this.http.post(apiUrl + '/solicitud/saveObservations', data);
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

  getOperativas(idTercero, idCentro) {
    return this.http.get(apiUrl + '/solicitud/operativas/'+idTercero+'/'+idCentro);
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
  todosEspecificos()
  {
    return this.http.get(apiUrl + '/residuo/todosEspecificos');
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
  centrosGestores(){
    return this.http.get(apiUrl + '/solicitud/centrosGestores');
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
  getResponsabilities(idTercero, idCentro) {
    return this.http.get(apiUrl + '/users/getResponsabilities/'+idTercero+'/'+idCentro);
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

  recuperarCertificado(initial)
  {
    return this.http.get(apiUrl + '/solicitud/recuperarCertificado/'+initial);
  }

  recuperarCertificadoRAEE(initial)
  {
    return this.http.get(apiUrl + '/solicitud/recuperarCertificadoRAEE/'+initial);
  }

  recuperarCertificadoFotos(initial)
  {
    return this.http.get(apiUrl + '/solicitud/recuperarCertificadoFotos/'+initial);
  }

  getMunicipios(idProd)
  {
    return this.http.get(apiUrl + '/solicitud/getMunicipios/'+idProd);
  }

  upload(data)
  {
    return this.http.post(apiUrl + '/file/upload',data);
  }
  FTPUpload(data)
  {
    return this.http.post(apiUrl + '/file/FTPUpload',data);
  }

  informacion(data)
  {
    return this.http.post(apiUrl + '/solicitud/informacion',data);
  }

  uploadFTP(url,name,type = '/Fotos')
  {
    console.log(url);
    url = url.replace('data:image/jpeg;base64,', '');
    url = url.replace('data:image/png;base64,', '');

    return new Promise((resolve)=>{
     this.http.post(apiUrl + '/file/FTPUploadFotos', {'ArchivoCodificado':url,'Nombre':name, 'Ruta': type})

     .subscribe(data=>{
       return resolve(data);
     },err=>{
       return resolve(err);
     });

      // fetch(url)
      // .then((res:any) => res.blob())
      // .then((myBlob)=>{

      //   console.log(myBlob);

      //   var file:any;

      //   file = new File([myBlob], name,{
      //     type: myBlob.type,
      //   });

      //   let formData = new FormData();
      //   formData.append('File',file);

      //   $.ajax({
      //     url: this.url+'/file/'+type,
      //     type: 'POST',
      //     contentType: false,
      //     processData: false,
      //     data: formData,
      //   })
      //   .done(function(data) {
      //     console.log(data);
      //     resolve(data);
      //   })
      //   .fail(function() {
      //     console.log("error");
      //     resolve(null);
      //   })
      //   .always(function() {
      //     console.log("complete");
      //   });

      // })

    })
  }

  uploadLog(name,type)
  {
    return new Promise((resolve)=>{
      if (this.platform.is('cordova')) {
        
        let url = this.file.externalRootDirectory+'logs';

        this.file.checkFile(url,'log.txt').then(response => {

          this.http.post(apiUrl + '/file/FTPUploadFotos', {'ArchivoCodificado':url+'/log.txt','Nombre':name, 'Ruta': type}).subscribe(data=>{
            return resolve(data);
          });

        },err=>{
          return resolve(false);
        });

      }else{
        return resolve(true);
      }
      /**/
    })
  }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x.values[key]] = rv[x.values[key]] || []).push(x);
      return rv;
    }, {});
  }

  appendInfo(data)
  {
    let path = this.file.externalRootDirectory+'logs';
    let date = " | "+moment().format('DD-MM-Y HH:mm:ss');

    this.file.checkFile(path,'log.txt').then(response => {
      this.file.writeFile(path,'log.txt',JSON.stringify(data)+date,{append:true, replace: false});
    }).catch(err=>{
      this.file.createFile(path,'log.txt',true).then(response=>{  
        this.file.writeFile(path,'log.txt',JSON.stringify(data)+date,{append:true, replace: false});
      })
    })
  }

  createLogger(data)
  {
    if (this.platform.is('cordova')) {
      this.file.checkDir(this.file.externalRootDirectory,'logs').then(response => {

        this.appendInfo(data);

      }).catch(err => {

        this.file.createDir(this.file.externalRootDirectory, 'logs', false).then(response => {
          
          this.appendInfo(data);

        }).catch(err => {
          console.log('No se pudo crear'+JSON.stringify(err));
        }); 
      });
    }
  }

  hideKeyboard()
  {
    console.log('hidding keyboard');
    setTimeout(()=>{
      if (this.keyboard.isVisible) {
        this.keyboard.hide();
      }
    },200)
  }

}
