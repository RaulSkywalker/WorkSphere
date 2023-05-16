import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { userModel } from 'src/app/models/user.model';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  private baseUrl = 'http://localhost:8000/api/';
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
  mensajeForm: FormGroup;
  id_receptor: any;
  mensajes: any = [];
  currentPage = 1;
  pageSize = 5;
  totalPages: any;

  constructor(
    private router: Router,
    private userSer: UserService,
    private menSer: MensajeService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.mensajeForm = new FormGroup({
      mensaje: new FormControl(),
    });
  }
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
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.paginateUsers();
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
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    modalBackdrop.parentNode?.removeChild(modalBackdrop);

    toastr.success('Amistad entablada exitosamente');

    (error: any) => {
      console.log(error);
      toastr.error('Error al entablar la amistad');
    };
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

  mostrarChat(id_usuario: number) {
    this.id_receptor = id_usuario;
    this.http
      .get(`${this.baseUrl}user/${id_usuario}`)
      .subscribe((data: any) => {
        this.user = data;
      });
    this.obtenerMensajes(this.id, this.id_receptor);
    this.cdr.detectChanges();
  }

  enviarMensaje() {
    const mensaje = this.mensajeForm.value.mensaje;
    const autor = this.id;
    const usuario = this.id_receptor;
    const url = `http://localhost:8000/api/addMensaje/${autor}/${usuario}`;

    this.http.post(url, { mensaje }).subscribe(() => {
      this.obtenerMensajes(autor, usuario);
      this.cdr.detectChanges();
    });
    this.mensajeForm.reset();
    this.cdr.detectChanges();
  }

  obtenerMensajes(id_autor: any, id_usuario: any) {
    id_autor = this.id;
    id_usuario = this.id_receptor;
    this.menSer.obtenerMensajes(id_autor, id_usuario).subscribe((data: any) => {
      this.mensajes = data;
      this.cdr.detectChanges();
    });
  }

  generatePageArray() {
    const pageArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageArray.push(i);
    }
    return pageArray;
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.users = this.users.slice(startIndex, endIndex);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.paginateUsers();
  }
}
