import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';
import { EmpleadoComponent } from './empleado.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { InicioComponent } from './inicio/inicio.component';
import { FooterComponent } from './footer/footer.component';
import { AmigosComponent } from './amigos/amigos.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EmpleadoComponent,
    TopbarComponent,
    SidebarComponent,
    ProfileComponent,
    InicioComponent,
    FooterComponent,
    AmigosComponent,
  ],
  imports: [
    CommonModule,
    EmpleadoRoutingModule,
    ReactiveFormsModule,
  ],
})
export class EmpleadoModule {}
