import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../_model/menu';
import { GenericService } from './generic.service';
import { MenuRolDTO } from '../_model/menuRolDTO';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  private menuCambio = new Subject<Menu[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/menus`);
  }

  listarPorUsuario(nombre: string) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.post<Menu[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  getMenuCambio() {
    return this.menuCambio.asObservable();
  }

  setMenuCambio(menus: Menu[]) {
    this.menuCambio.next(menus);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(msj: string){
    this.mensajeCambio.next(msj);
  }

  grabarMenuRol(menuRol:MenuRolDTO){
    return this.http.post(`${this.url}/agregarMenuRol`,menuRol);
  }

  quitarMenuRol(menuRol:MenuRolDTO){
    return this.http.post(`${this.url}/quitarMenuRol`,menuRol);
  }

}
