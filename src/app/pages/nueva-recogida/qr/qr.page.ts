import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
// import { QRScanner, QRScannerStatus } from '@awesome-cordova-plugins/qr-scanner/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { EventsService } from '../../../services/events.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
  providers: [BarcodeScanner]
})
export class QrPage implements OnInit {

  user = JSON.parse(localStorage.getItem('ELuser'));
  scanSub:any;
  semitrans = false;
  scanner = false;
  error = false;

  etiqueta;

  timeout;

  constructor(/*private qrScanner: QRScanner,*/ private barcodeScanner: BarcodeScanner, public nav: NavController, public alertCtrl: AlertController,
    public events: EventsService, private menu: MenuController, public loading: LoadingController) { }

  ngOnInit() {
    this.prepareQrScanner();
    localStorage.removeItem('etiqueta');
    localStorage.removeItem('etiqueta_objeto');
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

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
      (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView2');

      this.nav.back();
      this.events.publish('lectura',barcodeData.text);
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

  buscar()
  {
    if (!this.etiqueta) {
      return false;
    }

    this.nav.back();
    this.events.publish('lectura',this.etiqueta);
  }

}
