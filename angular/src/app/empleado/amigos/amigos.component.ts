import { Component, OnInit } from '@angular/core';
import { userModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css'],
})
export class AmigosComponent implements OnInit {
  id: any;
  amigos: userModel[] = [];
  idEliminar: any;
  constructor(private userSer: UserService) {}
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
}
