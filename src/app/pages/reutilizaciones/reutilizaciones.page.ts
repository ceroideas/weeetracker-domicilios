import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { Location } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { EventsService } from 'src/app/services/events.service';
import { ConsultasService } from 'src/app/services/consultas.service';

declare var moment:any;

@Component({
  selector: 'app-reutilizaciones',
  templateUrl: './reutilizaciones.page.html',
  styleUrls: ['./reutilizaciones.page.scss'],
})
export class ReutilizacionesPage implements OnInit {

  menu: Menu[];
  menuAux: Menu[];
  submenu: boolean = false;
  navPadre = false;
  navHijo = true;
  index: number = -1;
  usuario: Usuario = new Usuario();
  titulo: string;

  pesarBtn;

  constructor(private _location: Location, private menuService: MenuService,
    private consultas: ConsultasService,
    private router: Router,
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private events: EventsService,
    private platform : Platform) {

  }

  ngOnInit() {
    this.cargarDatos();
    localStorage.removeItem('lecturas');
  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
    if (!this.usuario) {
      this.navCtrl.navigateRoot("/login");
      setTimeout(()=>{
        return this.events.publish('setLoaded');
      },50)
    }

    this.titulo = this.usuario.tercero.Nombre;
    // console.log(this.usuario.responsabilidades);
    this.menuService.getMenuOpts().subscribe(res => {
      this.menu = res;
      this.menuAux = this.menu;
    });
  }

  atras()
  {
    this._location.back();
  }

}
