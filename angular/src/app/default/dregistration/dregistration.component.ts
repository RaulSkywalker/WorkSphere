import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import toastr from 'toastr';

@Component({
  selector: 'app-dregistration',
  templateUrl: './dregistration.component.html',
  styleUrls: ['./dregistration.component.css'],
})
export class DregistrationComponent {
  registerForm: FormGroup;
  selectedImage: File = null;

  constructor(private userSer: UserService, private fb: FormBuilder, private router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required),
      rpass: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      fecha_nacim: new FormControl('', Validators.required),
      fecha_incorp: new FormControl('', Validators.required),
      id_departamento: new FormControl('', Validators.required),
    });
  }

  registrar() {
    if (
      this.registerForm.get('pass')?.value !=
      this.registerForm.get('rpass')?.value
    ) {
      toastr.error('Las contraseñas no coinciden');
    } else {
      if (this.registerForm.valid) {
        const formdata = new FormData();
        formdata.append('name', this.registerForm.get('name')?.value);
        formdata.append('apellido', this.registerForm.get('apellido')?.value);
        formdata.append('email', this.registerForm.get('email')?.value);
        formdata.append('password', this.registerForm.get('pass')?.value);
        formdata.append('telefono', this.registerForm.get('telefono')?.value);
        formdata.append(
          'fecha_nacim',
          this.registerForm.get('fecha_nacim')?.value
        );
        formdata.append(
          'fecha_incorp',
          this.registerForm.get('fecha_incorp')?.value
        );
        formdata.append(
          'id_departamento',
          this.registerForm.get('id_departamento')?.value
        );
        formdata.append('image', this.selectedImage);
        this.userSer.register(formdata).subscribe((res) => {
          toastr.success('Registrado con éxito');
          document.getElementById('RegisterModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
          const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
          modalBackdrop.parentNode?.removeChild(modalBackdrop);
        }); 
      }
      else {
        toastr.error('Debes rellenar todos los campos.');
      }
    }
  }

  onSelectImage(event) {
    var temppath = URL.createObjectURL(event.target.files[0]);
    $("#AddUserImage").fadeIn("fast").attr("src", temppath);
    this.selectedImage=<File>event.target.files[0];
  }
}
