import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
})
export class TareasComponent implements OnInit {
  id: any;
  tareas: any;
  tarea: any = {};
  idSeleccionado: any;

  constructor(private tarSer: TareaService, private http: HttpClient) {}
  ngOnInit(): void {
    this.id = localStorage.getItem('userid');
    this.tarSer.getTareasByEmpleado(this.id - 1).subscribe(
      (response) => {
        this.tareas = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  verDetallesTarea(id: any) {
    this.tarea = null;
    this.tarSer.getTarea(id).subscribe((response) => {
      this.tarea = response;
    });
  }

  marcarParaActualizar(id: any) {
    this.idSeleccionado = id;
  }

  cambiarEstado() {
    const tareaId = this.idSeleccionado;
    const formData = new FormData();
    formData.append('estado', 'No comenzada');

    this.tarSer.updateTarea(tareaId, formData).subscribe(
      (response) => {
        this.tarSer.getTareas().subscribe(
          (response) => {
            this.tareas = response;
          },
          (error) => {
            console.log(error);
          }
        );

        document.getElementById('ChangeStatusModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Estado cambiado con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al cambiar el estado de la tarea');
      }
    );
  }

  marcarParaEliminar(id: any) {
    this.idSeleccionado = id;
  }

  eliminarTarea() {
    this.tarSer.deleteTarea(this.idSeleccionado).subscribe(
      () => {
        this.tarSer.getTareas().subscribe(
          (response) => {
            this.tareas = response;
          },
          (error) => {
            console.log(error);
          }
        );

        document.getElementById('DeleteModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Tarea eliminada con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al eliminar la tarea');
      }
    );
  }
}
