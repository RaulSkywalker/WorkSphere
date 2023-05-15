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
  fechaFormateada: any;
  constructor(private router: Router, private userSer: UserService) {}
  ngOnInit(): void {
    this.userSer.getUser(1).subscribe((data: any) => {
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
}
