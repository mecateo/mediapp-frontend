import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../_service/menu.service';
import { Menu } from '../../../_model/menu';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../../../_service/login.service';

@Component({
  selector: 'app-menu-edicion',
  templateUrl: './menu-edicion.component.html',
  styleUrls: ['./menu-edicion.component.css']
})
export class MenuEdicionComponent implements OnInit {

  id: number = 0;
  edicion: boolean = false;
  form: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private loginService:LoginService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'icono': new FormControl(''),
      'url': new FormControl(''),
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
      this.menuService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idMenu),
          'nombre': new FormControl(data.nombre),
          'icono': new FormControl(data.icono),
          'url': new FormControl(data.url),
        });
      });
    }
  }

  operar() {
    if(this.loginService.verificarAutorizacion()){
    let menu = new Menu();
    menu.idMenu= this.form.value['id'];
    menu.nombre= this.form.value['nombre'];
    menu.icono=this.form.value['icono'];
    menu.url=this.form.value['url'];
    if(!menu.url.startsWith('/pages/')){
      return this.menuService.setMensajeCambio(`La Url debe empezar por /pages/`);
    }

    if(this.edicion){
      this.menuService.modificar(menu).pipe(switchMap(()=>{
        return this.menuService.listar();
      })).subscribe(data=>{
        this.menuService.setMenuCambio(data);
          this.menuService.setMensajeCambio('SE MODIFICO');
      })
    }else{
      this.menuService.registrar(menu).pipe(switchMap(()=>{
        return this.menuService.listar();
      })).subscribe(data=>{
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE REGISTRO');
      })
    }
    this.router.navigate(['/pages/menu']);
    }else{
      this.loginService.cerrarSesion();
    }
  }



}
