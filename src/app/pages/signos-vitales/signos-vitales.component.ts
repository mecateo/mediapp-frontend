import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SignoVital } from 'src/app/_model/signoVital';
import { SignoVitalService } from '../../_service/signo-vital.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../../_service/login.service';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  dataSource: MatTableDataSource<SignoVital>;
  displayedColumns: string[] = ['idSignoVital','paciente', 'fecha', 'temperatura', 'pulso', 'ritmoRespiratorio','acciones'];
  cantidad: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private signoVitalService:SignoVitalService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private loginService:LoginService,
    ) { }

  ngOnInit(): void {
   this.signoVitalService.listar().subscribe(data => {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  });

   this.signoVitalService.getSignoVitalCambio().subscribe(data => {
    this.crearTabla(data);
  });

  this.signoVitalService.getMensajeCambio().subscribe(data => {
    this.snackBar.open(data, 'AVISO', {
      duration: 2000
    });
  });
  }

  filtrar(e : any){
    this.dataSource.filter=e.target.value.trim().toLowerCase();
  }

  eliminar(id:number){
    if(this.loginService.verificarAutorizacion()){
      this.signoVitalService.eliminar(id).pipe(switchMap(()=>{
        return this.signoVitalService.listar();
      })).subscribe(data=>{
        this.signoVitalService.setSignoVitalCambio(data);
        this.signoVitalService.setMensajeCambio('SE ELIMINO');
      });
    }else{
      this.loginService.cerrarSesion();
    }
  }

  mostrarMas(e:any){}

  crearTabla(data: SignoVital[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
