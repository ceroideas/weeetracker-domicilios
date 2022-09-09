import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
// import { QRScanner, QRScannerStatus } from '@awesome-cordova-plugins/qr-scanner/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { EventsService } from '../../../services/events.service';
import { Events } from '../../../services/events';
import { MenuController } from '@ionic/angular';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Location } from '@angular/common';

import { BarcodeProvider } from '../../../providers/barcode/barcode';

import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
  providers: [BarcodeScanner, BarcodeProvider, Device]
})
export class QrPage implements OnInit {

  user = JSON.parse(localStorage.getItem('ELuser'));
  scanSub:any;
  semitrans = false;
  scanner = false;
  error = false;

  etiqueta:string;

  timeout;

  lecturas = [];

  zebra = false;

  isCordova = this.platform.is('cordova');

  private _storage: Storage | null = null;

  /**/
  private scans = [];
  private scanners = [{ "SCANNER_NAME": "Please Wait...", "SCANNER_INDEX": 0, "SCANNER_CONNECTION_STATE": true }];
  private selectedScanner = "Please Select...";
  private selectedScannerId = -1;
  private ean8Decoder = true;   //  Model for decoder
  private ean13Decoder = true;  //  Model for decoder
  private code39Decoder = true; //  Model for decoder
  private code128Decoder = true;//  Model for decoder
  private dataWedgeVersion = "Pre 6.3. Please create & configure profile manually.  See the ReadMe for more details.";
  private availableScannersText = "Requires Datawedge 6.3+"
  private activeProfileText = "Requires Datawedge 6.3+";
  private commandResultText = "Messages from DataWedge will go here";
  private uiHideDecoders = true;
  private uiDatawedgeVersionAttention = true;
  private uiHideSelectScanner = true;
  private uiHideShowAvailableScanners = false;
  private uiHideCommandMessages = true;
  private uiHideFloatingActionButton = true;
  /**/

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  constructor(/*private qrScanner: QRScanner,*/ private barcodeScanner: BarcodeScanner, public nav: NavController, public alertCtrl: AlertController,
    public events: EventsService, public events1: Events, private menu: MenuController, public loading: LoadingController,
    private storage: Storage,
    private barcodeProvider: BarcodeProvider, public _location: Location,
    private changeDetectorRef: ChangeDetectorRef, private device: Device,
    private alertController: AlertController, private platform: Platform, private toastController: ToastController
    ) {

    this.platform.ready().then(()=>{

      //  Check manufacturer.  Exit if this app is not running on a Zebra device
      console.log(this.device.manufacturer);
      if (!this.device.manufacturer) {
        this.zebra = false;
        return this.prepareQrScanner();
      }
      console.log("Device manufacturer is: " + this.device.manufacturer);
      // if (!(this.device.manufacturer.toLowerCase().includes("zebra") || this.device.manufacturer.toLowerCase().includes("motorola solutions"))) {
      if (!localStorage.getItem('zebra')) {
        this.zebra = false;
        return this.prepareQrScanner();
      }

      this.zebra = true;

      //  Determine the version.  We can add additional functionality if a more recent version of the DW API is present
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");


      ////////////////////////////
      //  EVENT HANDLING
      ////////////////////////////

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

        this.etiqueta = scannedData;

        if (localStorage.getItem('read_type') == 'grupal') {

          if (this.validateTicket()) {

            // let lecturas = JSON.parse(localStorage.getItem('lecturas'));
            this.lecturas = await this.storage.get('lecturas');

            if (!this.lecturas) {
              this.lecturas = [];
            }

            if (this.lecturas) {
              
              let i = this.lecturas.findIndex(x=>x.values.etiqueta == this.etiqueta);

              if (i !== -1) {
                return this.alertCtrl.create({message:"La etiqueta ya se encuentra presente en ésta recogida", buttons: ["Ok"]})
                .then(a=>a.present());
              }

            }
            this.scans.unshift(this.etiqueta);
            this.scans = this.scans.filter(this.onlyUnique);
          }else{
            this.alertCtrl.create({message:"La etiqueta leida es inválida, intente nuevamente", buttons:["Ok"]}).then(a=>a.present());
          }

        }else{

          if (this.validateTicket()) {

            // let lecturas = JSON.parse(localStorage.getItem('lecturas'));
            this.lecturas = await this.storage.get('lecturas');

            if (!this.lecturas) {
              this.lecturas = [];
            }

            if (this.lecturas) {
              
              let i = this.lecturas.findIndex(x=>x.values.etiqueta == this.etiqueta);

              if (i !== -1) {
                return this.alertCtrl.create({message:"La etiqueta ya se encuentra presente en ésta recogida", buttons: ["Ok"]})
                .then(a=>a.present());
                this.nav.back();
              }

            }

            this.nav.back();
            this.events.publish('lectura',this.etiqueta);
          }else{
            this.alertCtrl.create({message:"La etiqueta leida es inválida, intente nuevamente", buttons:["Ok"]}).then(a=>a.present());
          }
        }


        //  On older devices, if a scan is received we can assume the profile was correctly configured manually
        //  so remove the yellow highlight.
        this.uiDatawedgeVersionAttention = false;

        this.changeDetectorRef.detectChanges();
      });

    })

  }

  async ngOnInit() {
    localStorage.removeItem('etiqueta');
    localStorage.removeItem('etiqueta_objeto');

    const storage = await this.storage.create();
    this._storage = storage;
  }

  validateTicket()
  {
    let sp = this.etiqueta.split("");
    let control = sp.pop();
    let sum:any = 0;

    for (var i = 0; i < sp.length; i++) {
      if (((i+1) % 2) == 1) {
        // console.log(sp[i]+' * 3');
        sum += parseInt(sp[i]) * 3;
      }else{
        // console.log(sp[i]);
        sum += parseInt(sp[i]);
      }
    }

    console.log(sum)

    if (sum == 10) {
      sum = "0";
    }else{
      sum = sum.toString().split("").pop();
    }
    this.etiqueta = sp.join('').substr(2);
    return ((10-sum).toString() == control);
  }

  ionViewDidEnter()
  {
    // setTimeout(()=>{
    //   this.prepareQrScanner();
    // },500)
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView2');
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  prepareQrScanner()
  {
    setTimeout(()=>{
      this.scanner = true;
      this.semitrans = true;
    },500)
    this.timeout = setTimeout(()=>{
      this.semitrans = false;
    },5000);

    this.barcodeScanner.scan().then(async (barcodeData) => {
      console.log('Barcode data', barcodeData);
      (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
      (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView2');

      this.etiqueta = barcodeData.text;

      if (localStorage.getItem('read_type') == 'grupal') {

          if (this.validateTicket()) {

            // let lecturas = JSON.parse(localStorage.getItem('lecturas'));
            this.lecturas = await this.storage.get('lecturas');

            if (!this.lecturas) {
              this.lecturas = [];
            }

            if (this.lecturas) {
              
              let i = this.lecturas.findIndex(x=>x.values.etiqueta == this.etiqueta);

              if (i !== -1) {
                return this.alertCtrl.create({message:"La etiqueta ya se encuentra presente en ésta recogida", buttons: ["Ok"]})
                .then(a=>a.present());
              }

            }
            this.scans.unshift(this.etiqueta);
            this.scans = this.scans.filter(this.onlyUnique);
          }else{
            this.alertCtrl.create({message:"La etiqueta leida es inválida, intente nuevamente", buttons:["Ok"]}).then(a=>a.present());
          }

        }else{ // individual

          if (this.validateTicket()) {

            // let lecturas = JSON.parse(localStorage.getItem('lecturas'));
            this.lecturas = await this.storage.get('lecturas');

            if (!this.lecturas) {
              this.lecturas = [];
            }

            if (this.lecturas) {
              
              let i = this.lecturas.findIndex(x=>x.values.etiqueta == this.etiqueta);

              if (i !== -1) {
                return this.alertCtrl.create({message:"La etiqueta ya se encuentra presente en ésta recogida", buttons: ["Ok"]})
                .then(a=>a.present());
                this.nav.back();
              }

            }

            this.nav.back();
            this.events.publish('lectura',this.etiqueta);
          }else{
            this.alertCtrl.create({message:"La etiqueta leida es inválida, intente nuevamente", buttons:["Ok"]}).then(a=>a.present());
          }
        }
    }).catch(err => {
       this.error = true;
       console.log('Error', err);
    });
  }

  ionViewWillLeave()
  {
    clearTimeout(this.timeout);
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView2');
    this.scanner = false;
    this.semitrans = false;
  }

  async buscar()
  {
    if (!this.etiqueta) {
      return false;
    }

    if (localStorage.getItem('read_type') == 'grupal') {

      if (this.validateTicket()) {

        // let lecturas = JSON.parse(localStorage.getItem('lecturas'));
        this.lecturas = await this.storage.get('lecturas');

        if (!this.lecturas) {
          this.lecturas = [];
        }

        if (this.lecturas) {
          
          let i = this.lecturas.findIndex(x=>x.values.etiqueta == this.etiqueta);

          if (i !== -1) {
            return this.alertCtrl.create({message:"La etiqueta ya se encuentra presente en ésta recogida", buttons: ["Ok"]})
            .then(a=>a.present());
          }

        }
        this.scans.unshift(this.etiqueta);
        this.scans = this.scans.filter(this.onlyUnique);
      }else{
        this.alertCtrl.create({message:"La etiqueta leida es inválida, intente nuevamente", buttons:["Ok"]}).then(a=>a.present());
      }

    }else{ // individual

      if (this.validateTicket()) {

        // let lecturas = JSON.parse(localStorage.getItem('lecturas'));
        this.lecturas = await this.storage.get('lecturas');

        if (!this.lecturas) {
          this.lecturas = [];
        }

        if (this.lecturas) {
          
          let i = this.lecturas.findIndex(x=>x.values.etiqueta == this.etiqueta);

          if (i !== -1) {
            return this.alertCtrl.create({message:"La etiqueta ya se encuentra presente en ésta recogida", buttons: ["Ok"]})
            .then(a=>a.present());
            this.nav.back();
          }

        }

        this.nav.back();
        this.events.publish('lectura',this.etiqueta);
      }else{
        this.alertCtrl.create({message:"La etiqueta leida es inválida, intente nuevamente", buttons:["Ok"]}).then(a=>a.present());
      }
    }

    this.etiqueta = null;

  }

  async groupReads()
  {
    this.nav.back();
    this.events.publish('lecturaGrupal',this.scans);
  }




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
