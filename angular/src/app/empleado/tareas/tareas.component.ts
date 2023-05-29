import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit{
  tareas: any[] = [];
  tarea: any = {};

  constructor(private tarSer: TareaService, private http: HttpClient) { }
  ngOnInit(): void {
    this.tarSer.getTareas().subscribe(
      (response) => {
        this.tareas = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
