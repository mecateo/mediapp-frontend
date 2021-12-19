import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../_model/usuario';
import { UsuarioService } from '../../_service/usuario.service';
import { Rol } from '../../_model/rol';
import { RolService } from '../../_service/rol.service';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { UsuarioRolDTO } from '../../_model/usuarioRolDTO';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roles-usuario',
  templateUrl: './roles-usuario.component.html',
  styleUrls: ['./roles-usuario.component.css']
})
export class RolesUsuarioComponent implements OnInit {

  usuario$:Observable<Usuario[]>;
  idUsuarioSeleccionado:number;
  visualizaRolesActuales:boolean=false;
  visualizaRolesNuevos:boolean=false;
  listaRoles:Array<Rol>;
  roles$:Observable<Rol[]>;
  listRoles:Array<Rol>;

  @ViewChild(MatSelectionList) roles: MatSelectionList;

  constructor(
    private usuarioService:UsuarioService,
    private rolService:RolService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.usuario$ = this.usuarioService.listar();
  }

  mostrarRolesActuales(usuario){
    if(usuario.roles.length > 0){
      this.visualizaRolesActuales=true;
      this.listaRoles = usuario.roles;
      this.listRoles=usuario.roles;
      this.roles$=null;
      this.visualizaRolesNuevos=false;
    }
  }

  compareFunction = (o1: Rol, o2: Rol)=> o1.idRol===o2.idRol;

  asignarRoles(){
    if(!this.idUsuarioSeleccionado){
      alert("Debe de seleccionar un usuario de la lista");
    }else{
      this.visualizaRolesNuevos=true;
      this.roles$ = this.rolService.listar();
    }
  }

  onChange(change: MatSelectionListChange) {
    let idUsuario = this.idUsuarioSeleccionado;
    let idRol = change.options[0].value.idRol;
    let seleccionado = change.options[0].selected;
    if(seleccionado){
      //agregar
      let usuarioRolDTO = new UsuarioRolDTO(idUsuario, idRol);
      this.rolService.grabarUsuarioRol(usuarioRolDTO).subscribe(respuesta=>{
        if(respuesta==1){
          this.snackBar.open("SE REGISTRO", 'AVISO', { duration: 2000 });
        }
      });
    }else{
      //remover
      let usuarioRolDTO = new UsuarioRolDTO(idUsuario, idRol);
      this.rolService.quitarUsuarioRol(usuarioRolDTO).subscribe(respuesta=>{
        if(respuesta==1){
          this.snackBar.open("SE QUITO EL ROL", 'AVISO', { duration: 2000 });
        }
      });
    }

 }

}
