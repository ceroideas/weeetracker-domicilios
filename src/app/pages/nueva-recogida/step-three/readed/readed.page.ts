import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController, ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LectorService } from 'src/app/services/lector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { ModalGestoresPage } from '../../modal-gestores/modal-gestores.page';
import { ModalOrigenesPage } from '../../modal-origenes/modal-origenes.page';
import { EventsService } from '../../../../services/events.service';
import { ParamsService } from '../../../../services/params.service';
import { Usuario } from 'src/app/models/usuario';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';


import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { Storage } from '@ionic/storage-angular';

import { BarcodeProvider } from '../../../../providers/barcode/barcode';

// import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

declare var $:any;

@Component({
  selector: 'app-readed',
  templateUrl: './readed.page.html',
  styleUrls: ['./readed.page.scss'],
  providers: [BarcodeScanner/*, FTP*/,BarcodeProvider, Device]
})
export class ReadedPage implements OnInit {

  titulo = localStorage.getItem('alt_title_rd') ? localStorage.getItem('alt_title_rd') : "NUEVA RECOGIDA 3 - RAEE: Nuevo RAEE";
  myForm: FormGroup;

  date = localStorage.getItem('date');

  usuario: Usuario = new Usuario();

  contenedores:any;
  contenedores_aux:any;
  residuos:any;
  all_residuos:any;
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

  zebra = false;

  tipoOperativa = localStorage.getItem('tipo_operativa');

  /**/
  public scans = [];
  /**/

  constructor(private usuarioService: UsuarioService,
    public consultaService: ConsultasService,
    private _location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    private nav: NavController,
    private fb: FormBuilder,
    private platform: Platform,
    private toastController: ToastController,
    private camera: Camera,
    private events: EventsService,
    private params: ParamsService,
    private modal: ModalController,
    private lectorService: LectorService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,

    private barcodeProvider: BarcodeProvider,
    // private fTP: FTP,
    private device: Device,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner) {

    this.events.destroy('data:scan');

    console.log(this.params.getParam());

    this.myForm = this.fb.group({

      etiqueta: [localStorage.getItem('etiqueta'),Validators.required],
      fraccion: ['101',Validators.required],
      fraccion_name: ['FR1'],
      residuo: ['',Validators.required],
      residuo_especifico: ['',Validators.required],
      marca: [''],
      tipo_contenedor: ['',Validators.required],
      canibalizado: [false],
      estado_raee: [1,Validators.required],
      ref: [''],
    });

    this.cargarUsuario();

    this.platform.ready().then(()=>{

      //  Check manufacturer.  Exit if this app is not running on a Zebra device
      console.log(this.device.manufacturer);
      if (!this.device.manufacturer) {
        this.zebra = false;
        return false;
      }
      console.log("Device manufacturer is: " + this.device.manufacturer);
      // if (!(this.device.manufacturer.toLowerCase().includes("zebra") || this.device.manufacturer.toLowerCase().includes("motorola solutions"))) {
      if (!localStorage.getItem('zebra')) {
        this.zebra = false;
        return false;
      }

      this.zebra = true;

      this.events.destroy('data:scan');

      //  A scan has been received
      this.events.subscribe('data:scan', async (data: any) => {

        console.log('scanned data ok');
        //  Update the list of scanned barcodes
        let scannedData = data.scanData.extras["com.symbol.datawedge.data_string"];
        let scannedType = data.scanData.extras["com.symbol.datawedge.label_type"];

        // this.toastController.create({message: JSON.stringify(data.scanData), duration:5000}).then(t=>t.present());

        // this.scans.unshift({ "data": scannedData, "type": scannedType, "timeAtDecode": data.time });

        this.myForm.patchValue({ref:scannedData});

        //  On older devices, if a scan is received we can assume the profile was correctly configured manually
        //  so remove the yellow highlight.
        // this.uiDatawedgeVersionAttention = false;

        this.changeDetectorRef.detectChanges();
      });
    });

  }

  setValues()
  {
    this.myForm.patchValue({
      etiqueta: this.read?.values.etiqueta,
      // fraccion: this.read?.values.fraccion,
      // residuo: this.read?.values.residuo,
      // residuo_especifico: this.read?.values.residuo_especifico,
      // marca: this.read?.values.marca,
      // tipo_contenedor: this.read?.values.tipo_contenedor,
      canibalizado: this.read?.values.canibalizado,
      estado_raee: this.read?.values.estado_raee,
      ref: this.read?.values.ref,
    });
  }

  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    // this.residuos = this.usuario.residuos;
    console.log(this.usuario.residuos);
    let marcas = [];
    for(let i of this.usuario.marcas)
    {
      marcas.push({id:i.PidMarca,text:i.Nombre});
    }
    this.marcas = marcas.sort((a, b) => a.text.localeCompare(b.text));

    if (!this.read) {
      this.especificos();
    }else{

      if (!this.loadedMarca && !this.loadedResiduo) {
        this.loadedMarca = true;
        this.loadedResiduo = true;
        this.myForm.patchValue({marca: this.read?.values.marca});
        // this.myForm.patchValue({residuo: this.read?.values.residuo});
        this.setValues();
      }
    }

    this.loadContenedores();
  }   

  changeFraccion()
  {
    let contenedores = [];
    this.contenedores = [];
    this.residuos = [];

    let resp = localStorage.getItem('other_resp') ? JSON.parse(localStorage.getItem('other_resp')) : this.usuario.responsabilidades;
    for (let i of resp) {
      if (i.SidFraccion) {
        if (i.SidFraccion == this.myForm.value.fraccion && i.TipoOperacion == localStorage.getItem('tipo_operativa')) {
          contenedores.push(i.SidTipoContenedor)
        }
      }else{
        if (i.sidFraccion == this.myForm.value.fraccion && i.tipoOperacion == localStorage.getItem('tipo_operativa')) {
          contenedores.push(i.sidTipoContenedor)
        }
      }
    }

    for (let i of this.contenedores_aux)
    {
      if (contenedores.find(x => x == i.pidTipoContenedor) != undefined) {
        this.contenedores.push(i);
      }
    }

    let i:any;

    for (i of this.usuario.residuos) {
      if (i.sidFraccion == this.myForm.value.fraccion) {
        this.residuos.push({id:i.pidResiduo,text:i.nombre});
      }
    }

    this.residuos = this.residuos.sort((a, b) => a.text.localeCompare(b.text));
    this.contenedores = this.contenedores.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.myForm.patchValue({
      tipo_contenedor: null,
      residuo: this.read?.values.residuo
    })
  }

  timeout;
  interv = 10;

  especificos()
  {
    if (!this.myForm.value.fraccion) {
      return false;
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{

      let data = JSON.parse(localStorage.getItem('todos_especificos'));

      this.residuos_especificos = data.filter(x=>x.sidResiduo == this.myForm.value.residuo);

      this.residuos_especificos = this.residuos_especificos.sort((a, b) => {return a.prioridad - b.prioridad} );

      this.myForm.patchValue({residuo_especifico: null});

      if (!this.loadedResiduoEsp) {
        console.log('cargado especifico',this.read.values)
        this.loadedResiduoEsp = true;
        // setTimeout(()=>{
          this.myForm.patchValue({residuo_especifico: this.read?.values.residuo_especifico});
        // },100)
        console.log(this.myForm.value);
      }

      /*this.consultaService.especificos(this.myForm.value.residuo).subscribe(data=>{
        this.residuos_especificos = data;

        this.myForm.patchValue({residuo_especifico: null});

        if (!this.loadedResiduoEsp) {
          console.log('cargado especifico',this.read.values)
          this.loadedResiduoEsp = true;
          setTimeout(()=>{
            // alert('hola')
            this.myForm.patchValue({residuo_especifico: this.read?.values.residuo_especifico});
          },100)
          console.log(this.myForm.value);
        }
      },err=>{
        this.loadedResiduoEsp = true;
      })*/

      this.interv = 100;
    },this.interv)
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

  ionViewWillLeave()
  {
    this.events.destroy('data:scan');
  }

  loadFracciones(f)
  {
    let operacion = localStorage.getItem('tipo_operativa');

    /*if (operacion == 'RUD' || operacion == 'REU') {
      operacion = 'RCR';
    }*/
    function filtro(a,b,c)
    {
      for(let j of f)
      {
        if (operacion == 'END' || operacion == 'REX' || operacion == 'REN')
        {
          if (j.id == a.pidFraccion) {
            return a;
          }
        }else{
          if (j.id == a.pidFraccion && j.operacion == operacion) {
            return a;
          }
        }
      }
    }
    let data1 = JSON.parse(localStorage.getItem('fracciones')).filter(filtro);
    console.log(data1);
    let data2 = JSON.parse(localStorage.getItem('fracciones'));
    this.fracciones = data1;

    if (localStorage.getItem('geoFracciones') && localStorage.getItem('geoFracciones') != '[]' &&
      (  localStorage.getItem('tipo_operativa') == 'SSR'
      || localStorage.getItem('tipo_operativa') == 'RED'
      || localStorage.getItem('tipo_operativa') == 'RSR'
      || localStorage.getItem('tipo_operativa') == 'RUD')) {
      // code...
      this.fracciones = this.fracciones.filter(x=>JSON.parse(localStorage.getItem('geoFracciones')).includes(x.pidFraccion));
    }

    if (!this.loadedFraccion) {
      this.loadedFraccion = true;
      this.myForm.patchValue({fraccion: this.read?.values.fraccion});
      this.myForm.patchValue({fraccion_name: data2.find(x=>x.pidFraccion == this.read?.values.fraccion).nombre });
      this.changeFraccion();
      this.myForm.patchValue({tipo_contenedor: this.read?.values.tipo_contenedor});
    }
    /*this.consultaService.fracciones().subscribe((data:any)=>{

      
    })*/
  }

  loadContenedores()
  {
    // this.consultaService.contenedores().subscribe(data=>{
      // this.contenedores_aux = data;
      this.contenedores_aux = JSON.parse(localStorage.getItem('contenedores'));

      if (!this.loadedContenedor) {
        this.loadedContenedor = true;
        let fracciones = [];
        let resp = localStorage.getItem('other_resp') ? JSON.parse(localStorage.getItem('other_resp')) : this.usuario.responsabilidades;
        console.log(resp);
        for (let i of resp) {
          if (i.SidFraccion) {
            fracciones.push({id:i.SidFraccion,operacion:i.TipoOperacion, contenedor:i.SidTipoContenedor});
          }else{
            fracciones.push({id:i.sidFraccion,operacion:i.tipoOperacion, contenedor:i.sidTipoContenedor});
          }
        }
        this.loadFracciones(fracciones.filter(this.onlyUnique));
      }
    // })
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

  /*onFileChanged(event:any) {

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
    this.http.post('https://server.rucampo.com:3000/api/files', uploadData)
      .subscribe((data:any)=>{
        console.log(data.file);
      });
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
  }*/

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
      let msg = "";

      if (localStorage.getItem('alt_title_rd_2')) {
        msg = ('ENTREGA').toLowerCase();
      }else if (localStorage.getItem('alt_title_rd_3')) {
        msg = ('ENTREGA DIRECTA').toLowerCase();
      }else if (localStorage.getItem('alt_title_rd_4')) {
        msg = ('REUTILIZACIÓN').toLowerCase();
      }else if (localStorage.getItem('alt_title_rd_5')) {
        msg = ('RECOGIDA DE REUTILIZACIÓN').toLowerCase();
      }else if (localStorage.getItem('alt_title_rd_6')) {
        msg = ('REUTILIZACIÓN DE ENTREGA').toLowerCase();
      }else if (localStorage.getItem('alt_title_rd_7')) {
        msg = ('REUTILIZACIÓN DE ENTREGA DIRECTA').toLowerCase();
      }else if (localStorage.getItem('alt_title_rd')) {
        msg = ('RECEPCIÓN').toLowerCase();
      }else{
        msg = ('RECOGIDA').toLowerCase();
        localStorage.removeItem('alt_title_sm');
      }
      return this.alertCtrl.create({message:"¿Quiere continuar sin cargar ninguna imagen a la "+msg+"?.",
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
      if (localStorage.getItem('alt_title_rd_2')) {
        localStorage.setItem('alt_title_sm','NUEVA ENTREGA 3 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd_3')) {
        localStorage.setItem('alt_title_sm','NUEVA ENTREGA DIRECTA 4 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd_4')) {
        localStorage.setItem('alt_title_sm','NUEVA REUTILIZACIÓN 3 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd_5')) {
        localStorage.setItem('alt_title_sm','NUEVA RECOGIDA DE REUTILIZACIÓN 3 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd_6')) {
        localStorage.setItem('alt_title_sm','NUEVA REUTILIZACIÓN ENTREGA 3 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd_7')) {
        localStorage.setItem('alt_title_sm','NUEVA REUTILIZACIÓN ENTREGA DIRECTA 4 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd')) {
        localStorage.setItem('alt_title_sm','NUEVA RECEPCIÓN 3 - RAEE: Listado RAEE');
      }else{
        localStorage.removeItem('alt_title_sm');
      }
      this.nav.navigateRoot('/nueva-recogida/step-three/summary');
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

     this.photos.push({path: 'data:image/jpeg;base64,'+imageData});
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

  /**/

  //  Function to handle the floating action button onDown.  Start a soft scan.
  public fabDown() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
  }

}
