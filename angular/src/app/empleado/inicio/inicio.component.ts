import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { userModel } from 'src/app/models/user.model';
import { MensajeService } from 'src/app/services/mensaje.service';
import { TareaService } from 'src/app/services/tarea.service';
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
  usuariosPaginados: userModel[] = [];
  amigos: userModel[] = [];
  numAmigos: any;
  amigoIds: number[] = [];
  idAmistad: any;
  idAmigoNuevo: any;
  nombreAmigo: any;
  mensajeForm: FormGroup;
  id_receptor: any;
  mensajes: any = [];
  paginaActual = 1;
  tamanioPag = 5;
  paginasTotales: any;
  tareas: any = [];

  constructor(
    private userSer: UserService,
    private menSer: MensajeService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private tarSer: TareaService
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
      this.paginasTotales = Math.ceil(this.users.length / this.tamanioPag);
      this.paginarUsuarios();
    });

    this.userSer.contarNumAmigos(this.id).subscribe((res: any) => {
      this.numAmigos = res;
    });

    this.userSer.obtenerAmigos(this.id).subscribe((response: any) => {
      this.amigos = response;
      this.amigoIds = response.map((amigo: any) => amigo.id);
    });

    this.tarSer.getTareasByEmpleado(this.id - 1).subscribe(
      (response) => {
        this.tareas = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Este método es el encargado de recoger por parámetro ciertos valores que
   * serán necesarios a la hora de entablar una amistad.
   * @param idUsuario
   * @param idAmigo
   * @param nombreAmigo
   */
  entablarAmistad(idUsuario: any, idAmigo: any, nombreAmigo: any) {
    this.idAmistad = idUsuario;
    this.idAmigoNuevo = idAmigo;
    this.nombreAmigo = nombreAmigo;
  }

  /**
   * Método encargado de acceder a la API del back-end para añadir a un usuario
   * como amigo en la plataforma.
   */
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

  /**
   * Método encargado de comprobar si un usuario de la
   * lista ya es amigo del usuario actual.
   * @param id
   * @returns
   */
  esAmigo(id: number): boolean {
    return this.amigoIds.includes(id);
  }

  /**
   * Método encargado de actualizar y refrescar los datos de la página,
   * con el fin de que siempre estén correctamente.
   */
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

  /**
   * Este método se encarga de mostrar el modal del chat con el usuario
   * cuyo id se ha pasado por parámetro.
   * @param id_usuario
   */
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

  /**
   * Este método envía un mensaje en el chat, especificando
   * quién es el autor, y quién el receptor.
   */
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

  /**
   * Este método accede a la base de datos para traer todos los mensajes
   * previos correspondientes a una determinada conversación del chat.
   * @param id_autor
   * @param id_usuario
   */
  obtenerMensajes(id_autor: any, id_usuario: any) {
    id_autor = this.id;
    id_usuario = this.id_receptor;
    this.menSer.obtenerMensajes(id_autor, id_usuario).subscribe((data: any) => {
      this.mensajes = data;
      this.cdr.detectChanges();
    });
  }

  /**
   * Este método se encarga de generar el numero de páginas total para la lista de usuarios.
   * @returns paginas
   */
  generarPaginacion() {
    const paginas = [];
    for (let i = 1; i <= this.paginasTotales; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  /**
   * Método encargado de realizar la paginación para el listado de usuarios.
   */
  paginarUsuarios(): void {
    const inicio = (this.paginaActual - 1) * 5;
    const fin = inicio + 5;
    this.usuariosPaginados = this.users.slice(inicio, fin);
  }

  /**
   * Método encargado de cambiar de página, y volver a paginar.
   * @param numPagina
   */
  onCambioPagina(numPagina: number): void {
    this.paginaActual = numPagina;
    this.paginarUsuarios();
  }
}
