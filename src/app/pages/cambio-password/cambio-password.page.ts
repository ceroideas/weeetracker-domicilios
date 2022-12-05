import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  validation_messages: any;

  constructor(
    private usuarioService: UsuarioService,
    public consultaService: ConsultasService,
    private _location: Location,
    private nav: NavController,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

    this.validation_messages = {
      'Password': [
        { type: 'required', message: ''},
        { type: 'pattern', message: 'La contraseña debe tener al menos 8 caracteres, letras, numeros y 1 MAYÚSCULA' }
      ],
      'RepeatPassword': [
        { type: 'required', message: ''},
        { type: 'pattern', message: 'La contraseña debe tener al menos 8 caracteres, letras, numeros y 1 MAYÚSCULA' }
      ],
    };

    this.myForm = this.fb.group({
      id: new FormControl(''),
      ActualPassword: new FormControl('',Validators.required),
      Password: new FormControl('',Validators.compose(
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        ])),
      RepeatPassword: new FormControl('',Validators.compose(
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        ])),
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
        return this.alertCtrl.create({message:"La contraseña actual ingresada es incorrecta.", buttons: ['Ok']}).then(a=>a.present());
      })
    });
  }

  atras() {
    this._location.back();
  }

}
