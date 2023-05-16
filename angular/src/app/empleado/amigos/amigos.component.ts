import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { userModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MensajeService } from 'src/app/services/mensaje.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css'],
})
export class AmigosComponent implements OnInit {
  id: any;
  amigos: userModel[] = [];
  amigo: any = {};
  idEliminar: any;
  mensajeForm: FormGroup;
  id_receptor: any;
  mensajes: any = [];
  private baseUrl = 'http://localhost:8000/api/';
  constructor(private userSer: UserService, private menSer: MensajeService, private http: HttpClient,
    private cdr: ChangeDetectorRef) {
      this.mensajeForm = new FormGroup({
      mensaje: new FormControl(),
    });
    }
  ngOnInit(): void {
    this.id = localStorage.getItem('userid');
    this.userSer.obtenerAmigos(this.id).subscribe((response: any) => {
      this.amigos = response;
    });
  }

  seleccionarEliminar(id: any) {
    this.idEliminar = id;
  }

  confirmarBorrado() {
    this.userSer.eliminarAmigo(this.id, this.idEliminar).subscribe(
      () => {
        this.userSer.obtenerAmigos(this.id).subscribe((response: any) => {
          this.amigos = response;
        });

        document.getElementById('DeleteModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
        document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Amistad finalizada exitosamente');
      },
      (error) => {
        console.log(error);
        toastr.error('Error al finalizar la amistad');
      }
    );
  }

    mostrarChat(id_usuario: number) {
    this.id_receptor = id_usuario;
    this.http
      .get(`${this.baseUrl}user/${id_usuario}`)
      .subscribe((data: any) => {
        this.amigo = data;
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
}
