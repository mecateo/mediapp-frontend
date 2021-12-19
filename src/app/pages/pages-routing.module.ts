import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';
import { BuscarComponent } from './buscar/buscar.component';
import { ConsultaEspecialComponent } from './consulta-especial/consulta-especial.component';
import { ConsultaWizardComponent } from './consulta-wizard/consulta-wizard.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { EspecialidadEdicionComponent } from './especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialidadComponent } from './especialidad/especialidad.component';
import { ExamenEdicionComponent } from './examen/examen-edicion/examen-edicion.component';
import { ExamenComponent } from './examen/examen.component';
import { InicioComponent } from './inicio/inicio.component';
import { MedicoComponent } from './medico/medico.component'
import { Not403Component } from './not403/not403.component';
import { PacienteEdicionComponent } from './paciente/paciente-edicion/paciente-edicion.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ReporteComponent } from './reporte/reporte.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SignosVitalesComponent } from './signos-vitales/signos-vitales.component';
import { SignoVitalEdicionComponent } from './signos-vitales/signo-vital-edicion/signo-vital-edicion.component';
import { RolesComponent } from './roles/roles.component';
import { RolEdicionComponent } from './roles/rol-edicion/rol-edicion.component';
import { MenuComponent } from './menu/menu.component';
import { MenuEdicionComponent } from './menu/menu-edicion/menu-edicion.component';
import { RolesUsuarioComponent } from './roles-usuario/roles-usuario.component';
import { MenuRolesComponent } from './menu-roles/menu-roles.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent, canActivate: [GuardService]},
    { path: 'perfil', component: PerfilComponent},
    {
        path: 'paciente', component: PacienteComponent, children: [
            { path: 'nuevo', component: PacienteEdicionComponent },
            { path: 'edicion/:id', component: PacienteEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
      path: 'signos-vitales', component: SignosVitalesComponent, children: [
          { path: 'nuevo', component: SignoVitalEdicionComponent },
          { path: 'edicion/:id', component: SignoVitalEdicionComponent},
      ], canActivate: [GuardService]
  },
    {
        path: 'examen', component: ExamenComponent, children: [
            { path: 'nuevo', component: ExamenEdicionComponent },
            { path: 'edicion/:id', component: ExamenEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'especialidad', component: EspecialidadComponent, children: [
            { path: 'nuevo', component: EspecialidadEdicionComponent },
            { path: 'edicion/:id', component: EspecialidadEdicionComponent }
        ], canActivate: [GuardService]
    },
    { path: 'medico', component: MedicoComponent, canActivate: [GuardService]},
    { path: 'consulta', component: ConsultaComponent, canActivate: [GuardService] },
    { path: 'consulta-wizard', component: ConsultaWizardComponent, canActivate: [GuardService] },
    { path: 'consulta-especial', component: ConsultaEspecialComponent, canActivate: [GuardService] },
    { path: 'buscar', component: BuscarComponent, canActivate: [GuardService] },
    { path: 'reporte', component: ReporteComponent, canActivate: [GuardService] },
    { path: 'not-403', component: Not403Component},
    {
      path: 'roles', component: RolesComponent, children: [
          { path: 'nuevo', component: RolEdicionComponent },
          { path: 'edicion/:id', component: RolEdicionComponent }
      ], canActivate: [GuardService]
  },
  {
    path: 'menu', component: MenuComponent, children: [
        { path: 'nuevo', component: MenuEdicionComponent },
        { path: 'edicion/:id', component: MenuEdicionComponent }
    ],canActivate: [GuardService]
},
{path: 'rol-usuario', component: RolesUsuarioComponent,canActivate: [GuardService]},
{path: 'menu-rol', component: MenuRolesComponent,canActivate: [GuardService]},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
