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
  selector: 'app-edit-read',
  templateUrl: './edit-read.page.html',
  styleUrls: ['./edit-read.page.scss'],
  providers: [BarcodeScanner/*, FTP*/,BarcodeProvider, Device]
})
export class EditReadPage implements OnInit {
  
  titulo = localStorage.getItem('alt_title_ed') ? localStorage.getItem('alt_title_ed') :  "NUEVA RECOGIDA 3 - RAEE: Editar RAEE";
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

  private _storage: Storage | null = null;

  zebra = false;

  tipoOperativa = localStorage.getItem('tipo_operativa');

  /**/

  lecturas = [];
  showControls = localStorage.getItem('read_type') == 'grupal' ? true : false;

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

    this.photos = this.read.photos ? this.read.photos : [];

    this.myForm = this.fb.group({

      etiqueta: [null ,Validators.required],
      fraccion: [null ,Validators.required],
      fraccion_name: [null],
      residuo: [null ,Validators.required],
      residuo_especifico: [null ,Validators.required],
      marca: [null],
      tipo_contenedor: [null ,Validators.required],
      canibalizado: [null],
      estado_raee: [null ,Validators.required],
      ref: [null],
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
    console.log('setValues');
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
    console.log('cargar usuario')
    this.usuario = await this.usuarioService.cargarToken();
    // this.residuos = this.usuario.residuos;
    let marcas = [];
    for(let i of this.usuario.marcas)
    {
      marcas.push({id:i.PidMarca,text:i.Nombre});
    }
    this.marcas = marcas.sort((a, b) => a.text.localeCompare(b.text));

    if (!this.read) {
      this.especificos();
    }else{
      console.log(this.read.values.marca);
      if (!this.loadedMarca && !this.loadedResiduo) {
        this.loadedMarca = true;
        this.loadedResiduo = true;
        this.myForm.patchValue({marca: this.read?.values.marca});
        // this.myForm.patchValue({residuo: this.read.values.residuo});
        this.setValues();
      }
    }

    this.loadContenedores();
  }

  changemodel()
  {
    console.log('change model')
  }

  changeFraccion()
  {
    let contenedores = [];
    this.contenedores = [];
    this.residuos = [];

    let resp = localStorage.getItem('other_resp') ? JSON.parse(localStorage.getItem('other_resp')) : this.usuario.responsabilidades;
    for (let i of resp) {
      if (i.SidFraccion) {
        if (i.SidFraccion == this.myForm.value.fraccion) {
          contenedores.push(i.SidTipoContenedor)
        }
      }else{
        if (i.sidFraccion == this.myForm.value.fraccion) {
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

    // console.log(this.usuario.residuos);
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
      residuo: this.read.values.residuo
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
    this.consultaService.createLogger('Editar datos de RAEE Success');
    const storage = await this.storage.create();
    this._storage = storage;

    this.configureLecturas();
  }

  ionViewWillLeave()
  {
    this.events.destroy('data:scan');
  }

  left;
  right;
  idx;

  async configureLecturas()
  {
    this.lecturas = await this.storage.get('lecturas');

    if (this.lecturas.length == 1) {
      this.showControls = false;
    }

    if (this.lecturas.length > 1) {
      this.showControls = true;
    }

    this.idx = this.lecturas.findIndex(x=>x.values.etiqueta == this.read.values.etiqueta);

    console.log(this.idx,this.lecturas.length);

    if (this.idx == 0) {
      this.left = false;
      this.right = true;
    }

    if (this.idx == this.lecturas.length-1) {
      this.left = true;
      this.right = false;
    }

    if (this.idx != 0 && this.idx != this.lecturas.length-1) {
      this.left = true;
      this.right = true;
    }
  }

  async prev()
  {
    await this.adelante(true,'prev');
  }
  async next()
  {
    await this.adelante(true,'next');
  }

  loadFracciones(f)
  {
    let operacion = localStorage.getItem('tipo_operativa');

    /*if (operacion == 'RUD') {
      operacion = 'RED';
    }
    if (operacion == 'REU') {
      operacion = 'REF';
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
    // this.consultaService.fracciones().subscribe((data:any)=>{

      // let data1 = data.filter(filtro)
      let data1 = JSON.parse(localStorage.getItem('fracciones')).filter(filtro);
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
    // })
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
    this.params.setParam(null);
    this._location.back();
  }

  // onFileChanged(event:any) {

  //   if (this.photos.length >= 4) {
  //     return this.alertCtrl.create({message:"Solo puede subir 4 fotos.", buttons: ["Ok"]}).then(a=>a.present());
  //   }


  //   const file = event.target.files[0];

  //   this.photos.push(file);


  //   this.previewFile();

  //   const uploadData = new FormData();
  //   uploadData.append('myFile', file, Date.now().toString()+'.jpg');
  // }

  // previewFile() {
  //   const preview = document.querySelector('img');
  //   const file = (document.querySelector('input[type=file]') as any).files[0];
  //   const reader = new FileReader();

  //   reader.addEventListener("load", ()=> {
  //     // convierte la imagen a una cadena en base64
  //     this.previews.push(reader.result);
  //   }, false);

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // }

  async adelante(stay = false, side = null)
  {
    console.log(this.myForm.valid);
    if (!this.myForm.valid /*&& stay == false*/) {
      return this.alertCtrl.create({message:"Por favor, complete todos los datos.", buttons: ["Ok"]}).then(a=>a.present());
    }

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
        localStorage.removeItem('alt_title_sm');
      }
      return this.alertCtrl.create({message:"¿Quiere continuar sin cargar ninguna imagen a la "+msg+"?.",
        buttons: [{
          text:"Si",
          handler:()=>{
            this.continuar(stay,side);
          }},{
            text:"No"
          }]}).then(a=>a.present());
    }

    // localStorage.setItem('photos',JSON.stringify(this.photos));

    await this._storage?.set('photos', this.photos);

    this.continuar(stay,side);
  }

  async continuar(stay = false, side = null)
  {
    // let lecturas = localStorage.getItem('lecturas') ? JSON.parse(localStorage.getItem('lecturas')) : [];

    this.lecturas = await this.storage.get('lecturas');

    if (!this.lecturas) {
      this.lecturas = [];
    }

    let photos:any = null;
    const checkphotos = await this._storage.get('photos');

    if (checkphotos) {
      photos = checkphotos;
      await this._storage.remove('photos');
      // localStorage.removeItem('photos');
    }

    let idx = this.lecturas.findIndex(x=>x.values.etiqueta == this.read.values.etiqueta);

    this.lecturas[idx] = {values: this.myForm.value, photos: photos};

    // localStorage.setItem('lecturas',JSON.stringify(lecturas));
    
    await this._storage?.set('lecturas', this.lecturas);

    this.events.publish('getLecturas');
    this.events.publish('updateLecturas');

    this.events.publish('cargarUsuario');
    this.events.publish('reloadStepFour');
    this.events.publish('reloadStepFive');

    if (stay) {

      this.loadedFraccion = false;
      this.loadedResiduo = false;
      this.loadedMarca = false;
      this.loadedResiduoEsp = false;
      this.loadedContenedor = false;

      if (localStorage.getItem('read_type') == 'grupal') {
        // if (!this.myForm.value.prevent_overwrite) {
          for (let i of this.lecturas)
          {

            // if (!i.values.prevent_overwrite) {
              
              // porque la marca puede estar vacia
              i.values.marca = !i.values.residuo ? this.myForm.value.marca : i.values.marca;
              // porque canibalizado puede estar vacia
              i.values.canibalizado = !i.values.residuo ? this.myForm.value.canibalizado : i.values.canibalizado;

              i.values.fraccion = !i.values.fraccion ? this.myForm.value.fraccion : i.values.fraccion;
              i.values.residuo = !i.values.residuo ? this.myForm.value.residuo : i.values.residuo;
              i.values.residuo_especifico = !i.values.residuo_especifico ? this.myForm.value.residuo_especifico : i.values.residuo_especifico;
              i.values.tipo_contenedor = !i.values.tipo_contenedor ? this.myForm.value.tipo_contenedor : i.values.tipo_contenedor;
              i.values.estado_raee = !i.values.estado_raee ? this.myForm.value.estado_raee : i.values.estado_raee;
              i.values.ref = !i.values.ref ? this.myForm.value.ref : i.values.ref;

            // }
            
          }
        // }
      }

      console.log(this.lecturas);

      if (side == 'prev') {
        this.read = this.lecturas[this.idx-1];
        this.photos = this.lecturas[this.idx-1].photos ? this.lecturas[this.idx-1].photos : [];
        console.log(this.read);
      }else if(side == 'next'){
        this.read = this.lecturas[this.idx+1];
        this.photos = this.lecturas[this.idx+1].photos ? this.lecturas[this.idx+1].photos : [];
        console.log(this.read);
      }

      await this._storage?.set('lecturas', this.lecturas);

      this.configureLecturas();

      this.cargarUsuario();

    }else{
      this._location.back();
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
