import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
// import { QRScanner, QRScannerStatus } from '@awesome-cordova-plugins/qr-scanner/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { EventsService } from '../../../services/events.service';
import { Events } from '../../../services/events';
import { ParamsService } from '../../../services/params.service';
import { MenuController } from '@ionic/angular';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Location } from '@angular/common';

import { BarcodeProvider } from '../../../providers/barcode/barcode';

import { Storage } from '@ionic/storage-angular';

import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

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

  titulo = "";

  etiqueta:string;

  timeout;

  lecturas = [];

  zebra = false;

  isCordova = this.platform.is('cordova');

  private _storage: Storage | null = null;

  public scans = [];

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  constructor(/*private qrScanner: QRScanner,*/ private nativeAudio: NativeAudio, private barcodeScanner: BarcodeScanner, public nav: NavController, public alertCtrl: AlertController,
    public events: EventsService, public events1: Events, private menu: MenuController, public loading: LoadingController,
    private storage: Storage, private params: ParamsService,
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

      this.events.subscribe('etiquetaLeida',async (data)=>{
        this.etiqueta = data;

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

        }
        else{

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

      })

    })

  }

  async ngOnInit() {
    localStorage.removeItem('etiqueta');
    localStorage.removeItem('etiqueta_objeto');

    const storage = await this.storage.create();
    this._storage = storage;

    this.params.setParam(null);
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
    if (sum == 0) {
      return ((0).toString() == control);
    }
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

      this.playAudio();

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

  //  Function to handle the floating action button onDown.  Start a soft scan.
  public fabDown() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
  }

  playAudio()
  {
    this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
  }

}
