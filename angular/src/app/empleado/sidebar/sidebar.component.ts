import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  user: any = {};
  id: any;
  
  constructor(private router: Router, private userSer: UserService) { }
  
  ngOnInit(): void {
    this.id = localStorage.getItem('userid');
    this.userSer.getUser(this.id).subscribe((data: any) => {
      this.user = data;
    });
  }

  /**
   * Método para cerrar la sesión del usuario
   */
  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }
}
