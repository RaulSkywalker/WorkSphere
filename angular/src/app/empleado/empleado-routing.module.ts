import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmigosComponent } from './amigos/amigos.component';
import { EmpleadoComponent } from './empleado.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoComponent,
    children: [
      {
        path: 'inicio',
        component: InicioComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'amigos',
        component: AmigosComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
