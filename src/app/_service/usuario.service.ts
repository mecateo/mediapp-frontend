import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Usuario } from '../_model/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{

  private usuarioCambio: Subject<Usuario[]> = new Subject<Usuario[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/usuarios`);
  }

  getUsuarioCambio(){
    return this.usuarioCambio.asObservable();
  }

  setUsuarioCambio(lista: Usuario[]){
    this.usuarioCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(msj: string){
    this.mensajeCambio.next(msj);
  }
}
