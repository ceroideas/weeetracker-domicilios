import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Location } from '@angular/common';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.page.html',
  styleUrls: ['./cambio-password.page.scss'],
})
export class CambioPasswordPage implements OnInit {

  titulo = "CAMBIAR CONTRASEÑA";
  myForm: FormGroup;
  usuario: Usuario = new Usuario();

  constructor(
    private usuarioService: UsuarioService,
    public consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

    this.myForm = this.fb.group({
      id: [''],
      ActualPassword: ['',Validators.required],
      Password: ['',Validators.required],
      RepeatPassword: ['',Validators.required],
    });

    this.cargarUsuario();
  }

  ngOnInit() {
  }

  async cargarUsuario()
  {
    this.usuario = await this.usuarioService.cargarToken();
    console.log(this.usuario);

    this.myForm.patchValue({id:this.usuario.id});
  }

  cambioPassword()
  {
    if (this.myForm.value.Password != this.myForm.value.RepeatPassword) {
      return this.alertCtrl.create({message:"Las contraseñas no coinciden.", buttons: ['Ok']}).then(a=>a.present());
    }
    this.loadingCtrl.create().then(l=>{
      l.present();

      this.consultaService.changePassword(this.myForm.value).subscribe(data=>{
        l.dismiss();

        this.myForm.patchValue({ActualPassword: "",Password: "",RepeatPassword: ""});

        return this.alertCtrl.create({message:"Se ha cambiado la contraseña correctamente.", buttons: ['Ok']}).then(a=>a.present());

      },err=>{
        l.dismiss();
        return this.alertCtrl.create({message:"Ha ocurrido un error al procesar la solicitud.", buttons: ['Ok']}).then(a=>a.present());
      })
    });
  }

  atras() {
    this._location.back();
  }

}
