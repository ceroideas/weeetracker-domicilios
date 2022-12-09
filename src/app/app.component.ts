import { Component, ChangeDetectorRef } from '@angular/core';

import { Platform, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { EventsService } from './services/events.service';
import { TranslateService } from '@ngx-translate/core';
import { IdentificacionService } from './services/identificacion.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { ConsultasService } from './services/consultas.service';

import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';

import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

import { BarcodeProvider } from './providers/barcode/barcode';

import { Device } from '@awesome-cordova-plugins/device/ngx';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [File,WebView,/*FileTransfer,*/AndroidPermissions, BarcodeProvider]
})

export class AppComponent {

  showWindow = true;
  /**/
  public scans = [];
  public scanners = [{ "SCANNER_NAME": "Please Wait...", "SCANNER_INDEX": 0, "SCANNER_CONNECTION_STATE": true }];
  public selectedScanner = "Please Select...";
  public selectedScannerId = -1;
  public ean8Decoder = true;   // Model for decoder
  public ean13Decoder = true;  // Model for decoder
  public code39Decoder = true; // Model for decoder
  public code128Decoder = true;// Model for decoder
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

  constructor(
    private device: Device,
    private changeDetectorRef: ChangeDetectorRef,
    private nativeAudio: NativeAudio,
    private barcodeProvider: BarcodeProvider,
    private toastController: ToastController,
    private alertController: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private usuarioService : UsuarioService,
    private screenOrientation : ScreenOrientation,
    private translateService : TranslateService,
    private fileNavigator: File,
    private identificacionService : IdentificacionService,
    private keyboard : Keyboard,
    private webview: WebView,
    // private transfer: FileTransfer,
    private events: EventsService,
    private loadingCtrl: LoadingController,
    private androidPermissions: AndroidPermissions,
    public consultas: ConsultasService
  ) {

    this.consultas.getVersion().subscribe((data:any)=>{
      if (data.v.length && !data.v[0].activa) {
        this.alertController.create({message: 'Su versión esta desactualizada póngase en contacto con el CAU para actualizarla', 
          buttons: [{text:"Aceptar", handler:(a)=>{

            navigator['app'].exitApp();

          }}]
        ,backdropDismiss: false}).then(a=>a.present());
      }
    })

    this.nativeAudio.preloadSimple('uniqueId1', 'assets/beep.mp3').then(()=>{
      console.log('Beep loaded ok')
    }, (err)=>{
      console.log(err)
    });


    this.platform.backButton.subscribe(() => {
      try {
        $('.select2-dropdown').remove();
      }
      catch(e) {
        
      }
    })

    this.initializeApp();

    this.events.subscribe('loadPostLogout',()=>{
      if (this.platform.is('cordova')) {
        this.configXML();
      }else{
        setTimeout(()=>{
          localStorage.removeItem('config');
          this.events.publish('setLoaded');
          // this.configXMLdesktop();
        },100)

      }
    })
  }

  initializeApp() {
    this.platform.ready().then(async () => {

      // this.consultas.createLogger({nombre:"jorge", apellido:"solano"});
       //Language
       this.translateService.setDefaultLang('es');
       this.translateService.use('es');

      // if(await this.estaLogeado()){
      //  this.router.navigateByUrl("/home");
      // }else{
      //  this.router.navigateByUrl("/");
      // }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#0D8B7A")
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {

        console.log('is cordova')

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
          result => {
            if (result.hasPermission) {
              // code
              console.log('has read permission')
              this.configXML();
            } else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
                if (result.hasPermission) {
                  // code
                  console.log('has read permission 2')
                  this.configXML();
                }
              });

            }
          },
          err => {
            console.log('warning no permission')
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
          }
        );

      }else{

        console.log('is desktop')

        setTimeout(()=>{
          localStorage.removeItem('config');
          this.events.publish('setLoaded');
          // this.configXMLdesktop();
        },100)
      }
    
      // this.insertarResiduosDomicilio();

      
    });
  }

  async configXML()
  {
    this.estaLogeado().then(a=>{
      if (!a) {
      let path = this.fileNavigator.externalRootDirectory+'CONFIG/CONFIG.XML';
        // path = this.webview.convertFileSrc(path);
      console.log(path)
        
        this.fileNavigator.checkDir(this.fileNavigator.externalRootDirectory,'CONFIG').then(_ => {

          localStorage.setItem('zebra','1');

          setTimeout(()=>{
            this.initZebra();
          },1000);

          console.log(this.device.version);

          console.log('directorio encontrado ' /*+(this.webview.convertFileSrc(path))*/ + path.replace('file://','_app_file_'));

          this.loadingCtrl.create({message:"Comprobando PDA"}).then(l=>{
            l.present();

            this.consultas.getXML(path.replace('file://','_app_file_')).subscribe((data:any)=>{
              let parser = new DOMParser();
              let xmlDoc = parser.parseFromString(data,"text/xml");

              console.log(data);

              console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

              localStorage.setItem('centro_config',xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

              this.events.publish('getConfigInformation',({
                gestor:xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue,
                centro:xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue,
                pda:xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue,
                sidsig:xmlDoc.getElementsByTagName("SIG")[0].childNodes[0].nodeValue,
              }));
              /**/
            })
          })

        },err=>{
          setTimeout(()=>{
            localStorage.removeItem('zebra');
            console.log("Ha ocurrido un error al leer el archivo Config.XML");
            // alert('Directorio no encontrado')
            this.events.publish('setLoaded');
          },100)
        });
      }
    });
  }

  async configXMLdesktop()
  {
    localStorage.removeItem('zebra');
    this.estaLogeado().then(a=>{
      if (!a) {
        this.loadingCtrl.create({message:"Comprobando PDA"}).then(l=>{
          l.present();
          
          this.consultas.getXML('/assets/config.xml').subscribe((data:any)=>{
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data,"text/xml");

            console.log(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

            localStorage.setItem('centro_config',xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue);

            this.events.publish('getConfigInformation',({
              gestor:xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue,
              centro:xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue,
              pda:xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue,
              sidsig:xmlDoc.getElementsByTagName("SIG")[0].childNodes[0].nodeValue,
            }));

            // this.consultas.getConfigInformation(xmlDoc.getElementsByTagName("Gestor")[0].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("CENTRO")[0].childNodes[0].nodeValue)
            // .subscribe((data:any)=>{
            //  this.terminal = xmlDoc.getElementsByTagName("PDA")[0].childNodes[0].nodeValue;
            //  this.direccion = data.config._centro.direccion;
            //  this.nombre = data.config._gestor.nombre;
            // })
          })
        })
      }
    })
  }

  async estaLogeado(){
    if(await this.usuarioService.tokenValido()){
      if(await this.usuarioService.cargarToken()){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    };
  }

  insertarResiduosDomicilio(){
    setInterval(()=>{
      this.identificacionService.hayIdentificaciones()
    },1000 * 60 * 60);   
  }

  initZebra()
  {
    // Determine the version.  We can add additional functionality if a more recent version of the DW API is present
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");

    ////////////////////////////
    // EVENT HANDLING
    ////////////////////////////

    this.events.destroy('status:dw63ApisAvailable');
    this.events.destroy('status:dw64ApisAvailable');
    this.events.destroy('status:dw65ApisAvailable');
    this.events.destroy('data:activeProfile');
    this.events.destroy('data:commandResult');
    this.events.destroy('data:enumeratedScanners');
    this.events.destroy('data:scan');

    // 6.3 DataWedge APIs are available
    this.events.subscribe('status:dw63ApisAvailable', (isAvailable) => {
      console.log("DataWedge 6.3 APIs are available");
      // We are able to create the profile under 6.3.  If no further version events are received, notify the user
      // they will need to create the profile manually
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.CREATE_PROFILE", "ZebraWeeetracker");
      this.dataWedgeVersion = "6.3.  Please configure profile manually.  See the ReadMe for more details.";

      // Although we created the profile we can only configure it with DW 6.4.
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");

      // Enumerate the available scanners on the device
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");

      // Functionality of the FAB is available so display the button
      this.uiHideFloatingActionButton = false;

      this.changeDetectorRef.detectChanges();
    });

    // 6.4 Datawedge APIs are available
    this.events.subscribe('status:dw64ApisAvailable', (isAvailable) => {
      console.log("DataWedge 6.4 APIs are available");

      // Documentation states the ability to set a profile config is only available from DW 6.4.
      // For our purposes, this includes setting the decoders and configuring the associated app / output params of the profile.
      this.dataWedgeVersion = "6.4";
      this.uiDatawedgeVersionAttention = false;
      this.uiHideDecoders = !isAvailable;

      // Configure the created profile (associated app and keyboard plugin)
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

      // Configure the created profile (intent plugin)
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

      // Give some time for the profile to settle then query its value
      setTimeout(function () {
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");
      }, 1000);

      this.changeDetectorRef.detectChanges();
    });

    // 6.5 Datawedge APIs are available
    this.events.subscribe('status:dw65ApisAvailable', (isAvailable) => {
      console.log("DataWedge 6.5 APIs are available");

      // The ability to switch to a new scanner is only available from DW 6.5 onwards
      // Reconfigure UI so the user can choose the desired scanner
      this.uiHideSelectScanner = false;
      this.uiHideShowAvailableScanners = true;

      // 6.5 also introduced messages which are received from the API to indicate success / failure
      this.uiHideCommandMessages = false;
      this.barcodeProvider.requestResult(true);
      this.dataWedgeVersion = "6.5 or higher";
      this.changeDetectorRef.detectChanges();
    });

    // Response to our request to find out the active DW profile
    this.events.subscribe('data:activeProfile', (activeProfile) => {
      console.log("Active profile: " + activeProfile);

      // Update the UI
      this.activeProfileText = activeProfile;

      this.changeDetectorRef.detectChanges();
    });

    // The result (success / failure) of our last API call along with additional information
    this.events.subscribe('data:commandResult', (commandResult) => {
      this.commandResultText = commandResult;
      this.changeDetectorRef.detectChanges();
    });

    // Response to our requet to enumerte the scanners
    this.events.subscribe('data:enumeratedScanners', (enumeratedScanners) => {
      // Maintain two lists, the first for devices which support DW 6.5+ and shows a combo box to select
      // the scanner to use.  The second will just display the available scanners in a list and be available
      // for 6.4 and below
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
  }

  // Function to handle changes in the decoder checkboxes.  
  // Note: SET_CONFIG only available on DW 6.4+ per the docs
  public setDecoders() {
    var paramList = {
      "scanner_selection": "auto",
      "decoder_ean8": "" + this.ean8Decoder,
      "decoder_ean13": "" + this.ean13Decoder,
      "decoder_code128": "" + this.code128Decoder,
      "decoder_code39": "" + this.code39Decoder
    }
    // The "scanner_selection" parameter supports "auto" to apply to the default scanner.
    // If we have selected a different scanner we need to ensure the settings are applied
    // to the correct scanner by specifying "current-device-id".  See http://techdocs.zebra.com/datawedge/6-7/guide/api/setconfig/
    // for more information.  selectedScannerId will be >-1 if the user has chosen a specific scanner.
    if (this.selectedScannerId > -1)
    {
      paramList["current-device-id"] = "" + this.selectedScannerId;
      delete paramList["scanner_selection"];
    }
    // Set the new configuration
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
    let alert = await this.alertController.create({
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

  public async scannerSelected() {
    console.log("Requested scanner is: " + this.selectedScanner);
    let localScannerIndex = 0;
    let localScannerName = "";
    for (let scanner of this.scanners) {
      // The current scanner will be returned as SCANNER_CONNECTION_STATE
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
    // Enumerate the scanner - this will update the actual scanner in use so we do not have to worry about whether SWITCH_SCANNER succeeded
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");
  }

  playAudio()
  {
    this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
  }
  
}
