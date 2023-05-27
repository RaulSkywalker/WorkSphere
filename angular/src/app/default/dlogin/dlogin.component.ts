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

@Component({
  selector: 'app-dlogin',
  templateUrl: './dlogin.component.html',
  styleUrls: ['./dlogin.component.css'],
})
export class DloginComponent {
  loginForm: FormGroup;

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
      if (this.userSer.login(formdata)) {
        setTimeout(() => {
          document.getElementById('LoginModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
          const modalBackdrop =
            document.getElementsByClassName('modal-backdrop')[0];
          modalBackdrop.parentNode?.removeChild(modalBackdrop);
        }, 1000);
      }
    } else {
      toastr.error('Debes introducir tus datos para poder iniciar sesión.');
    }
  }
}
