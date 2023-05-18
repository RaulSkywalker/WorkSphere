import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  id: any;
  numAmigos: any;
  fechaFormateada: any;
  updateForm: FormGroup;
  selectedImage: File;

  constructor(private router: Router, private userSer: UserService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.updateForm = this.fb.group({
      uname: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.id = localStorage.getItem('userid')
    this.userSer.getUser(this.id).subscribe((data: any) => {
      this.user = data;
      const fechaBaseDatos = this.user.created_at;
      const formatoFechaHora = 'YYYY-MM-DD HH:mm:ss';
      const fechaMoment = moment(fechaBaseDatos, 'YYYY-MM-DD HH:mm:ss');
      this.fechaFormateada = fechaMoment.format(formatoFechaHora);
    });

    this.userSer.contarNumAmigos(this.id).subscribe((res: any) => {
      this.numAmigos = res;
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }

  updateUser() {
    const formData = new FormData();
    formData.append('id', this.id);

    if (this.updateForm.get('uname').dirty) {
      formData.append('name', this.updateForm.get('uname').value);
    } else {
      formData.append('name', this.user.name);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    this.userSer.updateUser(formData).subscribe((res) => {

      this.userSer.getUser(this.id).subscribe((data: any) => {
        this.user = data;
      });
      this.cdr.detectChanges();
      document.getElementById('UpdateModal')?.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
      const modalBackdrop =
        document.getElementsByClassName('modal-backdrop')[0];
      modalBackdrop.parentNode?.removeChild(modalBackdrop);
      toastr.success('Modificado con éxito');
      location.reload();
    });;
  }

  deleteAccount() {
    this.userSer.deleteUser(this.id).subscribe();
    document.getElementById('DeleteModal')?.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    modalBackdrop.parentNode?.removeChild(modalBackdrop);
    this.router.navigateByUrl('/');
  }

  onSelectImage(event) {
    var temppath = URL.createObjectURL(event.target.files[0]);
    $("#AddUserImage").fadeIn("fast").attr("src", temppath);
    this.selectedImage = <File>event.target.files[0];
  }
}
