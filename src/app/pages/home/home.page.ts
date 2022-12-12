import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { MenuService } from '../../services/menu.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { EventsService } from 'src/app/services/events.service';
import { ConsultasService } from 'src/app/services/consultas.service';

declare var moment:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  menu: Menu[];
  menuAux: Menu[];
  submenu: boolean = false;
  navPadre = false;
  navHijo = true;
  index: number = -1;
  usuario: Usuario = new Usuario();
  titulo: string;

  pesarBtn;

  constructor(private menuService: MenuService,
    private consultas: ConsultasService,
    private router: Router,
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private events: EventsService,
    private platform : Platform) {

    if (!localStorage.getItem('todos_especificos')) {
      this.consultas.todosEspecificos().subscribe(async (data:any)=>{
        localStorage.setItem('todos_especificos',JSON.stringify(data));
      });
    }

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

    this.pesarBtn = this.usuario.direccionTercero.pesado > 0;
    this.titulo = this.usuario.tercero.Nombre;
    // console.log(this.usuario.responsabilidades);
    this.menuService.getMenuOpts().subscribe(res => {
      this.menu = res;
      this.menuAux = this.menu;
    });
  }

  tienePermiso(menu: Menu) {
    /*for (let i = 0; i < this.usuario.perfiles.length; i++) {
      if (menu.SidPerfil.includes(this.usuario.perfiles[i].SidPerfil)) {
        return true;
      }
    }*/
    return false;
    // return true;
  }

  navegar(menu: Menu, index: number) {
    if (this.index === -1) this.index = index;
    if (menu.Children) {
      this.menu = menu.Children;
      this.navPadre = !this.navPadre;
      this.navHijo = !this.navHijo;
      this.submenu = true;
    } else {
   //   this.router.navigate([menu.RedirecTo], { queryParams: { nombrePagina: menu.Name } });
      let navigationExtras: NavigationExtras = {
        state: {
          nombrePagina: menu.Name
        }
      };
      this.router.navigate([menu.RedirecTo], navigationExtras);
    }
  }

  navegarPadre() {
    this.menu = this.menuAux;
    this.navPadre = !this.navPadre;
    this.navHijo = !this.navHijo;
    this.submenu = false;
    this.index = -1;
  }

  navegarHijo() {
    this.menu = this.menuAux[this.index].Children;
    this.navPadre = !this.navPadre;
    this.navHijo = !this.navHijo;
  }

  async logOut() {

    let name_logs = moment().format('YYMMDDHHmmss')+'_'+String(this.usuario.terminal).padStart(4, '0')+'_LOG.txt';

    this.usuarioService.eliminarToken();
    this.navCtrl.navigateRoot("/login");
    localStorage.removeItem('centro');
    this.events.publish('loadPostLogout');
    
    let result = await this.consultas.uploadLog(name_logs,'/Logs');
  }

}
