import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import { DdefaultComponent } from './ddefault/ddefault.component';
import { DrightsidebarComponent } from './drightsidebar/drightsidebar.component';
import { DregistrationComponent } from './dregistration/dregistration.component';
import { DloginComponent } from './dlogin/dlogin.component';
import { DtopbarComponent } from './dtopbar/dtopbar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DefaultComponent,
    DdefaultComponent,
    DrightsidebarComponent,
    DregistrationComponent,
    DloginComponent,
    DtopbarComponent
  ],
  imports: [CommonModule, DefaultRoutingModule, ReactiveFormsModule],
})
export class DefaultModule {}
