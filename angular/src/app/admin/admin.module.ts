import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './inicio/inicio.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AdminComponent,
    EmpleadosComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    InicioComponent,
    DepartamentosComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
