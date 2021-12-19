import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolService } from '../../../_service/rol.service';
import { Rol } from '../../../_model/rol';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../../../_service/login.service';

@Component({
  selector: 'app-rol-edicion',
  templateUrl: './rol-edicion.component.html',
  styleUrls: ['./rol-edicion.component.css']
})
export class RolEdicionComponent implements OnInit {

  id: number = 0;
  edicion: boolean = false;
  form: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private rolService: RolService,
    private loginService:LoginService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id': new FormControl(0),
      'rol': new FormControl(''),
      'descripcion': new FormControl(''),
    });
    if(this.loginService.verificarAutorizacion()){
      this.route.params.subscribe(data => {
        this.id = data['id'];
        this.edicion = data['id'] != null;
        this.initForm();
      });
    }else{
      this.loginService.cerrarSesion();
    }
  }

  initForm() {
    if (this.edicion) {
      this.rolService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idRol),
          'rol': new FormControl(data.nombre),
          'descripcion': new FormControl(data.descripcion),
        });
      });
    }
  }

  operar() {
    if(this.loginService.verificarAutorizacion()){
    let rol = new Rol();
    rol.idRol= this.form.value['id'];
    rol.nombre=this.form.value['rol'];
    rol.descripcion = this.form.value['descripcion'];

    if(this.edicion){
      this.rolService.modificar(rol).pipe(switchMap(()=>{
        return this.rolService.listar();
      })).subscribe(data=>{
        this.rolService.setRolCambio(data);
          this.rolService.setMensajeCambio('SE MODIFICO');
      })
    }else{
      this.rolService.registrar(rol).pipe(switchMap(() => {
        return this.rolService.listar();
      }))
      .subscribe(data => {
        this.rolService.setRolCambio(data);
        this.rolService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.router.navigate(['/pages/roles']);
    }else{
      this.loginService.cerrarSesion();
    }
  }

}
