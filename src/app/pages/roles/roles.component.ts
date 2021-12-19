import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Rol } from '../../_model/rol';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolService } from '../../_service/rol.service';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../../_service/login.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  dataSource: MatTableDataSource<Rol>;
  displayedColumns: string[] = ['idrol', 'rol', 'descripcion', 'acciones'];
  cantidad: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private rolService: RolService,
    private snackBar: MatSnackBar,
    private loginService:LoginService,) { }

  ngOnInit(): void {

    this.rolService.listarPageable(0 , 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    this.rolService.getRolCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.rolService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  eliminar(id: number){
    if(this.loginService.verificarAutorizacion()){
    this.rolService.eliminar(id).pipe(switchMap( ()=> {
      return this.rolService.listar();
    }))
    .subscribe(data => {
      this.rolService.setRolCambio(data);
      this.rolService.setMensajeCambio('SE ELIMINO');
    });
  }else{
      this.loginService.cerrarSesion();
    }
  }

  filtrar(e : any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Rol[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  mostrarMas(e: any){
    this.rolService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

}
