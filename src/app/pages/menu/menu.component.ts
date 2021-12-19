import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Menu } from '../../_model/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MenuService } from '../../_service/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../../_service/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  dataSource: MatTableDataSource<Menu>;
  displayedColumns: string[] = ['idmenu', 'nombre', 'icono', 'url','acciones'];
  cantidad: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private menuService: MenuService,
    private snackBar: MatSnackBar,
    private loginService:LoginService) { }

  ngOnInit(): void {
    this.menuService.listarPageable(0 , 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    this.menuService.getMenuCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.menuService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  eliminar(id: number){
    if(this.loginService.verificarAutorizacion()){
      this.menuService.eliminar(id).pipe(switchMap( ()=> {
        return this.menuService.listar();
      }))
      .subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE ELIMINO');
      });
    }else{
      this.loginService.cerrarSesion();
    }

  }

  filtrar(e : any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Menu[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  mostrarMas(e: any){
    this.menuService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

}
