import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoVitalService } from '../../../_service/signo-vital.service';
import { SignoVital } from '../../../_model/signoVital';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogoComponent } from '../paciente-dialogo/paciente-dialogo.component';
import { LoginService } from '../../../_service/login.service';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css'],
})
export class SignoVitalEdicionComponent implements OnInit {
  id: number = 0;
  form: FormGroup;
  edicion: boolean = false;
  maxFecha: Date = new Date();
  pacientes$: Observable<Paciente[]>;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private signoVitalService: SignoVitalService,
    private dialog: MatDialog,
    private loginService:LoginService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(0),
      idPaciente: new FormControl(0),
      fechaSeleccionada: new FormControl(new Date()),
      temperatura: new FormControl(''),
      pulso: new FormControl(''),
      ritmo: new FormControl(''),
    });
    if(this.loginService.verificarAutorizacion()){
    this.pacientes$ = this.pacienteService.listar();
    this.route.params.subscribe((data) => {
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
      this.signoVitalService.listarPorId(this.id).subscribe(data=>{
        this.form = new FormGroup({
          id: new FormControl(data.idSignoVital),
          idPaciente: new FormControl(data.paciente.idPaciente),
          fechaSeleccionada: new FormControl(data.fecha),
          temperatura: new FormControl(data.temperatura),
          pulso: new FormControl(data.pulso),
          ritmo: new FormControl(data.ritmoRespiratorio),
        });
      });
    }
  }

  grabar() {
    console.log("verificar:",this.loginService.verificarAutorizacion());
    if(this.loginService.verificarAutorizacion()){
    let signovital = new SignoVital();
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['idPaciente'];
    signovital.idSignoVital = this.form.value['id'];
    signovital.paciente = paciente;
    signovital.fecha = this.form.value['fechaSeleccionada'];
    signovital.temperatura = this.form.value['temperatura'];
    signovital.pulso = this.form.value['pulso'];
    signovital.ritmoRespiratorio = this.form.value['ritmo'];
    if (this.edicion) {
      this.signoVitalService.modificar(signovital).pipe(switchMap(()=>{
        return this.signoVitalService.listar();
      })).subscribe(data=>{
        this.signoVitalService.setSignoVitalCambio(data);
        this.signoVitalService.setMensajeCambio('SE MODIFICO');
      });
    } else {
      //REGISTRAR
      this.signoVitalService
        .registrar(signovital)
        .pipe(
          switchMap(() => {
            return this.signoVitalService.listar();
          })
        )
        .subscribe((data) => {
          this.signoVitalService.setSignoVitalCambio(data);
          this.signoVitalService.setMensajeCambio('SE REGISTRO');
        });
    }
    this.router.navigate(['/pages/signos-vitales']);
   }else{
     this.loginService.cerrarSesion();
   }
  }

  agregarPaciente(paciente?:Paciente){
    if(this.loginService.verificarAutorizacion()){
      this.dialog.open(PacienteDialogoComponent, {
        width: '350px',
        data: paciente,
      }).afterClosed().pipe( switchMap((data1) => {
        return this.pacienteService.listar();
      })).subscribe(data1=>{
        this.pacientes$ = this.pacienteService.listar();
      });
    }else{
      this.loginService.cerrarSesion();
    }

  }
}
