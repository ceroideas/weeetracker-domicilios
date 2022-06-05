import { Component, OnInit, ViewChild } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SignaturePad } from 'angular2-signaturepad';
import { LoadingController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.page.html',
  styleUrls: ['./firma.page.scss'],
})
export class FirmaPage implements OnInit {

  @ViewChild(SignaturePad) public signaturePad:SignaturePad;
  loading : any;
  usuario : Usuario = new Usuario();

  constructor(private screenOrientation : ScreenOrientation,
              private loadingCtrl : LoadingController,
              private modalCtrl : ModalController,
              private usuarioService : UsuarioService) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.cargarUsuario();
  }

  public signatureImage: string;

  ngOnInit() {
    setTimeout(() =>{
      this.loading.dismiss();
    }, 1000 );

    this.presentLoading('Cargando...');
  }

  ngAfterViewInit(){
    setTimeout(async () => {
      this.canvasResize();
    }, 1000);
   }
  
  ionViewWillLeave(){
    //this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  async presentLoading( message: string) {
    this.loading = await this.loadingCtrl.create({
      message
     });
     await this.loading.present();
   }

  canvasResize(){
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }
  
   signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
     'minWidth': 2,
     'canvasWidth': 340,
     'canvasHeight': 200
   };
  
   drawComplete(){
     this.signatureImage = this.signaturePad.toDataURL();
     this.screenOrientation.unlock();
     this.modalCtrl.dismiss({
       img : this.signatureImage
    });
   }
  
   drawClear(){
     this.signaturePad.clear();
   }

   async cargarUsuario(){
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);
   }

}
