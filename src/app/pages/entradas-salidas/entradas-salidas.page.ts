import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { Location } from '@angular/common';
import { AlertController, ModalController, Platform, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { VisorImgPage } from '../visor-img/visor-img.page';
import { LectorService } from 'src/app/services/lector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentificacionService } from '../../services/identificacion.service';
import { Identificacion, Coordenada, ListaArchivos } from 'src/app/models/identificacion';
import { Tipo } from '../../models/identificacion';
import { GeolocalizacionService } from '../../services/geolocalizacion.service';
import { ConsultasService } from '../../services/consultas.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-entradas-salidas',
  templateUrl: './entradas-salidas.page.html',
  styleUrls: ['./entradas-salidas.page.scss'],
})

export class EntradasSalidasPage implements OnInit {

  etiquetaValida: boolean = false;
  existeEtiqueta: boolean = true;
  base64Image: string;
  imagenes: string[] = [];
  usuario: Usuario = new Usuario();
  myForm: FormGroup;
  visorQr: boolean = false;
  pagina: string;
  titulo: string
  verCanibalizado: boolean = true;
  estadoSalida = false;
  tipo: number;
  loading: any;
  texto: string;
  identificacion: Identificacion = new Identificacion();
  escribirEtiqueta : boolean = false;
  esValida : boolean;

  constructor(private usuarioService: UsuarioService,
    private _location: Location,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private camera: Camera,
    private modalCtrl: ModalController,
    private lectorService: LectorService,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private geolocalizacionService: GeolocalizacionService,
    private consultasService: ConsultasService,
    private route: ActivatedRoute,
    private router: Router) {
    this.myForm = this.fb.group({
      albaran: ['', Validators.compose([
       
        Validators.maxLength(100)
      ])],
      etiqueta: ['', Validators.compose([
        Validators.required,
        Validators.pattern('18410708[0-9]{9}')
      ])],
      centro: ['', Validators.required],
      residuo: ['', Validators.required],
      marca: ['', Validators.required],
      numSerie: ['', Validators.maxLength(50)],
      canibalizado: [false],
      destino: ['Reciclaje']
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
        if (pagina == "Entrada en plataforma") {
          this.titulo = "Entrada de RAEE";
          this.estadoSalida = false;
          this.tipo = Tipo.entrada;
        } else if (pagina == "Salida de plataforma") {
          this.titulo = "Salida de RAEE";
          this.estadoSalida = true;
          this.tipo = Tipo.salida;
        }
      }
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  // Carga los datos del localStorage
  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
    if (this.usuario.centros.length == 1) {
      this.escribirEtiqueta = true;
      this.myForm.get('centro').disable();
      this.myForm.get('centro').setValue(this.usuario.centros[0].PidDireccionTercero);
    }
    this.myForm.get('marca').setValue(1);
  }

  // Leer QR
  async lector(valor) {
    this.visorQr = true;
    if (valor == "etiqueta") {
      this.limpiarEtiqueta();
    }
    this.lectorService.scan(valor).then(res => {
      this.asignarEtiqueta(valor, res);
      if(this.identificacion.Etiqueta == res)this.comprobar();
    });
  }

  //Limpiar los input que se puedan escanear
  limpiar(valor) {
    if (valor == "etiqueta") {
      this.limpiarEtiqueta();
    }
    this.asignarEtiqueta(valor, "");
  }

  atras() {
    this._location.back();
  }

  // Asigna la etiqueta en el input correspondiente
  async asignarEtiqueta(valor: string, etiqueta: string) {
    if (etiqueta === "error") {
      this.usuarioService.mostrarAlerta(this.translate.instant("IDENTIFICACION.FORMATONOOK"));
    } else {
        this.myForm.get(valor).setValue(etiqueta);
    }
  }

  // Comprueba la etiqueta una vez leida
  async comprobar() {
    let etiqueta = this.myForm.get('etiqueta').value;
    this.identificacion.Etiqueta = etiqueta;
    this.identificacion.IdCentro = this.myForm.get('centro').value;
    if (this.myForm.get('etiqueta').valid) {
      await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.BUSCANDO"));
      this.consultasService.getIdentificacion(etiqueta).subscribe(async etiqueta => {
        this.usuarioService.cerrarSpinner();
        if(await this.comprobarEstado()){
          this.existeEtiqueta = true;
          this.cargargarEtiqueta(etiqueta[0]);
        }else{
          this.myForm.get('etiqueta').setValue("");
        }
      }, async error => {
        this.usuarioService.cerrarSpinner();
        this.existeEtiqueta = false;
        if (!this.estadoSalida) {
          if(await this.comprobarEstado()){
            this.cargargarEtiqueta(etiqueta[0]);
          }else{
            this.myForm.get('etiqueta').setValue("");
          }
        } else {
          this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.NOEXISTEETIQUETA"));
        }
      });

    } else {
      this.etiquetaValida = false;

    }
  }

  // Carga los datos de la etiqueta si existe
  cargargarEtiqueta(etiqueta) {
    if (this.existeEtiqueta) {
      this.limpiarEtiqueta();
      this.myForm.get('residuo').setValue(etiqueta.sidResiduoEspecifico);
      this.myForm.get('marca').setValue(etiqueta.sidMarca);
      this.myForm.get('numSerie').setValue(etiqueta.serie);
      this.myForm.get('canibalizado').setValue(etiqueta.canibalizado);
      if (etiqueta.destino == 1) {
        this.myForm.get('destino').setValue("Reciclaje");
      } else if (etiqueta.destino == 2) {
        this.myForm.get('destino').setValue("Reutilizacion");
        this.verCanibalizado = false;
      }
    } else {
      this.limpiarEtiqueta();
      this.myForm.get('marca').setValue(1);
    }
    this.etiquetaValida = true;
  }

  limpiarEtiqueta() {
    this.myForm.get('residuo').setValue("");
    this.myForm.get('marca').setValue(1);
    this.myForm.get('numSerie').setValue("");
    this.myForm.get('canibalizado').setValue(false);
  }

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

  // Boton Guardar
  async guardar() {
    await this.usuarioService.mostrarSpinner(this.translate.instant("SPINNER.GUARDANDO"));
    this.identificacion.Canibalizado = this.myForm.get('canibalizado').value;
    this.identificacion.Albaran = this.myForm.get('albaran').value;
    this.identificacion.IdCentro = this.myForm.get('centro').value;
    this.identificacion.Etiqueta = this.myForm.get('etiqueta').value;
    this.identificacion.IdResiduo = this.myForm.get('residuo').value;
    this.identificacion.IdMarca = this.myForm.get('marca').value;
    this.identificacion.IdTercero = this.usuario.tercero.PidTercero;
    this.identificacion.Tipo = this.tipo;
    if (this.myForm.get('numSerie').value) {
      this.identificacion.NumSerie = this.myForm.get('numSerie').value;
    }
    this.identificacion.Fecha = this.consultasService.fechaActual();
    await this.geolocalizacionService.getGeolocation().then(res => {
      let coordenada: Coordenada = new Coordenada();
      coordenada.Latitud = this.geolocalizacionService.coordenada.Latitud;
      coordenada.Longitud = this.geolocalizacionService.coordenada.Longitud;
      this.identificacion.Coordenadas = coordenada;
    });
    if (this.myForm.get('destino').value == "Reciclaje") {
      this.identificacion.Funciona = false;
    } else if (this.myForm.get('destino').value == "Reutilizacion") {
      this.identificacion.Funciona = true;
    }
    
    this.imagenes.forEach(element => {
      let archivo : ListaArchivos = new ListaArchivos();
      archivo.Tipo = "PIC";
      archivo.ArchivoCodificado = this.cortarBase64(element);
      this.identificacion.ListaArchivos.push(archivo);
    });

    console.log(this.identificacion);
    if (this.existeEtiqueta) {
      if (await this.comprobarEstado()) {
        if (!this.estadoSalida) {
          this.consultasService.putEstadoEntrada(this.identificacion).subscribe(res => {
            this.usuarioService.cerrarSpinner();
            this.texto = this.translate.instant("ENTRADASALIDA.ENTRADAOK");
            this.mostrarModal(this.texto);
          }, error => {
            this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.ERRORENTRADA"));
            this.usuarioService.cerrarSpinner();
          });
        } else {
          this.consultasService.putEstadoSalida(this.identificacion).subscribe(res => {
            this.usuarioService.cerrarSpinner();
            this.texto = this.translate.instant("ENTRADASALIDA.SALIDAOK");
            this.mostrarModal(this.texto);
          }, error => {
            this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.ERRORSALIDA"));
            this.usuarioService.cerrarSpinner();
          });
        }
      } else {
        this.usuarioService.cerrarSpinner();
      }
    } else {
      this.consultasService.altaIdentificacion(this.identificacion).subscribe((res: any) => {
        this.usuarioService.cerrarSpinner();
        this.texto = this.translate.instant("ENTRADASALIDA.ENTRADAOK");
        this.mostrarModal(this.texto);
      }, error => {
        this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.ERRORALTA"));
        this.usuarioService.cerrarSpinner();
      });
    }

  }

  cortarBase64(url : string){
    let imagen = url.split(',');
    return imagen[1];
  }

  // Comprueba si es valida
  async comprobarEstado() {
    let tieneAlta = await this.tieneAlta();
    let tieneSalida = await this.tieneSalida();
    let tieneAltaConCentro = await this.tieneAltaConCentro();
    // Si no tiene alta y es entrada
    if (!tieneAlta && !this.estadoSalida) {
      this.esValida = true;
      return true;
      // Si tiene alta y es salida  
    } else if (tieneAltaConCentro && this.estadoSalida && !tieneSalida) {
      this.esValida = true;
      return true;
      // errores
    } else if (tieneAlta && !this.estadoSalida) {
      this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.ERRORTIENEENTRADA"));
      this.esValida = false;
      return false;
    } else if (!tieneAltaConCentro && this.estadoSalida) {
      this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.ERRORNOTIENEENTRADA"));
      this.esValida = false;
      return false;
    } else if (tieneSalida && this.estadoSalida) {
      this.usuarioService.mostrarAlerta(this.translate.instant("ENTRADASALIDA.ERRORTIENESALIDA"));
      this.esValida = false;
      return false;
    }

  }

  async tieneAlta() {
    let alta: boolean;
    await this.consultasService.getEntrada(this.identificacion.Etiqueta).toPromise().then((res) => {
      alta = true;
    }).catch((error) => {
      alta = false;
    });
    return alta;
  }

  async tieneAltaConCentro(): Promise<boolean> {
    let alta: boolean;
    await this.consultasService.getEntradaCentro(this.identificacion.Etiqueta, this.identificacion.IdCentro).toPromise().then((res) => {
      alta = true;
    }).catch((error) => {
      alta = false;
    });
    return alta;
  }

  async tieneSalida() {
    let salida: boolean;
    await this.consultasService.getSalida(this.identificacion.Etiqueta).toPromise().then((res) => {
      salida = true;
    }).catch((error) => {
      salida = false;
    });
    return salida;
  }

  async mostrarModal(texto) {

    const alerta = await this.alertCtrl.create({
      header: this.translate.instant("ALERTA.CABECERA"),
      message: texto,
      buttons: [
        {
          text: "Si",
          handler: () => {
            this.limpiarFormulario();
            this.lector('etiqueta');
          }
        },
        {
          text: "No",
          handler: () => {
            this._location.back();
          }
        }
      ],
      backdropDismiss: true
    });

    await alerta.present();

  }

  comprobarCentro(){
    if(this.myForm.get('centro').value){
      this.escribirEtiqueta = true;
    }
  }

  limpiarFormulario() {
    let centro = this.myForm.get('centro').value;
    let albaran = this.myForm.get('albaran').value;
    this.myForm.reset();
    this.myForm.get('centro').setValue(centro);
    this.myForm.get('albaran').setValue(albaran);
    this.myForm.get('destino').setValue("Reciclaje");
    this.imagenes = [];
    this.identificacion = new Identificacion();
  }

  eliminarImg(index: number) {
    this.imagenes.splice(index, 1);
  }

  async verImagen(imagen: string) {
    const modal = await this.modalCtrl.create({
      component: VisorImgPage,
      cssClass: 'modalImg',
      componentProps: { value: imagen }
    });

    await modal.present();
  }

  destino() {
    if (this.myForm.get('destino').value == "Reutilizacion") {
      this.myForm.get('canibalizado').setValue(false);
      let texto = 'Para que este residuo pueda ser reutilizable debe cumplir todas las condiciones siguientes: <br><br>'
      texto += ' - El aparato está íntegro y funciona, las conexiones eléctricas están en buen estado, no muestra daños superficiales ni muestras de óxido significativas. <br><br>'
      texto += ' - Etiqueta energética A o B para frigoríficos, congeladores, lavadoras y lavavajillas. Etiqueta energética A, B o C para aparatos de aire acondicionado y secadoras. <br><br>'
      texto += ' ¿Confirma que cumple todas estas condiciones?';
      this.mostrarAlerta("Aviso", texto);
      this.verCanibalizado = false;
    } else {
      this.verCanibalizado = true;
    }
  }

  async mostrarAlerta(header, cuerpo) {
    let alerta = await this.alertCtrl.create({
      header: "Weee Tracker",
      message: cuerpo,
      cssClass: ['aviso'],
      buttons: [
        {
          text: "Si",
          handler: () => {

          }
        },
        {
          text: "No",
          handler: () => {
            this.myForm.get('destino').setValue("Reciclaje");
          }
        }
      ],
      backdropDismiss: true
    });

    await alerta.present();
  }

}
