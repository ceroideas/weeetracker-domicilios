import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { ModalGestoresPage } from '../../nueva-recogida/modal-gestores/modal-gestores.page';
import { ModalOrigenesPage } from '../../nueva-recogida/modal-origenes/modal-origenes.page';
import { EventsService } from '../../../services/events.service';
import { Usuario } from 'src/app/models/usuario';

import { Storage } from '@ionic/storage-angular';

declare var moment:any;

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two-rcp.page.html',
  styleUrls: ['./step-two-rcp.page.scss'],
})
export class StepTwoRcpPage implements OnInit {

  titulo = "NUEVA RECEPCIÓN 2 - Origen Residuo";
  myForm: FormGroup;
  today = moment().format('Y-MM-DD');

  date = localStorage.getItem('date');

  usuario: Usuario = new Usuario();

  solicitud = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;
  // gestor = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;
  gestor:any = null;
  direcciones = null;

  mostrarNuevo = false;

  available_provinces = [];
  tipooperativa = localStorage.getItem('tipo_operativa');

  listadoGestores:any;

  query = "";

  showList = true;

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
    private storage: Storage,
    private alertCtrl: AlertController,) {

    this.myForm = this.fb.group({
      pidSolicitud: [this.solicitud ? this.solicitud.sid : ''],
      nombre: [this.solicitud ? this.solicitud.tnombre : '', Validators.required],
      nif: [this.solicitud ? this.solicitud.tNIF : '', Validators.required],

      sidTercero: [''],
      sidDireccionTercero: [''],

      nombre_comercial: ['',Validators.required],

      selecciona_provincia: ['',Validators.required],

      centro: ['',Validators.required],
      localidad: ['',Validators.required],
      direccion: ['',Validators.required],
      provincia: ['',Validators.required],
      pais: ['',Validators.required],
      codNima: [''],
      insRP: [''],
      insRnP: [''],
    });

    this.cargarUsuario();

    if (localStorage.getItem('buscarDirecciones')) {
      localStorage.removeItem('buscarDirecciones')
      this.sendToSearch(this.solicitud.tercero);
    }

    this.storage.create().then(async (storage)=>{
      storage.remove('lecturas');
      storage.remove('firma_origen');
      storage.remove('firma_transportista');
    })
  }
  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);

    if (localStorage.getItem('tipo_operativa') == 'REF') {
      // this.mostrarNuevo = false;
      this.titulo = "NUEVA RECEPCIÓN 2 - Origen Residuo: Seleccion";

      this.consultaService.centrosGestores(this.usuario.tercero.PidTercero,this.usuario.dtercero,'REF').subscribe((data:any)=>{
        this.listadoGestores = data.centros;
      })

    }
  }

  ngOnInit() {

    this.consultaService.createLogger('Seleccionar Origen del Residuo');

    localStorage.removeItem('nuevoOrigen');

    this.events.destroy('nuevoOrigen');
    this.events.subscribe('nuevoOrigen',(data:any)=>{
      // this.solicitud = data.centro;
      // this.gestor = data.centro;
      this.direcciones = data.direcciones;
      let last = this.direcciones.length-1;

      this.available_provinces = [];

      for(let i of this.direcciones)
      {
        this.available_provinces.push(i.nombreProvincia);
      }

      this.available_provinces = this.available_provinces.filter(this.onlyUnique);

      this.myForm.patchValue({
        
        sidTercero: null,
        sidDireccionTercero: null,

        centro: null,// this.direcciones[last].nombre,
        localidad: null,// this.direcciones[last].nombreMunicipio,
        direccion: null,// this.direcciones[last].direccion,
        provincia: null,// this.direcciones[last].nombreProvincia,
        pais: null,// this.direcciones[last].nombrePais,
        codNima: null,// this.direcciones[last].codNima,
        insRP: null,// this.direcciones[last].insRp,
        insRnP: null,// this.direcciones[last].insRnP,
      })
    });

    this.events.destroy('sendToSearch');
    this.events.subscribe('sendToSearch',(id)=>{
      this.sendToSearch(id)
    });


    this.events.destroy('changeOrigin');
    this.events.subscribe('changeOrigin',(direccion)=>{

      this.loadingCtrl.create({message: "Obteniendo ubicación de centro"}).then(l=>{
          l.present();


        this.consultaService.ubicacionCentro(
          {pais:direccion.sidPais, provincia: direccion.sidProvincia, municipio:direccion.sidMunicipio}).subscribe((data1:any)=>{

          localStorage.removeItem('nuevoOrigen');

          this.consultaService.createLogger('Ubicacion de centro Success');
          this.myForm.patchValue({
            
            // sidTercero: direccion.pidTercero,
            sidDireccionTercero: direccion.pidDireccionTercero,

            centro: direccion.nombre,
            localidad: data1['ubicacion']['_municipio'].nombre,
            direccion: direccion.direccion,
            provincia: data1['ubicacion']['_provincia'].nombre,
            pais: data1['ubicacion']['_pais'].nombre,
            codNima: direccion.codNima,
            insRP: direccion.insRp,
            insRnP: direccion.insRnP,
          });

          l.dismiss();

        });
      });

    });
  }

  adelante()
  {
    if (!this.myForm.valid) {
      return this.alertCtrl.create({message:"Por favor, seleccione un origen válido.", buttons: ["Ok"]}).then(a=>a.present());
    }
    localStorage.setItem('origen',JSON.stringify(this.myForm.value));
    this.nav.navigateForward('/nueva-recepcion/step-three-rcp')
  }

  atras() {
    if (!this.showList) {
      
      this.showList = true;

      this.myForm.patchValue({
        nombre_comercial:null,
        // selecciona_provincia:"",
        centro:null,
        localidad:null,
        direccion:null,
        text_provincia:null,
        provincia:null,
        pais:null,
        codNima:null,
        insRP:null,
        insRnP:null,
      });

      return false;

    }
    this._location.back();
  }

  nuevoOrigen()
  {
    if (!this.gestor) {
      this.consultaService.createLogger('E | Sin gestor de origen seleccionado');
      return this.alertCtrl.create({message:"No ha seleccionado Gestor de origen", buttons: ['Ok']}).then(a=>{
        a.present();
      });
    }
    localStorage.setItem('gestor',JSON.stringify(this.gestor));
    this.nav.navigateForward('/nueva-recepcion/step-two-alt-rcp');
  }

  buscar()
  {
    if (!this.myForm.value.nombre && !this.myForm.value.nif) {
      this.consultaService.createLogger('E | Debe escribir nombre o nif para buscar');
      return this.alertCtrl.create({message:"Debe escribir parte del Nombre o del NIF para buscar", buttons: ['Ok']}).then(a=>{
        a.present();
      });
    }
    this.loadingCtrl.create({message:"Buscando centros..."}).then(l=>{
      l.present();
      this.consultaService.buscarCentro({
        nombre:this.myForm.value.nombre, nif: this.myForm.value.nif,
        tercero: this.usuario.tercero.PidTercero, tipooperativa: this.solicitud ? localStorage.getItem('tipo_operativa')+'_S' : localStorage.getItem('tipo_operativa')}).subscribe((data:any)=>{

        l.dismiss();

        if (data.centros.length) {
          if (data.centros.length > 1) {
            this.modal.create({
              component: ModalGestoresPage,
              componentProps: {centros: data.centros},
              cssClass: "selectGestor"
            }).then(m=>{
              m.present();
            })
          }else{

            this.sendToSearch(data.centros[0].pidTercero);


          }
        }else{
          this.myForm.patchValue({
            // nombre: "",
            // nif: "",
            sidTercero: "",
            sidDireccionTercero: "",

            nombre_comercial: "",
            centro: "",
            localidad: "",
            direccion: "",
            provincia: "",
            pais: "",
            codNima: "",
            insRP: "",
            insRnP: "",
          });

          return this.alertCtrl.create({message:"No hay resultados que coincidan con tu búsqueda", buttons: ['Ok']}).then(a=>{
            a.present();
          });
        }

      },err=>{
        l.dismiss();

        this.consultaService.createLogger('E | Error al buscar centro '+JSON.stringify(err));

        return this.alertCtrl.create({message:"Ha ocurrido un error, por favor intenta nuevamente", buttons: ['Ok']}).then(a=>{
          a.present();
        });
      })
    })
  }

  modifOrigen()
  {
    if (this.direcciones.filter(x=>x.nombreProvincia == this.myForm.value.selecciona_provincia).length == 0) {
      return false;
    }
    console.log(this.myForm.value.selecciona_provincia);
    if (!this.myForm.value.selecciona_provincia || this.myForm.value.selecciona_provincia == "") {
      return false;
    }
    this.modal.create({
      component: ModalOrigenesPage,
      componentProps: {origenes: this.direcciones.filter(x=>x.nombreProvincia == this.myForm.value.selecciona_provincia)},
      cssClass: "selectGestor"
    }).then(m=>{
      m.present();
    })
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  sendToSearch(id)
  {
    this.available_provinces = [];

    this.loadingCtrl.create({message: "Obteniendo información de centro..."}).then(l=>{
      l.present();

      this.consultaService.centroData(id).subscribe((data:any)=>{

        this.consultaService.createLogger('Informacion del Centro Success');

        l.dismiss();

        let centro = data.info.centro;
        this.gestor = data.info.centro;
        this.direcciones = data.info.direcciones;

        if (!this.direcciones.length) {
          this.consultaService.createLogger('E | No hay direcciones que mostrar en el origen ERROR');
          return this.alertCtrl.create({message:"No hay direcciones que mostrar, por favor, ingrese nuevo origen", buttons: ['Ok']}).then(a=>{
            a.present();
          });
        }

        console.log(this.direcciones);

        for(let i of this.direcciones)
        {
          this.available_provinces.push(i.nombreProvincia);
        }

        this.available_provinces = this.available_provinces.filter(this.onlyUnique).sort((a, b) => a.localeCompare(b));;

        this.loadingCtrl.create({message: "Obteniendo ubicación de centro"}).then(l=>{
          l.present();

          this.consultaService.ubicacionCentro(
            {pais:this.direcciones[0].sidPais, provincia: this.direcciones[0].sidProvincia, municipio:this.direcciones[0].sidMunicipio}).subscribe((data1:any)=>{

            this.consultaService.createLogger('Ubicacion Centro conseguida Success');

            if (this.solicitud) {

              this.myForm.patchValue({selecciona_provincia:this.solicitud.provincia});

              let direccion = this.direcciones.find(x=>x.pidDireccionTercero == this.solicitud.ssidDireccionTerceroOrigen);

              this.myForm.patchValue({
                nombre: centro.nombre,
                nif: centro.nif,

                sidTercero: centro.pidTercero,
                sidDireccionTercero: direccion.pidDireccionTercero,

                nombre_comercial: centro.nombreComercial,
                centro: direccion.nombre,
                localidad: data1['ubicacion']['_municipio'].nombre,
                direccion: direccion.direccion,
                provincia: data1['ubicacion']['_provincia'].nombre,
                pais: data1['ubicacion']['_pais'].nombre,
                codNima: direccion.codNima,
                insRP: direccion.insRp,
                insRnP: direccion.insRnP,
              });
            }else{

              if (this.direcciones.length > 1) {
                this.myForm.patchValue({
                  nombre: centro.nombre,
                  nif: centro.nif,

                  sidTercero: centro.pidTercero,
                  sidDireccionTercero: this.direcciones[0].pidDireccionTercero,

                  nombre_comercial: centro.nombreComercial,
                  centro: null, // this.direcciones[0].nombre,
                  localidad: null, // data1['ubicacion']['_municipio'].nombre,
                  direccion: null, // this.direcciones[0].direccion,
                  provincia: null, // data1['ubicacion']['_provincia'].nombre,
                  pais: null, // data1['ubicacion']['_pais'].nombre,
                  codNima: null, // this.direcciones[0].codNima,
                  insRP: null, // this.direcciones[0].insRp,
                  insRnP: null, // this.direcciones[0].insRnP,
                  selecciona_provincia: ""
                });
              }else{
                this.myForm.patchValue({
                  nombre: centro.nombre,
                  nif: centro.nif,

                  sidTercero: centro.pidTercero,
                  sidDireccionTercero: this.direcciones[0].pidDireccionTercero,

                  nombre_comercial: centro.nombreComercial,
                  centro: null, // this.direcciones[0].nombre,
                  localidad: null, // data1['ubicacion']['_municipio'].nombre,
                  direccion: null, // this.direcciones[0].direccion,
                  provincia: null, // data1['ubicacion']['_provincia'].nombre,
                  pais: null, // data1['ubicacion']['_pais'].nombre,
                  codNima: null, // this.direcciones[0].codNima,
                  insRP: null, // this.direcciones[0].insRp,
                  insRnP: null, // this.direcciones[0].insRnP,
                  selecciona_provincia: this.available_provinces[0]
                });

                this.events.publish('changeOrigin',this.direcciones[0]);
              }
              /*this.myForm.patchValue({
                nombre: centro.nombre,
                nif: centro.nif,

                sidTercero: centro.pidTercero,
                sidDireccionTercero: this.direcciones[0].pidDireccionTercero,

                nombre_comercial: centro.nombreComercial,
                centro: null, // this.direcciones[0].nombre,
                localidad: null, // data1['ubicacion']['_municipio'].nombre,
                direccion: null, // this.direcciones[0].direccion,
                provincia: null, // data1['ubicacion']['_provincia'].nombre,
                pais: null, // data1['ubicacion']['_pais'].nombre,
                codNima: null, // this.direcciones[0].codNima,
                insRP: null, // this.direcciones[0].insRp,
                insRnP: null, // this.direcciones[0].insRnP,
              });*/
            }

            l.dismiss();

          });

        })
        /*this.myForm.patchValue({
          nombre: centro.nombre,
          nif: centro.nif,
          nombre_comercial: centro.nombreComercial,
          centro: this.direcciones[0].nombre,
          localidad: this.direcciones[0].nombreMunicipio,
          direccion: this.direcciones[0].direccion,
          provincia: this.direcciones[0].nombreProvincia,
          pais: this.direcciones[0].nombrePais,
        })*/
      },err=>{
        l.dismiss();
      })

    })
  }

  selected = null;

  seleccionar(l)
  {
    this.selected = l.pidTercero;
  }

  aceptar()
  {
    let gestor = this.listadoGestores.find(x=>x.pidTercero == this.selected);

    this.myForm.patchValue({
      nombre: gestor.Nombre,
      nif: gestor.Nif,
      selecciona_provincia:""
    });

    console.log(gestor);

    this.direcciones = null;

    this.showList = false;

    this.sendToSearch2(this.selected);
  }

  sendToSearch2(id)
  {
    this.available_provinces = [];

    this.loadingCtrl.create({message: "Obteniendo información de centro..."}).then(l=>{
      l.present();

      this.consultaService.centroData2(id,this.usuario.tercero.PidTercero,this.usuario.dtercero,'REF').subscribe((data:any)=>{

        this.consultaService.createLogger('Informacion del Centro Success');

        l.dismiss();

        let centro = data.info.centro;
        this.gestor = data.info.centro;
        this.direcciones = data.info.direcciones;

        if (!this.direcciones.length) {
          this.consultaService.createLogger('E | No hay direcciones que mostrar en el origen ERROR');
          return this.alertCtrl.create({message:"No hay direcciones que mostrar, por favor, ingrese nuevo origen", buttons: ['Ok']}).then(a=>{
            a.present();
          });
        }

        console.log(this.direcciones);

        for(let i of this.direcciones)
        {
          this.available_provinces.push(i.nombreProvincia);
        }

        console.log(this.available_provinces);

        this.available_provinces = this.available_provinces.filter(this.onlyUnique).sort((a, b) => a.localeCompare(b));

        if (this.direcciones.length > 1) {
          this.myForm.patchValue({
            nombre: centro.nombre,
            nif: centro.nif,

            sidTercero: centro.pidTercero,
            sidDireccionTercero: this.direcciones[0].pidDireccionTercero,

            nombre_comercial: centro.nombreComercial,
            centro: null, // this.direcciones[0].nombre,
            localidad: null, // data1['ubicacion']['_municipio'].nombre,
            direccion: null, // this.direcciones[0].direccion,
            provincia: null, // data1['ubicacion']['_provincia'].nombre,
            pais: null, // data1['ubicacion']['_pais'].nombre,
            codNima: null, // this.direcciones[0].codNima,
            insRP: null, // this.direcciones[0].insRp,
            insRnP: null, // this.direcciones[0].insRnP,
            selecciona_provincia: ""
          });
        }else{
          this.myForm.patchValue({
            nombre: centro.nombre,
            nif: centro.nif,

            sidTercero: centro.pidTercero,
            sidDireccionTercero: this.direcciones[0].pidDireccionTercero,

            nombre_comercial: centro.nombreComercial,
            centro: null, // this.direcciones[0].nombre,
            localidad: null, // data1['ubicacion']['_municipio'].nombre,
            direccion: null, // this.direcciones[0].direccion,
            provincia: null, // data1['ubicacion']['_provincia'].nombre,
            pais: null, // data1['ubicacion']['_pais'].nombre,
            codNima: null, // this.direcciones[0].codNima,
            insRP: null, // this.direcciones[0].insRp,
            insRnP: null, // this.direcciones[0].insRnP,
            selecciona_provincia: this.available_provinces[0]
          });

          this.events.publish('changeOrigin',this.direcciones[0]);
        }

      },err=>{
        l.dismiss();
      })

    })
  }

}
