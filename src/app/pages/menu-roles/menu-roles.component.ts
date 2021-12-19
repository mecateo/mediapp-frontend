import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Rol } from '../../_model/rol';
import { RolService } from '../../_service/rol.service';
import { MenuDTO } from '../../_model/menuDTO';
import { MenuService } from '../../_service/menu.service';
import { Menu } from '../../_model/menu';
import { MenuRolDTO } from '../../_model/menuRolDTO';

@Component({
  selector: 'app-menu-roles',
  templateUrl: './menu-roles.component.html',
  styleUrls: ['./menu-roles.component.css'],
})
export class MenuRolesComponent implements OnInit {
  idRolSeleccionado: number;
  roles$: Observable<Rol[]>;
  menus$:Observable<Menu[]>;
  visualizaMenusActuales: boolean = false;
  visualizaMenusNuevos: boolean = false;
  listaMenu: Array<MenuDTO>;
  listMenu:Array<MenuDTO>;
  noTieneMenus:boolean=false;

  @ViewChild(MatSelectionList) roles: MatSelectionList;

  constructor(private rolService: RolService, private snackBar: MatSnackBar, private menuService:MenuService) {}

  ngOnInit(): void {
    this.roles$ = this.rolService.listar();
  }

  compareFunction = (o1: Menu, o2: Menu)=> o1.idMenu===o2.idMenu;

  mostrarMenuActuales(idRol: number) {
    this.rolService.listarMenusxIdRol(idRol).subscribe((respuesta) => {
      if (respuesta.length > 0) {
        this.visualizaMenusActuales = true;
        this.listaMenu = respuesta;
        this.listMenu=respuesta;
        this.menus$=null;
        this.visualizaMenusNuevos=false;
        this.noTieneMenus=false;
      } else {
        this.visualizaMenusNuevos = false;
        this.listaMenu = null;
        this.menus$=null;
        this.noTieneMenus=true;
      }
    });
  }
  asignarMenu() {
    if(!this.idRolSeleccionado){
      alert("Debe de seleccionar un rol de la lista");
    }else{
      this.visualizaMenusNuevos = true;
      this.menus$ = this.menuService.listar();
    }

  }

  onChange(change: MatSelectionListChange) {
    let seleccionado = change.options[0].selected;
    let idRol = this.idRolSeleccionado;
    let idMenu=change.options[0].value.idMenu;
    if(seleccionado){
      //agregar
      let menuRolDto = new MenuRolDTO(idRol,idMenu);
      this.menuService.grabarMenuRol(menuRolDto).subscribe(respuesta=>{
        if(respuesta==1){
          this.snackBar.open("SE REGISTRO", 'AVISO', { duration: 2000 });
        }
      });
    }else{
      //remover
      let menuRolDto = new MenuRolDTO(idRol,idMenu);
      this.menuService.quitarMenuRol(menuRolDto).subscribe(respuesta=>{
        if(respuesta==1){
          this.snackBar.open("SE QUITO EL MENU DEL ROL", 'AVISO', { duration: 2000 });
        }
      });
    }
  }
}
