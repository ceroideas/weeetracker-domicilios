import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { ModalGestoresPage } from '../../modal-gestores/modal-gestores.page';
import { ModalOrigenesPage } from '../../modal-origenes/modal-origenes.page';
import { EventsService } from '../../../../services/events.service';
import { ParamsService } from '../../../../services/params.service';
import { Usuario } from 'src/app/models/usuario';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';


import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
// import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

declare var $:any;

@Component({
  selector: 'app-edit-read',
  templateUrl: './edit-read.page.html',
  styleUrls: ['./edit-read.page.scss'],
})
export class EditReadPage implements OnInit {
  
  titulo = "NUEVA RECOGIDA 3 - RAEE: Editar RAEE";
  myForm: FormGroup;

  date = localStorage.getItem('date');

  usuario: Usuario = new Usuario();

  contenedores:any;
  contenedores_aux:any;
  residuos:any;
  residuos_especificos:any;
  marcas:any;
  fracciones:any;

  readonly:any = true;

  photos:any = [];
  previews:any = [];

  read = this.params.getParam();

  // solicitud = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;
  // gestor = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;
  // direcciones = null;

  loadedFraccion = false;
  loadedResiduo = false;
  loadedMarca = false;
  loadedResiduoEsp = false;
  loadedContenedor = false;

  constructor(private usuarioService: UsuarioService,
    private consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private camera: Camera,
    private events: EventsService,
    private params: ParamsService,
    private modal: ModalController,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    // private fTP: FTP,
    private barcodeScanner: BarcodeScanner) {

    this.myForm = this.fb.group({

      etiqueta: [null ,Validators.required],
      fraccion: [null ,Validators.required],
      residuo: [null ,Validators.required],
      residuo_especifico: [null ,Validators.required],
      marca: [null ,Validators.required],
      tipo_contenedor: [null ,Validators.required],
      canibalizado: [null ,Validators.required],
      estado_raee: [null ,Validators.required],
      ref: [null ,Validators.required],
    });

    this.especificos();
    this.cargarUsuario();
  }

  setValues()
  {
    this.myForm.patchValue({
      etiqueta: this.read.values.etiqueta,
      fraccion: this.read.values.fraccion,
      residuo: this.read.values.residuo,
      residuo_especifico: this.read.values.residuo_especifico,
      marca: this.read.values.marca,
      tipo_contenedor: this.read.values.tipo_contenedor,
      canibalizado: this.read.values.canibalizado,
      estado_raee: this.read.values.estado_raee,
      ref: this.read.values.ref,
    });
  }

  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    this.residuos = this.usuario.residuos;
    this.marcas = this.usuario.marcas;

    if (!this.loadedMarca && !this.loadedResiduo) {
      this.setValues();
      this.loadedMarca = true;
      this.loadedResiduo = true;
    }


    let fracciones = [];

    for (let i of this.usuario.responsabilidades) {
      fracciones.push(i.SidFraccion)
    }

    this.loadContenedores();
    this.loadFracciones(fracciones.filter(this.onlyUnique));
  }

  changeFraccion()
  {
    let contenedores = [];
    this.contenedores = [];

    for (let i of this.usuario.responsabilidades) {
      if (i.SidFraccion == this.myForm.value.fraccion) {
        contenedores.push(i.SidTipoContenedor)
      }
    }

    for (let i of this.contenedores_aux)
    {
      if (contenedores.find(x => x == i.pidTipoContenedor) != undefined) {
        this.contenedores.push(i);
      }
    }

    this.myForm.patchValue({
      tipo_contenedor: null
    })
  }

  especificos()
  {
    setTimeout(()=>{

      this.consultaService.especificos(this.myForm.value.residuo).subscribe(data=>{
        this.residuos_especificos = data;

        if (!this.loadedResiduoEsp) {
          this.setValues();
          this.loadedResiduoEsp = true;
        }
      })
    },100)
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  ngOnInit() {
    
  }

  loadFracciones(f)
  {
    function filtro(a,b,c)
    {
      for(let j of f)
      {
        if (j == a.pidFraccion) {
          return a;
        }
      }
    }
    this.consultaService.fracciones().subscribe((data:any)=>{

      let data1 = data.filter(filtro)
      this.fracciones = data1;

      if (!this.loadedFraccion) {
        this.setValues();
        this.loadedFraccion = true;
      }
    })
  }

  loadContenedores()
  {
    this.consultaService.contenedores().subscribe(data=>{
      this.contenedores_aux = data;

      if (!this.loadedContenedor) {
        this.changeFraccion();
        this.setValues();
        this.loadedContenedor = true;
      }
    })
  }

  checkContenedor()
  {
    
  }

  atras() {
    this._location.back();
  }

  onFileChanged(event:any) {

    if (this.photos.length >= 4) {
      return this.alertCtrl.create({message:"Solo puede subir 4 fotos.", buttons: ["Ok"]}).then(a=>a.present());
    }


    const file = event.target.files[0];

    this.photos.push(file);


    this.previewFile();

    const uploadData = new FormData();
    uploadData.append('myFile', file, Date.now().toString()+'.jpg');
  }

  previewFile() {
    const preview = document.querySelector('img');
    const file = (document.querySelector('input[type=file]') as any).files[0];
    const reader = new FileReader();

    reader.addEventListener("load", ()=> {
      // convierte la imagen a una cadena en base64
      this.previews.push(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  adelante()
  {
    if (!this.myForm.valid) {
      return this.alertCtrl.create({message:"Por favor, complete todos los datos.", buttons: ["Ok"]}).then(a=>a.present());
    }

    if (!this.photos.length) {
      return this.alertCtrl.create({message:"¿Quiere continuar sin cargar ninguna imagen a la recogida?.",
        buttons: [{
          text:"Si",
          handler:()=>{
            this.continuar();
          }},{
            text:"No"
          }]}).then(a=>a.present());
    }

    localStorage.setItem('photos',JSON.stringify(this.photos));

    this.continuar();
  }

  continuar()
  {
    let lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];

    let photos:any = null;

    if (localStorage.getItem('photos')) {
      photos = JSON.stringify(localStorage.getItem('photos'));
      localStorage.removeItem('photos');
    }

    let idx = lecturas.findIndex(x=>x.values.etiqueta == this.read.values.etiqueta);

    lecturas[idx] = {values: this.myForm.value, photos: photos};

    localStorage.setItem('lecturas',JSON.stringify(lecturas));
    this.events.publish('getLecturas');
    this.events.publish('updateLecturas');
    this._location.back();
  }

  removeRef()
  {
    this.myForm.patchValue({
      ref: ""
    });

    this.readonly = true;
  }

  openScanner()
  {
    this.barcodeScanner.scan().then(barcodeData => {
      this.myForm.patchValue({
        ref: barcodeData.text
      });
    }).catch(err => {
       let error = true;
       this.readonly = false;
    });
  }

  deleteImage(i)
  {
    this.photos.splice(i,1);
  }

  takephoto()
  {
    if (this.photos.length >= 4) {
      return this.alertCtrl.create({message:"Solo puede subir 4 fotos.", buttons: ["Ok"]}).then(a=>a.present());
    }
    
    const options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // destinationType: this.camera.DestinationType.FILE_URI,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

     this.photos.push({path: imageData});
     // this.previews.push({path: imageData/*, preview: imageData.replace('file://','_app_file_')*/});

     // this.uploadFTP(imageData);

    }, (err) => {
     // Handle error
    });
  }

  /*async uploadPhotos()
  {
    for(let i of this.photos)
    {
      await this.uploadFTP(i.path);
    }

    this.photos = [];
  }*/

}
