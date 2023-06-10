import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ViewChild } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-dlogin',
  templateUrl: './dlogin.component.html',
  styleUrls: ['./dlogin.component.css'],
})
export class DloginComponent {
  loginForm: FormGroup;
  loginError: boolean = false;
  @Output() loginSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private userSer: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl(''),
    });
  }

  /**
   * Método encargado de realizar el login del usuario en la aplicación.
   */
  login() {
    if (this.loginForm.valid) {
      const formdata = new FormData();
      formdata.append('email', this.loginForm.get('email')?.value);
      formdata.append('password', this.loginForm.get('pass')?.value);
      this.userSer.login(formdata).subscribe(
      
        (res) => {
          var r: any = res;
          localStorage.setItem('user', r.user);
          localStorage.setItem('userid', r.user.id);
          document.getElementById('LoginModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
          const modalBackdrop =
            document.getElementsByClassName('modal-backdrop')[0];
          modalBackdrop.parentNode?.removeChild(modalBackdrop);
          if (r.role === 'admin') {
            this.router.navigateByUrl('admin/inicio');
          } else if (r.role === 'empleado') {
            this.router.navigateByUrl('empleado/inicio');
          }
        },
        (error) => {
          this.loginError = true;
          this.loginForm.reset();
        }
      );
    } else {
      toastr.error('Debes introducir tus datos para poder iniciar sesión.');
    }
  }
}
