import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
import { Coordenada } from '../models/identificacion';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {

  coordenada : Coordenada = new Coordenada();

  constructor(private geolocation:Geolocation) { }

  async getGeolocation(){

    await this.geolocation.getCurrentPosition({timeout : 3500 }).then((geoposition : Geoposition) =>{
      this.coordenada.Latitud = geoposition.coords.latitude;
      this.coordenada.Longitud = geoposition.coords.longitude;
      return this.coordenada;
    }).catch(()=>{
      this.coordenada.Latitud = 0;
      this.coordenada.Longitud = 0
      return this.coordenada;
    });

  }

}
