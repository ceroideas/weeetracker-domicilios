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

  public actualV = '1.0.42';

  constructor(private http: HttpClient, private file: _File, private platform: Platform, private keyboard: Keyboard) {
  }
  
  getVersion() {
    return this.http.get(apiUrl + '/users/getVersion/'+this.actualV);
  }
  changePassword(values) {
    return this.http.post(apiUrl + '/users/changePassword', values);
  }
  getIdentificacion(etiqueta: string) {
    let etiquetaObj = { Etiqueta: etiqueta };
    return this.http.post(apiUrl + '/residuo', etiquetaObj);
  }
  GetRaee(etiqueta: string, centro: number, operativa = '') {
    let etiquetaObj = { Etiqueta: etiqueta, IdCentro: centro, Operativa: operativa };
    return this.http.post(apiUrl + '/residuo/GetRaee', etiquetaObj);
  }
  GetRaeeReutilizacion(etiqueta: string, centro: number, operativa = '') {
    let etiquetaObj = { Etiqueta: etiqueta, IdCentro: centro, Operativa: operativa };
    return this.http.post(apiUrl + '/residuo/GetRaeeReutilizacion', etiquetaObj);
  }
  GetRaee2(etiqueta: string, centro: number) {
    let etiquetaObj = { Etiqueta: etiqueta, IdCentro: centro };
    return this.http.post(apiUrl + '/residuo/GetRaee2', etiquetaObj);
  }
  GetRaee3(etiqueta: string, centro: number) {
    let etiquetaObj = { Etiqueta: etiqueta, IdCentro: centro };
    return this.http.post(apiUrl + '/residuo/GetRaee3', etiquetaObj);
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
  RaeesDia2(dia: string, centro: number) {
    return this.http.get(apiUrl + '/solicitud/RaeesDia2/'+dia+'/'+centro);
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
  getConsultaStock2(idTercero, idCentro) {
    let stock = { idTercero: idTercero, idCentro: idCentro };
    return this.http.post(apiUrl + '/stock/stock2', stock);
  }

  getOperativas(idTercero, idCentro) {
    return this.http.get(apiUrl + '/solicitud/operativas/'+idTercero+'/'+idCentro);
  }

  getReutilizaciones(idTercero, idCentro) {
    return this.http.get(apiUrl + '/solicitud/reutilizaciones/'+idTercero+'/'+idCentro);
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
  centrosGestores(id1,id2,id3){
    return this.http.get(apiUrl + '/solicitud/centrosGestores/'+id1+'/'+id2+'/'+id3);
  }
  centrosEntrega(id1,id2,id3){
    return this.http.get(apiUrl + '/solicitud/centrosEntrega/'+id1+'/'+id2+'/'+id3);
  }
  direccionesEntrega(id1,id2,id3,id4){
    return this.http.get(apiUrl + '/solicitud/direccionesEntrega/'+id1+'/'+id2+'/'+id3+'/'+id4);
  }
  origenEntregaDirecta(id1,id2,id3){
    return this.http.get(apiUrl + '/solicitud/origenEntregaDirecta/'+id1+'/'+id2+'/'+id3);
  }
  direccionesEntregaDirecta(id1,id2,id3,id4){
    return this.http.get(apiUrl + '/solicitud/direccionesEntregaDirecta/'+id1+'/'+id2+'/'+id3+'/'+id4);
  }
  fraccionesEntregaDirecta(id1,id2,id3,id4){
    return this.http.get(apiUrl + '/solicitud/fraccionesEntregaDirecta/'+id1+'/'+id2+'/'+id3+'/'+id4);
  }
  nuevoOrigen(data){
    return this.http.post(apiUrl + '/solicitud/nuevoOrigen', data);
  }

  centroData(idCentro,tercero,direccion,tipooperativa)
  {
    return this.http.get(apiUrl + '/solicitud/infoTercero/'+idCentro+'/'+tercero+'/'+direccion+'/'+tipooperativa);
  }
  centroData2(id,id1,id2,op)
  {
    return this.http.get(apiUrl + '/solicitud/infoTercero2/'+id+'/'+id1+'/'+id2+'/'+op);
  }
  geoFracciones(id1,id2,id3,id4,op)
  {
    return this.http.get(apiUrl + '/solicitud/geoFracciones/'+id1+'/'+id2+'/'+id3+'/'+id4+'/'+op);
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
  getResponsabilities(tercero_origen, direccion_origen, tercero_destino, direccion_destino, operativa = "N") {
    return this.http.get(apiUrl + '/users/getResponsabilities/'+tercero_origen+'/'+direccion_origen+'/'+tercero_destino+'/'+direccion_destino+'/'+operativa);
  }
  getResponsabilities2(tercero_destino, direccion_destino) {
    return this.http.get(apiUrl + '/users/getResponsabilities2/'+tercero_destino+'/'+direccion_destino);
  }
  getFracciones(fracciones)
  {
    return this.http.post(apiUrl + '/users/getFracciones',fracciones);
  }
  // getRexResponsabilities(tercero_destino, direccion_destino) {
  //   return this.http.get(apiUrl + '/users/getRexResponsabilities/'+tercero_destino+'/'+direccion_destino);
  // }
  
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

       this.createLogger(type+': '+ "ERROR ENVIADO ARCHIVO VIA FTP");

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
        
        let path = this.file.externalRootDirectory+'logs';

        const toDataURL = url => fetch(url)
          .then(resp => resp.blob())
          .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          }))


        toDataURL(path.replace('file://','_app_file_')+'/log.txt')
          .then(dataUrl => {
            console.log('RESULT:', dataUrl)
            // alert(dataUrl);

            let base64file:any = dataUrl;

            base64file = base64file.replace('data:text/plain;base64,', '');

            if (base64file == "") {
              // alert("no file")
              return resolve(false);
            }

            this.http.post(apiUrl + '/file/FTPUploadFotos', {'ArchivoCodificado':base64file,'Nombre':name, 'Ruta': type}).subscribe(data=>{
              
              let path = this.file.externalRootDirectory+'logs';
              this.file.writeFile(path,'log.txt','',{append:false, replace: true});

              // alert("OK");

              return resolve("OK");

            },err=>{
              // alert("0"+JSON.stringify(err))
              this.createLogger('LOG: '+ "ERROR ENVIADO ARCHIVO VIA FTP");

              return resolve(false);
            });


          }).catch(err=>{
            console.log('error');
            // alert("1"+JSON.stringify(err))
            return resolve(false);
          })

        // alert(path);

        // this.file.checkFile(path.replace('file://','_app_file_'),'log.txt').then(response => {


          

        // },err=>{
        //   alert('archivo no encontrado '+JSON.stringify(err))
        //   return resolve(false);
        // });

      }else{

        // return new Promise((resolve)=>{
           this.http.post(
             apiUrl + '/file/FTPUploadFotos', {'ArchivoCodificado':'ZG9jdW1lbnRvIGRlIHBydWViYSBkZSBlbnZpbyBkZSBsb2dzIHBvciBmdHA=','Nombre':name, 'Ruta': type})

           .subscribe(data=>{
             return resolve(data);
           },err=>{
             return resolve(err);
           });

        // })

        // return resolve(true);
      }
      /**/
    })
  }

  /*groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x.values[key]] = rv[x.values[key]] || []).push(x);
      return rv;
    }, {});
  }*/

  groupBy( array, a )
  {
    let f =  (item)=>
    {
      return [item.canibalizado, item.residuo_especifico];
    }
    var groups = {};
    array.forEach( ( o )=>
    {
      var group = JSON.stringify( f(o.values) );
      groups[group] = groups[group] || [];
      groups[group].push( o );  
    });
    // console.log(groups);
    return Object.keys(groups).map( ( group )=>
    {
      return groups[group]; 
    })
  }

  appendInfo(data)
  {
    let path = this.file.externalRootDirectory+'logs';
    let date = " | "+moment().format('DD-MM-Y HH:mm:ss');

    this.file.checkFile(path.replace('file://','_app_file_'),'log.txt').then(response => {
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
          console.log('No se pudo crear '+JSON.stringify(err));
        }); 
      });
    }
  }

  hideKeyboard()
  {
    // console.log('hidding keyboard');
    setTimeout(()=>{
      $('.select2-search__field').blur();
    },1)
    setTimeout(()=>{
      if (this.keyboard.isVisible) {
        this.keyboard.hide();
      }
    },200)
  }

}
