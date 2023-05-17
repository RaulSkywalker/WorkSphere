import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmigosComponent } from './amigos/amigos.component';
import { EmpleadoComponent } from './empleado.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'amigos', component: AmigosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
