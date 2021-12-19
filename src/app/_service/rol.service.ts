import { Injectable } from '@angular/core';
import { Rol } from '../_model/rol';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';
import { UsuarioRolDTO } from '../_model/usuarioRolDTO';
import { MenuDTO } from '../_model/menuDTO';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol>{

  private rolCambio: Subject<Rol[]> = new Subject<Rol[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/roles`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getRolCambio(){
    return this.rolCambio.asObservable();
  }

  setRolCambio(lista: Rol[]){
    this.rolCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(msj: string){
    this.mensajeCambio.next(msj);
  }

  grabarUsuarioRol(usuarioRol:UsuarioRolDTO){
    return this.http.post(`${this.url}/agregarUsuarioRol`,usuarioRol);
  }

  quitarUsuarioRol(usuarioRol:UsuarioRolDTO){
    return this.http.post(`${this.url}/quitarUsuarioRol`,usuarioRol);
  }

  listarMenusxIdRol(idRol:number){
    return this.http.get<MenuDTO[]>(`${this.url}/obtenerMenuPorIdRol/${idRol}`);
  }
}
