import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paciente } from '../../../_model/paciente';
import { PacienteService } from '../../../_service/paciente.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente:Paciente;
  id: number = 0;
  form: FormGroup;

  constructor( private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private dataPaciente: Paciente,
    private pacienteService : PacienteService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
      'email': new FormControl('')
    });
    this.paciente = { ...this.dataPaciente };
  }

  grabar(){
    //let paciente = new Paciente();
    this.paciente.idPaciente = this.form.value['id']; //this.form.get('idPaciente').value;
    this.paciente.nombres = this.form.value['nombres'];
    this.paciente.apellidos = this.form.value['apellidos'];
    this.paciente.dni = this.form.value['dni'];
    this.paciente.telefono = this.form.value['telefono'];
    this.paciente.direccion = this.form.value['direccion'];
    this.paciente.email = this.form.value['email'];

    this.pacienteService.registrar(this.paciente).pipe(switchMap(() => {
      return this.pacienteService.listar();
    }))
    .subscribe(data => {
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajeCambio('SE REGISTRO');
    });
    this.dialogRef.close(this.pacienteService.listar());
  }

  cerrar() {
    this.dialogRef.close();
  }

}
