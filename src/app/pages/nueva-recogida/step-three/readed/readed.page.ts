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
  public scanners = [{ "SCANNER_NAME": "Please Wait...", "SCANNER_INDEX": 0, "SCANNER_CONNECTION_STATE": true }];
  public selectedScanner = "Please Select...";
  public selectedScannerId = -1;
  public ean8Decoder = true;   //  Model for decoder
  public ean13Decoder = true;  //  Model for decoder
  public code39Decoder = true; //  Model for decoder
  public code128Decoder = true;//  Model for decoder
  public dataWedgeVersion = "Pre 6.3. Please create & configure profile manually.  See the ReadMe for more details.";
  public availableScannersText = "Requires Datawedge 6.3+"
  public activeProfileText = "Requires Datawedge 6.3+";
  public commandResultText = "Messages from DataWedge will go here";
  public uiHideDecoders = true;
  public uiDatawedgeVersionAttention = true;
  public uiHideSelectScanner = true;
  public uiHideShowAvailableScanners = false;
  public uiHideCommandMessages = true;
  public uiHideFloatingActionButton = true;
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

      //  Determine the version.  We can add additional functionality if a more recent version of the DW API is present
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");

      this.events.destroy('status:dw63ApisAvailable');
      this.events.destroy('status:dw64ApisAvailable');
      this.events.destroy('status:dw65ApisAvailable');
      this.events.destroy('data:activeProfile');
      this.events.destroy('data:commandResult');
      this.events.destroy('data:enumeratedScanners');
      this.events.destroy('data:scan');

      //  6.3 DataWedge APIs are available
      this.events.subscribe('status:dw63ApisAvailable', (isAvailable) => {
        console.log("DataWedge 6.3 APIs are available");
        //  We are able to create the profile under 6.3.  If no further version events are received, notify the user
        //  they will need to create the profile manually
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.CREATE_PROFILE", "ZebraWeeetracker");
        this.dataWedgeVersion = "6.3.  Please configure profile manually.  See the ReadMe for more details.";

        //  Although we created the profile we can only configure it with DW 6.4.
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");

        //  Enumerate the available scanners on the device
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");

        //  Functionality of the FAB is available so display the button
        this.uiHideFloatingActionButton = false;

        this.changeDetectorRef.detectChanges();
      });

      //  6.4 Datawedge APIs are available
      this.events.subscribe('status:dw64ApisAvailable', (isAvailable) => {
        console.log("DataWedge 6.4 APIs are available");

        //  Documentation states the ability to set a profile config is only available from DW 6.4.
        //  For our purposes, this includes setting the decoders and configuring the associated app / output params of the profile.
        this.dataWedgeVersion = "6.4";
        this.uiDatawedgeVersionAttention = false;
        this.uiHideDecoders = !isAvailable;

        //  Configure the created profile (associated app and keyboard plugin)
        let profileConfig = {
          "PROFILE_NAME": "ZebraWeeetracker",
          "PROFILE_ENABLED": "true",
          "CONFIG_MODE": "UPDATE",
          "PLUGIN_CONFIG": {
            "PLUGIN_NAME": "BARCODE",
            "RESET_CONFIG": "true",
            "PARAM_LIST": {}
          },
          "APP_LIST": [{
            "PACKAGE_NAME": "com.ecolec.weeetracker",
            "ACTIVITY_LIST": ["*"]
          }]
        };
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);

        //  Configure the created profile (intent plugin)
        let profileConfig2 = {
          "PROFILE_NAME": "ZebraWeeetracker",
          "PROFILE_ENABLED": "true",
          "CONFIG_MODE": "UPDATE",
          "PLUGIN_CONFIG": {
            "PLUGIN_NAME": "INTENT",
            "RESET_CONFIG": "true",
            "PARAM_LIST": {
              "intent_output_enabled": "true",
              "intent_action": "com.ecolec.weeetracker.ACTION",
              "intent_delivery": "2"
            }
          }
        };
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig2);

        //  Give some time for the profile to settle then query its value
        setTimeout(function () {
          this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");
        }, 1000);

        this.changeDetectorRef.detectChanges();
      });

      //  6.5 Datawedge APIs are available
      this.events.subscribe('status:dw65ApisAvailable', (isAvailable) => {
        console.log("DataWedge 6.5 APIs are available");

        //  The ability to switch to a new scanner is only available from DW 6.5 onwards
        //  Reconfigure UI so the user can choose the desired scanner
        this.uiHideSelectScanner = false;
        this.uiHideShowAvailableScanners = true;

        //  6.5 also introduced messages which are received from the API to indicate success / failure
        this.uiHideCommandMessages = false;
        this.barcodeProvider.requestResult(true);
        this.dataWedgeVersion = "6.5 or higher";
        this.changeDetectorRef.detectChanges();
      });

      //  Response to our request to find out the active DW profile
      this.events.subscribe('data:activeProfile', (activeProfile) => {
        console.log("Active profile: " + activeProfile);

        //  Update the UI
        this.activeProfileText = activeProfile;

        this.changeDetectorRef.detectChanges();
      });

      //  The result (success / failure) of our last API call along with additional information
      this.events.subscribe('data:commandResult', (commandResult) => {
        this.commandResultText = commandResult;
        this.changeDetectorRef.detectChanges();
      });

      //  Response to our requet to enumerte the scanners
      this.events.subscribe('data:enumeratedScanners', (enumeratedScanners) => {
        //  Maintain two lists, the first for devices which support DW 6.5+ and shows a combo box to select
        //  the scanner to use.  The second will just display the available scanners in a list and be available
        //  for 6.4 and below
        this.scanners = enumeratedScanners;
        let humanReadableScannerList = "";
        enumeratedScanners.forEach((scanner, index) => {
          console.log("Scanner found: name= " + scanner.SCANNER_NAME + ", id=" + scanner.SCANNER_INDEX + ", connected=" + scanner.SCANNER_CONNECTION_STATE);
          humanReadableScannerList += scanner.SCANNER_NAME;
          if (index < enumeratedScanners.length - 1)
            humanReadableScannerList += ", ";
        });
        this.availableScannersText = humanReadableScannerList;
        this.scanners.unshift({"SCANNER_NAME": "Please Select...", "SCANNER_INDEX":-1, "SCANNER_CONNECTION_STATE":false});
        this.changeDetectorRef.detectChanges();
      });

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
        this.uiDatawedgeVersionAttention = false;

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
    this.marcas = marcas;

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

    let i:any;

    for (i of this.usuario.residuos) {
      if (i.sidFraccion == this.myForm.value.fraccion) {
        this.residuos.push({id:i.pidResiduo,text:i.nombre});
      }
    }

    this.myForm.patchValue({
      tipo_contenedor: null,
      residuo: this.read?.values.residuo
    })
  }

  timeout;
  interv = 500;

  especificos()
  {
    if (!this.myForm.value.fraccion) {
      return false;
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{

      this.consultaService.especificos(this.myForm.value.residuo).subscribe(data=>{
        this.residuos_especificos = data;

        this.myForm.patchValue({residuo_especifico: null});

        if (!this.loadedResiduoEsp) {
          console.log('cargado especifico',this.read.values)
          this.loadedResiduoEsp = true;
          this.myForm.patchValue({residuo_especifico: this.read?.values.residuo_especifico});
          console.log(this.myForm.value);
        }
      },err=>{
        this.loadedResiduoEsp = true;
      })

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

  loadFracciones(f)
  {
    let operacion = localStorage.getItem('tipo_operativa');
    function filtro(a,b,c)
    {
      for(let j of f)
      {
        if (operacion == 'END' || operacion == 'REX')
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
    let data2 = JSON.parse(localStorage.getItem('fracciones'));
    this.fracciones = data1;

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
      if (localStorage.getItem('alt_title_rd_2')) {
        localStorage.setItem('alt_title_sm','NUEVA ENTREGA 3 - RAEE: Listado RAEE');
      }else if (localStorage.getItem('alt_title_rd_3')) {
        localStorage.setItem('alt_title_sm','NUEVA ENTREGA DIRECTA 3 - RAEE: Listado RAEE');
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

  //  Function to handle changes in the decoder checkboxes.  
  //  Note: SET_CONFIG only available on DW 6.4+ per the docs
  public setDecoders() {
    var paramList = {
      "scanner_selection": "auto",
      "decoder_ean8": "" + this.ean8Decoder,
      "decoder_ean13": "" + this.ean13Decoder,
      "decoder_code128": "" + this.code128Decoder,
      "decoder_code39": "" + this.code39Decoder
    }
    //  The "scanner_selection" parameter supports "auto" to apply to the default scanner.
    //  If we have selected a different scanner we need to ensure the settings are applied
    //  to the correct scanner by specifying "current-device-id".  See http://techdocs.zebra.com/datawedge/6-7/guide/api/setconfig/
    //  for more information.  selectedScannerId will be >-1 if the user has chosen a specific scanner.
    if (this.selectedScannerId > -1)
    {
      paramList["current-device-id"] = "" + this.selectedScannerId;
      delete paramList["scanner_selection"];
    }
    //  Set the new configuration
    let profileConfig = {
      "PROFILE_NAME": "ZebraWeeetracker",
      "PROFILE_ENABLED": "true",
      "CONFIG_MODE": "UPDATE",
      "PLUGIN_CONFIG": {
        "PLUGIN_NAME": "BARCODE",
        "PARAM_LIST": paramList
      }
    };
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);
  }

  private async presentAlert() {
    let alert = await this.alertCtrl.create({
      subHeader: 'Requires Zebra device',
      message: 'This application requires a Zebra mobile device in order to run',
      cssClass: 'nonZebraAlert',
      buttons: [{
        text: 'Close app',
        handler: data => {
          console.log('Closing application since we are not running on a Zebra device');
          navigator['app'].exitApp();
        }
      }]
    });
    await alert.present();
  }

  //  Function to handle the user selecting a new scanner
  //  Note: SWITCH_SCANNER only available on DW 6.5+
  public async scannerSelected() {
    console.log("Requested scanner is: " + this.selectedScanner);
    let localScannerIndex = 0;
    let localScannerName = "";
    for (let scanner of this.scanners) {
      //  The current scanner will be returned as SCANNER_CONNECTION_STATE
      if (scanner.SCANNER_NAME == this.selectedScanner) {
        localScannerIndex = scanner.SCANNER_INDEX;
        localScannerName = scanner.SCANNER_NAME;
      }
    }
    if (this.selectedScannerId == localScannerIndex || localScannerIndex < 0) {
      console.log("Not switching scanner, new scanner ID == old scanner ID");
      let toast = await this.toastController.create({
        message: 'Invalid scanner selection',
        position: 'bottom',
        duration:3000
      });
      await toast.present();
      return;
    }
    this.selectedScanner = localScannerName;
    this.selectedScannerId = localScannerIndex;
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SWITCH_SCANNER", localScannerIndex + "");
    //  Enumerate the scanner - this will update the actual scanner in use so we do not have to worry about whether SWITCH_SCANNER succeeded
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");
  }

  //  Function to handle the floating action button onDown.  Start a soft scan.
  public fabDown() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
  }

}
