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

import { Storage } from '@ionic/storage-angular';

// import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

declare var $:any;

@Component({
  selector: 'app-readed',
  templateUrl: './readed.page.html',
  styleUrls: ['./readed.page.scss'],
  providers: [BarcodeScanner/*, FTP*/]
})
export class ReadedPage implements OnInit {

  titulo = "NUEVA RECOGIDA 3 - RAEE: Nuevo RAEE";
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
  to = 'forward';
  read = this.params.getParam();
  // solicitud = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;
  // gestor = JSON.parse(localStorage.getItem('solicitud')) ? JSON.parse(localStorage.getItem('solicitud'))['response'] : null;
  // direcciones = null;

  loadedFraccion = false;
  loadedResiduo = false;
  loadedMarca = false;
  loadedResiduoEsp = false;
  loadedContenedor = false;

  private _storage: Storage | null = null;

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
    private storage: Storage,
    private barcodeScanner: BarcodeScanner) {

    this.myForm = this.fb.group({

      etiqueta: [localStorage.getItem('etiqueta'),Validators.required],
      fraccion: ['FR1',Validators.required],
      residuo: ['',Validators.required],
      residuo_especifico: ['',Validators.required],
      marca: [''],
      tipo_contenedor: ['',Validators.required],
      canibalizado: [null],
      estado_raee: [1,Validators.required],
      ref: [''],
    });

    this.cargarUsuario();
  }

  setValues()
  {
    this.myForm.patchValue({
      etiqueta: this.read.values.etiqueta,
      // fraccion: this.read.values.fraccion,
      // residuo: this.read.values.residuo,
      // residuo_especifico: this.read.values.residuo_especifico,
      // marca: this.read.values.marca,
      // tipo_contenedor: this.read.values.tipo_contenedor,
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

    if (!this.read) {
      this.especificos();
    }else{

      if (!this.loadedMarca && !this.loadedResiduo) {
        this.loadedMarca = true;
        this.loadedResiduo = true;
        this.myForm.patchValue({marca: this.read.values.marca});
        this.myForm.patchValue({residuo: this.read.values.residuo});
        this.setValues();
      }
    }

    this.loadContenedores();
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

        if (!this.read) {
          if (!this.loadedResiduoEsp) {
            this.loadedResiduoEsp = true;
            this.myForm.patchValue({residuo_especifico: this.read.values.residuo_especifico});
          }
        }
      })
    },100)
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  async ngOnInit() {
    this.consultaService.createLogger('Rellenar datos de RAEE success');
    this.consultaService.createLogger('Completar la carga de informacion para rellenar RAEE success');
    const storage = await this.storage.create();
    this._storage = storage;
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

      if (this.read) {
        if (!this.loadedFraccion) {
          this.loadedFraccion = true;
          this.myForm.patchValue({fraccion: this.read.values.fraccion});
          this.changeFraccion();
          this.myForm.patchValue({tipo_contenedor: this.read.values.tipo_contenedor});
        }
      }
    })
  }

  loadContenedores()
  {
    this.consultaService.contenedores().subscribe(data=>{
      this.contenedores_aux = data;

      if (!this.loadedContenedor) {
        this.loadedContenedor = true;
        let fracciones = [];
        for (let i of this.usuario.responsabilidades) {
          fracciones.push(i.SidFraccion)
        }
        this.loadFracciones(fracciones.filter(this.onlyUnique));
      }
    })
  }

  checkContenedor()
  {
    
  }

  atras() {
    this._location.back();
  }

  foto()
  {
    if (this.photos.length >= 4) {
      return this.alertCtrl.create({message:"Solo puede subir 4 fotos.", buttons: ["Ok"]}).then(a=>a.present());
    }

    /*const options: CameraOptions = {
      quality: 70,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     
     this.photos.push(imageData);
    }, (err) => {
     // Handle error
    });*/
  }

  onFileChanged(event:any) {

    if (this.photos.length >= 4) {
      return this.alertCtrl.create({message:"Solo puede subir 4 fotos.", buttons: ["Ok"]}).then(a=>a.present());
    }

    this.consultaService.createLogger('Nueva foto RAEE success');


    const file = event.target.files[0];

    this.photos.push(file);

    console.log(this.photos);

    this.previewFile();

    const uploadData = new FormData();
    uploadData.append('myFile', file, Date.now().toString()+'.jpg');
    /*this.http.post('https://server.rucampo.com:3000/api/files', uploadData)
      .subscribe((data:any)=>{
        console.log(data.file);
      });*/
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

  saveAndBack()
  {
    this.to = 'forward';
    return this.alertCtrl.create({message:"¿Quiere guardar la información y leer otra etiqueta?.",
        buttons: [{
          text:"Si",
          handler:()=>{
            this.to = 'back';
            this.adelante();
          }},{
            text:"No"
          }]}).then(a=>a.present());
  }

  async adelante()
  {
    if (!this.myForm.valid) {
      return this.alertCtrl.create({message:"Por favor, complete todos los datos.", buttons: ["Ok"]}).then(a=>a.present());
    }

    this.consultaService.createLogger('Rellenados datos de RAEE Success');

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

    // localStorage.setItem('photos',JSON.stringify(this.photos));

    await this._storage?.set('photos', this.photos);

    this.continuar();
  }

  async continuar()
  {
    // let lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];
    let lecturas = await this.storage.get('lecturas');

    this.consultaService.createLogger('Completada lectura de RAEE Success');

    if (!lecturas) {
      lecturas = [];
    }

    let photos:any = null;
    const checkphotos = await this._storage.get('photos');

    if (checkphotos) {
      photos = checkphotos;
      await this._storage.remove('photos');
      // localStorage.removeItem('photos');
    }

    lecturas.push({values: this.myForm.value, photos: photos});

    await this._storage?.set('lecturas', lecturas);

    // localStorage.setItem('lecturas',JSON.stringify(lecturas));
    this.events.publish('getLecturas');
    if (this.to == 'forward') {
      this.nav.navigateForward('/nueva-recogida/step-three/summary');
    }else{
      this._location.back();
      this.events.publish('newRead');
    }
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
      console.log('Barcode data', barcodeData);
      this.myForm.patchValue({
        ref: barcodeData.text
      });
    }).catch(err => {
       let error = true;
       console.log('Error', err);
       this.readonly = false;
    });
  }

  deleteImage(i)
  {
    this.consultaService.createLogger('Borrar Imagen Success');
    this.photos.splice(i,1);
  }

  /*ftp()
  {
    this.fTP.connect('85.208.21.142', 'tuweb', '5wb*08Te')
    .then((res: any) => {
      console.log('Login successful ceroideas', res);

      this.fTP.ls('/').then(a=>{
        console.log(a);
      })

    })
    .catch((error: any) => console.error(error));
  }

  async uploadFTP(path)
  {
    let name = path.split('/').reverse()[0];

    await this.fTP.upload(path,'/test/'+name).subscribe(p=>{

      if (p == 1) {
          console.debug("Ftp4es6: upload percent=100%");
          console.info("Ftp4es6: upload finish");
      } else {
          console.debug("Ftp4es6: upload percent=" + p * 100 + "%");
      }

    },err=>{
      console.log(err)
    })
  }*/

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
