import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Usuario } from 'src/app/models/usuario';
import { ParamsService } from '../../../services/params.service';

import { Storage } from '@ionic/storage-angular';

const last2 = new Date().getFullYear().toString().slice(-2);
const month = ("0" + (new Date().getMonth() + 1)).slice(-2);

declare var moment:any;

@Component({
  selector: 'app-step-six',
  templateUrl: './step-six.page.html',
  styleUrls: ['./step-six.page.scss'],
})
export class StepSixPage implements OnInit {

  titulo = "NUEVA RECOGIDA 6 - Recogida Completada";
  myForm: FormGroup;

  usuario: Usuario = new Usuario();

  lecturas:any;
  origen = JSON.parse(localStorage.getItem('origen'));
  contenedores:any;
  especificos:any;
  initial;
  initial2;

  agrupadas = [];
  keys = [];

  private _storage: Storage | null = null;

  namesPhoto = [];
  namesSign = [];

  pidFirma;
  pidFoto;

  photos = [];

  contadores = {firmas:null,fotos:null};

  constructor(private usuarioService: UsuarioService,
    private consultas: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private params: ParamsService,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage) {


    this.myForm = this.fb.group({
      certificado: ['...', Validators.required],
      certificadoraee: ['...', Validators.required],
      albaran_origen: [null, Validators.required],
      codigo_externo: [null, Validators.required],
      fecha_operacion: [moment(localStorage.getItem('date')).format('DD-MM-Y'), Validators.required],
      gestor_recogida: ['', Validators.required],
      total: [null],
    });
    this.cargarUsuario();

    let p = this.params.getParam();

    this.contenedores = p.contenedores;
    this.especificos = p.especificos;
  }

  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    this.myForm.patchValue({gestor_recogida: this.usuario.tercero.Nombre});
    console.log(this.usuario);

    this.initial = 'R'+last2+String(this.usuario.terminal).padStart(4, '0');
    this.initial2 = last2+month+String(this.usuario.terminal).padStart(4, '0');

    this.consultas.recuperarCertificado(this.initial).subscribe((data:any)=>{

      if (!data.certificado) {
        this.initial += '00001';
      }else{
        this.initial += this.padLeft(parseInt(data.certificado.pidCertificado.slice(-5))+1,5);
      }

      this.myForm.patchValue({
        certificado: this.initial
      });

      this.storage.create().then(async (storage)=>{

        this._storage = storage;

        // this.lecturas = JSON.parse(localStorage.getItem('lecturas'));
        this.lecturas = await this._storage.get('lecturas');

        this.agrupadas = this.consultas.groupBy(this.lecturas,'residuo_especifico');
        this.keys = Object.keys(this.agrupadas);

        this.myForm.patchValue({total:(Object.values(this.agrupadas) as any).flat().length});
      });

    });

    this.consultas.recuperarCertificadoRAEE(this.initial2).subscribe((data:any)=>{

      if (!data.certificado) {
        this.initial2 += '00001';
      }else{
        this.initial2 += this.padLeft((parseInt(data.certificado.pidRaeecertificado.slice(-5))+1).toString(),5);
      }

      this.myForm.patchValue({
        certificadoraee: this.initial2
      });

      console.log(this.initial2);

    });


    /**/

    this.pidFirma = last2+month+String(this.usuario.terminal).padStart(4, '0');
    this.pidFoto = last2+month+String(this.usuario.terminal).padStart(4, '0');

    this.consultas.recuperarCertificadoFotos(this.pidFirma).subscribe((data:any)=>{
      let data1 = data.certificado;

      this.contadores.firmas = data1.certificado1;
      this.contadores.fotos = data1.certificado2;
    });
  }

  async ngOnInit() {
    this.consultas.createLogger('Recogida Completada Success');
  }

  padLeft(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  async adelante()
  {
    let l = await this.loadingCtrl.create();
    l.present();

    const lecturas = await this._storage.get('lecturas');
    
    let contadorraee = 0;
    for(let i of lecturas)
    {
      if (i.photos) {
        let contador = 1;
        for(let j of i.photos)
        {
          let name = "F"+i.values.etiqueta+this.myForm.value.certificado+String(contador).padStart(4, '0')+'.jpg';
          let result = await this.consultas.uploadFTP(j.path,name,'FTPUploadFotos');

          let pidraeecert = (parseInt( this.myForm.value.certificadoraee )+contadorraee).toString();

          this.contadores.fotos++;
          let id = this.pidFoto+String(this.contadores.fotos).padStart(4, '0');
          this.photos.push({name:name,id:id,pidraee:pidraeecert})

          contador++;
        }
      }
      contadorraee++;
    }

    let firma_1 = await this._storage.get('firma_origen');
    let firma_2 = await this._storage.get('firma_transportista');

    this.contadores.firmas++;
    
    firma_1.archivo = 'Fr'+this.myForm.value.certificado+'_11.png';
    firma_1.id = this.pidFirma+String(this.contadores.firmas).padStart(4, '0');
    await this.consultas.uploadFTP(firma_1.firma,firma_1.archivo,'FTPUploadFirmas');

    this.contadores.firmas++;

    firma_2.archivo = 'Fr'+this.myForm.value.certificado+'_12.png';
    firma_2.id = this.pidFirma+String(this.contadores.firmas).padStart(4, '0');
    await this.consultas.uploadFTP(firma_2.firma,firma_2.archivo,'FTPUploadFirmas');

    let origen = JSON.parse(localStorage.getItem('origen'));
    let fecha = localStorage.getItem('date');
    let tipo_operativa = localStorage.getItem('tipo_operativa');

    
    /*console.log(origen);
    console.log(fecha);
    console.log(tipo_operativa);
    console.log(firma_1);
    console.log(firma_2);
    console.log(this.photos);
    console.log(lecturas);*/

    let firmas:any = [];
    let certificado:any = [];
    let raees:any = [];
    let raeescertificados:any = [];
    let fotos:any = [];

    
    //FirmasCertificado
    firmas.push({
      PidFirmaCertificado: firma_1.id,
      Firma: firma_1.archivo,
      Nombre: firma_1.nombre,
    });

    firmas.push({
      PidFirmaCertificado: firma_2.id,
      Firma: firma_2.archivo,
      Nombre: firma_2.nombre,
    });
    


    
    //Certificado
    certificado = {
      PidCertificado: this.myForm.value.certificado,
      SidTipoCertificado: 1,
      SidSig: this.usuario.sidsig,
      Fecha: fecha,
      SidSolicitud: origen.pidSolicitud != "" ? origen.pidSolicitud : null,
      SidTerceroSolicitante: origen.sidTercero,
      SidDireccionTerceroSolicitante: origen.sidDireccionTercero,
      SidTerceroDestinatario: this.usuario.tercero.PidTercero,
      SidDireccionTerceroDestinatario: this.usuario.dtercero,
      SidEstadoCertificado: 0,
      SidFirmaProcedencia: firma_1.id,
      SidFirmaTransporte: firma_2.id,
      SidFirmaDestino: null,
      Observaciones: null,
      SidTipoOperativa: tipo_operativa,
    };

    
    for(let l of lecturas)
    {
      let contador = 0;

      raees.push({
          PidRaee: l.values.etiqueta,
          SidSig: this.usuario.sidsig,
          SidTipoEtiqueta: 0,
          SidFraccion: l.values.fraccion,
          SidResiduo: l.values.residuo,
          SidResiduoEspecifico: l.values.residuo_especifico,
          SidMarca: l.values.marca,
          SidTipoContenedor: l.values.tipo_contenedor,
          Canibalizado: l.values.canibalizado,
          SidEstadoRaee: l.values.estado_raee,
          Estado: 1,
        })

      raeescertificados.push({
        PidRaeecertificado: (parseInt(this.myForm.value.certificadoraee)+contador).toString(),
        SidRaee: l.values.etiqueta,
        SidCertificado: this.myForm.value.certificado,
        GpsX: 0,
        GpsY: 0,
        SidTipoDeLectora: 3,
      })

        contador++;
    }

    
    for (let p of this.photos) {
      fotos.push({
        PidFotoRaeecertificado: p.id,
        NombreFichero: p.name,
        SidRaeecertificado: p.pidraee,
      })
    }

    console.log(firmas);
    console.log(certificado);
    console.log(raees);
    console.log(raeescertificados);
    console.log(fotos);
    l.dismiss();

    this.consultas.createLogger('Guardando los datos Success');

    this.loadingCtrl.create({message:"Guardando la información de Recogida"}).then(l=>{
      l.present();

      this.consultas.informacion({firmas:firmas, certificado:certificado, raees:raees, raeescertificados:raeescertificados, fotos:fotos}).subscribe(data=>{
        console.log(data);

        this.consultas.createLogger('Datos guardados, regresando al Inicio Success');

        this.nav.navigateRoot('/home');

        this.alertCtrl.create({message:"Información de Recogida guardada exitosamente!", buttons: ['OK']}).then(a=>a.present());

        l.dismiss();
      })
    })
  }

  atras()
  {
    this.alertCtrl.create({message:"¿Está seguro de volver atrás? La información de la vista actual se perderá", buttons: [
    {
      text:"Si, regresar",
      handler:()=>{
        this._location.back();
      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present())
  }

  summary()
  {
    this.consultas.createLogger('Ver resumen Success');
    localStorage.setItem('noFwd','1');
    this.nav.navigateForward('/nueva-recogida/step-three/summary');
  }

}
