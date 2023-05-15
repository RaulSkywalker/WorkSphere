import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  user: any = {};
  id: any;
  name: string = '';
  empleado: any = {};
  users: userModel[] = [];
  amigos: userModel[] = [];
  numAmigos: any;
  amigoIds: number[] = [];
  idAmistad: any;
  idAmigoNuevo: any;
  nombreAmigo: any;
  private baseUrl = 'http://localhost:8000/api/';
  constructor(
    private router: Router,
    private userSer: UserService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.id = localStorage.getItem('userid');
    this.userSer.getUser(this.id).subscribe((data: any) => {
      this.user = data;
      this.name = this.user.nome;
    });

    this.empleado = null;
    this.http
      .get(`${this.baseUrl}empleado/${this.id - 1}`)
      .subscribe((data: any) => {
        this.empleado = data;
        this.http
          .get(`${this.baseUrl}departamento/${this.empleado.id_departamento}`)
          .subscribe((departamento: any) => {
            this.empleado.nombre_dep = `${departamento.nombre_departamento}`;
          });
      });

    this.userSer.mostrarUsuarios(this.id).subscribe((data: any) => {
      this.users = data;
    });

    this.userSer.contarNumAmigos(this.id).subscribe((res: any) => {
      this.numAmigos = res;
    });

    this.userSer.obtenerAmigos(this.id).subscribe((response: any) => {
      this.amigos = response;
      this.amigoIds = response.map((amigo: any) => amigo.id);
    });
  }

  entablarAmistad(idUsuario: any, idAmigo: any, nombreAmigo: any) {
    this.idAmistad = idUsuario;
    this.idAmigoNuevo = idAmigo;
    this.nombreAmigo = nombreAmigo;
  }

  agregarAmigo() {
    this.userSer.agregarAmigo(this.idAmistad, this.idAmigoNuevo).subscribe();
    this.actualizar();
    document.getElementById('AmigoModal')?.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    const modalBackdrop =
      document.getElementsByClassName('modal-backdrop')[0];
    modalBackdrop.parentNode?.removeChild(modalBackdrop);

    toastr.success('Amistad entablada exitosamente');

    (error: any) => {
      console.log(error);
      toastr.error('Error al entablar la amistad');
    }
    this.ngOnInit();
  }

  esAmigo(id: number): boolean {
    return this.amigoIds.includes(id);
  }

  actualizar() {
    this.userSer.mostrarUsuarios(this.id).subscribe((data: any) => {
      this.users = data;
    });

    this.userSer.obtenerAmigos(this.id).subscribe((response: any) => {
      this.amigos = response;
      this.amigoIds = response.map((amigo: any) => amigo.id);
    });

    this.userSer.contarNumAmigos(this.id).subscribe((res: any) => {
      this.numAmigos = res;
    });

    this.cdr.detectChanges();
  }
}
