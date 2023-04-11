import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LectorService } from 'src/app/services/lector.service';
import { ModalController, AlertController, Platform, LoadingController } from '@ionic/angular';
// import { FirmaPage } from '../firma/firma.page';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { VisorImgPage } from '../visor-img/visor-img.page';
import { IdentificacionService } from '../../services/identificacion.service';
import { Identificacion, Tipo, ListaArchivos } from 'src/app/models/identificacion';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core'
import { GeolocalizacionService } from '../../services/geolocalizacion.service';
import { Coordenada } from '../../models/identificacion';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasService } from 'src/app/services/consultas.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-identificacion-residuos',
  templateUrl: './identificacion-residuos.page.html',
  styleUrls: ['./identificacion-residuos.page.scss'],
})
export class IdentificacionResiduosPage implements OnInit {

  primeraPagina = true;
  segundaPagina = false;
  tipo: number;
  // firma: string;
  base64Image: string;
  imagenes: string[] = [];
  usuario: Usuario = new Usuario();
  visorQr: boolean = false;
  pagina: string;
  myForm: FormGroup;
  existeEtiqueta: boolean = true;
  loading: any;
  alerta: any;
  primeraPagianValida = false;
  formularioOk = false;

  constructor(private _location: Location,
    private lectorService: LectorService,
    private modalCtrl: ModalController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    private geolocalizacionService: GeolocalizacionService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private consultasService: ConsultasService) {

    this.myForm = this.fb.group({
      albaran: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      centro: ['', Validators.required],
      nombre: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      etiqueta: ['', Validators.compose([
        Validators.required,
        Validators.minLength(17),
        Validators.pattern('18410708[0-9]{9}')
      ])],
      dni: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{7,8}[A-Z]')
      ])],
      residuo: ['', Validators.required],
      marca: ['', Validators.required],
      numSerie: ['', Validators.maxLength(50)],
      funciona: [false],
      canibalizado: [false]
    });

    // Controla el boton atras por hadware  
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (!this.visorQr) {
        this.atras();
        this.changeRef.detectChanges();
      } else {
        console.log("no cierra la pantalla");
        this.visorQr = false;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let pagina = this.router.getCurrentNavigation().extras.state.nombrePagina;
        if (pagina == "Identificar residuos en domicilio") {
          this.tipo = Tipo.domicilio;
        } else if (pagina == "Identificar residuos en establecimientos") {
          this.tipo = Tipo.establecimiento;
        }
      }
    });

  }

  ngOnInit() {
    this.cargarDatos();
    this.myForm.valueChanges.subscribe(form => {
      console.log('hola')
      if (this.myForm.get("albaran").status == "VALID" && this.myForm.get("dni").status == "VALID" && (this.myForm.get("centro").status == "VALID" || this.myForm.get("centro").status == "DISABLED") && this.myForm.get("nombre").status == "VALID") 
      {
        this.formularioOk = true;
        // if(this.firma.length > 0){
          this.primeraPagianValida = true;
        // }
      } else {
        this.primeraPagianValida = false;
        this.formularioOk = false;
      }
    });
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
    if (this.usuario.centros.length == 1) {
      this.myForm.get('centro').disable();
      this.myForm.get('centro').setValue(this.usuario.centros[0].PidDireccionTercero);
    }
    this.myForm.get('marca').setValue(1);
  }

  readStatus = null

  lector(valor) {
    this.visorQr = true;
    this.lectorService.scan(valor).then(res => {
      if (valor == 'etiqueta') {
        if (typeof res === undefined) {
          this.readStatus = 1;
        }else{
          this.readStatus = 2;
        }
      }
      this.asignarEtiqueta(valor, res);
    });
  }

  limpiar(valor: string) {
    this.asignarEtiqueta(valor, "");
  }

  // Asigna la etiqueta a su campo correspondiente si es de tipo etiqueta comprueba que exista o no
  async asignarEtiqueta(valor: string, etiqueta: string) {
    if (etiqueta === "error") {
      this.usuarioService.mostrarAlerta(this.translate.instant("IDENTIFICACION.FORMATONOOK"));
    } else {
      if (valor == "etiqueta") {
        this.consultasService.getIdentificacion(etiqueta).subscribe(res => {
          this.existeEtiqueta = true;
          this.usuarioService.mostrarAlerta(this.translate.instant("IDENTIFICACION.EXISTEETIQUETA"));
        }, error => {
          this.myForm.get(valor).setValue(etiqueta);
          this.existeEtiqueta = false;
        });
      } else {
        this.myForm.get(valor).setValue(etiqueta);
      }

    }
  }

  // Comprueba que la etiqueta comprueba que exista o no al introducir el codigo por teclado
  async comprobar() {
    if (this.myForm.get('etiqueta').valid) {
      // this.loading = await this.loadingCtrl.create({
      //   message: "Buscando..."
      // });
      // await this.loading.present();
     await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.BUSCANDO"));
      let etiqueta = this.myForm.get('etiqueta').value;
      this.consultasService.getIdentificacion(etiqueta).subscribe(res => {
        this.existeEtiqueta = true;
        this.usuarioService.mostrarAlerta(this.translate.instant("IDENTIFICACION.EXISTEETIQUETA"));
       // this.loading.dismiss();
       this.usuarioService.cerrarSpinner();
      }, error => {
      //  this.loading.dismiss();
      this.usuarioService.cerrarSpinner();
        this.existeEtiqueta = false;
      });
    } else {
      this.existeEtiqueta = true;
    }
  }

  // async abrirFirma() {
  //   const modal = await this.modalCtrl.create({
  //     component: FirmaPage,
  //     cssClass: 'modalFirma',
  //   });
  //   await modal.present();
  //   modal.onDidDismiss().then((data) => {
  //     this.firma = data.data.img as string;
  //     if(this.firma.length > 0 && this.formularioOk){
  //       this.primeraPagianValida = true;
  //     }
  //   })
  // }

  obtenerFoto() {
    let option = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 500,
      quality: 100,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      direction: 0
    };

    this.camera.getPicture(option).then(imageData => {
      //this.urlImage = imageData;
      this.base64Image = "data:image/jpeg;base64," + imageData;
      if (this.imagenes.length < 3) {
        this.imagenes.push(this.base64Image);
      }
    });
  }

  async verImagen(imagen: string) {
    const modal = await this.modalCtrl.create({
      component: VisorImgPage,
      cssClass: 'modalImg',
      componentProps: { value: imagen }
    });

    await modal.present();
  }

  eliminarImg(index: number) {
    this.imagenes.splice(index, 1);
  }

  async guardar() {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.GUARDANDO"));
    let identificacion: Identificacion = new Identificacion();
    identificacion.Canibalizado = this.myForm.get('canibalizado').value;
    identificacion.Albaran = this.myForm.get('albaran').value;
    identificacion.IdCentro = this.myForm.get('centro').value;
    identificacion.Nombre = this.myForm.get('nombre').value;
    identificacion.Etiqueta = this.myForm.get('etiqueta').value;
    identificacion.DNI = this.myForm.get('dni').value;
    identificacion.IdResiduo = this.myForm.get('residuo').value;
    identificacion.IdMarca = this.myForm.get('marca').value;
    identificacion.Funciona = this.myForm.get('funciona').value;
    identificacion.IdTercero = this.usuario.tercero.PidTercero;
    identificacion.Tipo = this.tipo;
    if (this.myForm.get('numSerie').value) {
      identificacion.NumSerie = this.myForm.get('numSerie').value;
    }
    identificacion.Fecha = this.consultasService.fechaActual();
    //identificacion.Firma = identificacion.Nombre + ".jpg";
    await this.geolocalizacionService.getGeolocation().then(res => {
      let coordenada: Coordenada = new Coordenada();
      coordenada.Latitud = this.geolocalizacionService.coordenada.Latitud;
      coordenada.Longitud = this.geolocalizacionService.coordenada.Longitud;
      identificacion.Coordenadas = coordenada;
    });

    this.imagenes.forEach(element => {
      let archivo : ListaArchivos = new ListaArchivos();
      archivo.Tipo = "PIC";
      archivo.ArchivoCodificado = this.cortarBase64(element);
      identificacion.ListaArchivos.push(archivo);
    });

    // let archivo : ListaArchivos = new ListaArchivos();
    // archivo.Tipo = "SIG";
    // archivo.ArchivoCodificado =  this.cortarBase64(this.firma);
    // identificacion.ListaArchivos.push(archivo);

    console.log(identificacion);

    // TODO : FALTA
    if (this.tipo == Tipo.domicilio) {
      // Comprobamos que no este repetido y lo guardamos en el localStorage
      // this.indentificacionService.guardarIdentificacion(identificacion);
    } else if (this.tipo == Tipo.establecimiento) {
      // this.guardarResiduo(identificacion);
    }
    this.guardarResiduo(identificacion);
  }


  cortarBase64(url : string){
    let imagen = url.split(',');
    return imagen[1];
  }

  async guardarResiduo(residuo: Identificacion) {
    let texto = "";
    let error = false;
    this.consultasService.altaIdentificacion(residuo).subscribe((res: any) => {
      texto = "Etiqueta " + res.residuo + " registrada correctamente </br></br> ¿Desea agregar otra etiqueta al mismo albarán?";
     this.usuarioService.cerrarSpinner();
      // this.loading.dismiss();
      this.mostrarModal(texto, error);
    }, error => {
      texto = error.error.error + " </br></br> ¿Desea agregar otra etiqueta al mismo albarán?";
      error = true;
      this.usuarioService.cerrarSpinner();
      // this.loading.dismiss();
      this.mostrarModal(texto, error);
    });
  }

  async mostrarModal(texto: string, error: boolean) {
    const alerta = await this.alertCtrl.create({
      header: this.translate.instant("ALERTA.CABECERA"),
      message: texto,
      buttons: [
        {
          text: "Si",
          handler: () => {
            if (!error) {
              this.limpiarIdentificacion();
              this.lector('etiqueta');
            }
          }
        },
        {
          text: "No",
          handler: () => {
            this.salir();
          }
        }
      ],
      backdropDismiss: true
    });
    await alerta.present();
  }

  salir() {
    this._location.back();
  }

  limpiarIdentificacion() {
    this.myForm.get('etiqueta').setValue("");
    this.myForm.get('residuo').setValue("");
    this.myForm.get('marca').setValue(1);
    this.myForm.get('numSerie').setValue("");
    this.myForm.get('funciona').setValue(false);
    this.myForm.get('canibalizado').setValue(false);
    this.imagenes = [];
  }

  atras() {
    if (this.primeraPagina) {
      this._location.back();
    } else {
      this.primeraPagina = !this.primeraPagina;
      this.segundaPagina = !this.segundaPagina;
      this.changeRef.detectChanges();
    }
  }

  siguiente() {
    this.primeraPagina = !this.primeraPagina;
    this.segundaPagina = !this.segundaPagina;
    this.changeRef.detectChanges();
  }

}
