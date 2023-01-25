import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { ModalGestoresPage } from '../modal-gestores/modal-gestores.page';
import { ModalOrigenesPage } from '../modal-origenes/modal-origenes.page';
import { EventsService } from '../../../services/events.service';

declare var moment:any;

@Component({
  selector: 'app-step-two-alt',
  templateUrl: './step-two-alt.page.html',
  styleUrls: ['./step-two-alt.page.scss'],
})
export class StepTwoAltPage implements OnInit {

  titulo = "NUEVA RECOGIDA 2 - Origen Residuo Nuevo";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  date = localStorage.getItem('date');

  gestor = JSON.parse(localStorage.getItem('gestor'));

  paises:any;
  provincias:any = [];
  municipios:any = [];


  filterprovincias = [];
  showprovincias = false;

  filtermunicipios = [];
  showmunicipios = false;

  solicitud = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;

  constructor(private usuarioService: UsuarioService,
    public consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private events: EventsService,
    private modal: ModalController,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,) {

    let to = localStorage.getItem('tipo_operativa');

    if (to == 'SSR' || to == 'CSR') {
      this.titulo = "NUEVA RECOGIDA 2 - Origen Residuo Nuevo";
    }

    if (to == 'RCR' || to == 'RSR') {
      this.titulo = "NUEVA REUTILIZACIÓN RECOGIDA 2 - Origen Residuo Nuevo";
    }

    if (to == 'RED' || to == 'REF') {
      this.titulo = "NUEVA RECEPCIÓN 2 - Origen Residuo Nuevo";
    }

    if (to == 'RUD' || to == 'REU') {
      this.titulo = "NUEVA REUTILIZACIÓN 2 - Origen Residuo Nuevo";
    }

    this.myForm = this.fb.group({

      pidSolicitud: [this.solicitud ? this.solicitud.sid : ''],
      nombre: [this.gestor ? this.gestor.nombre : '', Validators.required],
      nif: [this.gestor ? this.gestor.nif : '', Validators.required],

      codigoIsla: [''],
      idProvincia: [''],

      sidDireccionTercero: [null],
      sidTercero: [this.gestor ? this.gestor.pidTercero : '', Validators.required],

      centro: ['',Validators.required],
      contacto: ['',Validators.required],
      tlfn_contacto: ['',Validators.required],
      direccion: ['',Validators.required],
      pais: ['',Validators.required],
      provincia: ['',Validators.required],
      localidad: ['',Validators.required],
      codNima: [''],
      insRp: [''],
      insRnP: [''],
    });

    this.getPaises();
  }

  ngOnInit() {

  }

  adelante()
  {
    if (!this.myForm.valid) {
      return this.alertCtrl.create({message:"Por favor, complete todos los datos.", buttons: ["Ok"]}).then(a=>a.present());
    }
    let val = this.myForm.value;
    let info = {
      Direccion: val.direccion,
      Nombre: val.centro,
      SidPais: val.pais,
      SidProvincia: val.provincia,
      SidMunicipio: val.localidad,
      SidTercero: this.gestor.pidTercero,
      // CodigoPostal: val.codigo_postal.toString(),
      Contacto: val.contacto,
      Nif: val.nif,
      Tlfn: val.tlfn_contacto,
      Estado: 1,
      TipoVia: "Calle",
      Pesado: 0,
      Inventario: 1,
      UsoRefTercero: 0,
      TipoDireccion: "Punto de Recogida",
      codNima: val.codNima,
      insRp: val.insRp,
      insRnP: val.insRnP,
    }

    localStorage.setItem('nuevoOrigen',JSON.stringify(info));
    localStorage.setItem('origen',JSON.stringify(this.myForm.value));
    // this.events.publish('nuevoOrigen'/*,{centro:data.info.centro, direcciones: data.info.direcciones}*/);
    let to = localStorage.getItem('tipo_operativa');
    if (to == 'SSR' || to == 'CSR') {
      this.nav.navigateForward('/nueva-recogida/step-three');
    }

    if (to == 'RCR' || to == 'RSR') {
      this.nav.navigateForward('/reutilizaciones/nueva-recogida-reutilizacion/step-three-rre');
    }

    if (to == 'RED' || to == 'REF') {
      this.nav.navigateForward('/nueva-recepcion/step-three-rcp');
    }

    if (to == 'RUD' || to == 'REU') {
      this.nav.navigateForward('/reutilizaciones/nueva-reutilizacion/step-three-reu');
    }
    /*this.consultaService.nuevoOrigen(info).subscribe((data:any)=>{
      console.log(data);
      // this._location.back();
    })*/
  }

  atras() {
    this._location.back();
  }

  getPaises()
  {
    this.consultaService.getPaises().subscribe((data:any)=>{
      this.paises = data.paises;

      this.myForm.patchValue({
        pais: 2473
      })
      this.getProvincias(2473);
    })
  }

  available_provincias = [];
  available_municipios = [];

  getProvincias(id)
  {
    console.log(id);

    this.consultaService.getProvincias(id).subscribe((data:any)=>{
      this.provincias = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));

      for (let i of this.provincias) {
        this.available_provincias.push({id:i.pidProvincia, text:i.nombre});
      }

      console.log(this.available_provincias);
    })
  }

  getMunicipios(id)
  {
    this.available_municipios = [];

    setTimeout(()=>{
      this.consultaService.getMunicipios(id).subscribe((data:any)=>{
        this.municipios = data.municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));

        for (let i of this.municipios) {
          this.available_municipios.push({id:i.pidMunicipio, text:i.nombre});
        }
      });
    },100)
  }
}
