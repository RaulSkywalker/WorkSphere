import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  id: any;
  fechaFormateada: any;
  constructor(private router: Router, private userSer: UserService) {}
  ngOnInit(): void {
    this.id = localStorage.getItem('userid')
    this.userSer.getUser(this.id).subscribe((data: any) => {
      this.user = data;
      const fechaBaseDatos = this.user.created_at;
      const formatoFechaHora = 'YYYY-MM-DD HH:mm:ss';
      const fechaMoment = moment(fechaBaseDatos, 'YYYY-MM-DD HH:mm:ss');
      this.fechaFormateada = fechaMoment.format(formatoFechaHora);
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
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
}
