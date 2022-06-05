import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LectorService {

  texto:string;
  
  constructor(private barcodeScanner: BarcodeScanner, private toastCtrl : ToastController) { }

  async scan(tipo:string){
   await this.barcodeScanner.scan().then(barcodeData => {

    this.texto = barcodeData.text;
    switch (tipo) {
      case 'etiqueta':
        if(!this.texto.match("([0-9]{2})18410708[0-9]{9}([0-9]{1})")){
          this.texto = "error";
        }else{
          this.texto = this.texto.substring(2,this.texto.length);
          this.texto = this.texto.substring(0,this.texto.length-1);
        } 
        break;
      default:
        if(this.texto.match("([0-9]{2})18410708[0-9]{9}([0-9]{1})")){
          this.texto = "error";
        }
        break;
    }
     }).catch(err => {
         console.log('Error', err);
        // this.texto = "no cordova";
     });
         return this.texto;
  }

}
