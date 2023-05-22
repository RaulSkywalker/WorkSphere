import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'empleados',
        component: EmpleadosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'inicio',
        component: InicioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'departamentos',
        component: DepartamentosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
