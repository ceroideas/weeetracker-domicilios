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
  provincias:any;
  municipios:any;

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private events: EventsService,
    private modal: ModalController,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,) {

    this.myForm = this.fb.group({
      // pidSolicitud: [this.gestor ? this.gestor.sid : '', Validators.required],
      pidTercero: [this.gestor ? this.gestor.pidTercero : '', Validators.required],
      nombre: [this.gestor ? this.gestor.nombre : '', Validators.required],
      nif: [this.gestor ? this.gestor.nif : '', Validators.required],

      // codigo_postal: ['',Validators.required],
      // nombre_comercial: [this.gestor ? this.gestor.nombre_comercial : '',Validators.required],
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

    this.consultaService.nuevoOrigen(info).subscribe((data:any)=>{
      console.log(data);
      localStorage.setItem('nuevoOrigen',JSON.stringify(info));
      this.events.publish('nuevoOrigen',{centro:data.info.centro, direcciones: data.info.direcciones});
      this._location.back();
    })
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

  getProvincias(id)
  {
    console.log(id);

    this.consultaService.getProvincias(id).subscribe((data:any)=>{
      this.provincias = data.provincias;
    })
  }

  getMunicipios(id)
  {
    this.consultaService.getMunicipios(id).subscribe((data:any)=>{
      this.municipios = data.municipios;
    })
  }

}
