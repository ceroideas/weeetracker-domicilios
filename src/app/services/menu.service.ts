import { Injectable } from '@angular/core';
import { Menu } from '../models/menu';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor( private http : HttpClient ) { }

  getMenuOpts(){
    return this.http.get<Menu[]>('/assets/data/menu.json');
  }

}
