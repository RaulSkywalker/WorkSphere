import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'inicio', component: InicioComponent },
      { path: 'departamentos', component: DepartamentosComponent },
      { path: 'profile', component: ProfileComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
