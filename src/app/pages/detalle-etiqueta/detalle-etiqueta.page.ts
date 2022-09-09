import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Residuo } from 'src/app/models/residuos';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Marcas } from 'src/app/models/marcas';
import { ResiduoEspecifico } from 'src/app/models/residuoEspecifico';

@Component({
  selector: 'app-detalle-etiqueta',
  templateUrl: './detalle-etiqueta.page.html',
  styleUrls: ['./detalle-etiqueta.page.scss'],
})
export class DetalleEtiquetaPage implements OnInit {

  marca: string;
  res: string;
  destino : string;
  usuario : Usuario = new Usuario();
  residuo : Residuo = new Residuo();
  estado : string;
  
  constructor(private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService) {
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.residuo = this.router.getCurrentNavigation().extras.state.residuo;
        this.cargarDatos();
      }
    });
  }

  cargarDatos() {
    this.usuarioService.cargarToken().then( usuario =>{
      this.usuario = usuario;
      this.procesarDatos();
    });
  }

  procesarDatos() {
    /*let marca: Marcas = this.usuario.marcas.find(m => m.PidMarca === this.residuo.sidMarca);
    if(marca)this.marca = marca.Nombre;
    let residuo : ResiduoEspecifico = this.usuario.residuos.find(r => r.Id === this.residuo.sidResiduoEspecifico);
    if(residuo)this.res = residuo.Nombre;
    if(this.residuo.destino == 1){
      this.destino = "Reciclaje";
    }else if(this.residuo.destino == 2){
      this.destino = "Reutilización";
    }*/
  }

  ngOnInit() {

  }

  atras() {
    this._location.back();
  }
}
