import { AfterViewInit, Component } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    const canvas = document.getElementById('sales-chart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [
            {
              label: 'Ingresos',
              data: [1200, 1500, 800, 2000, 1000, 1700],
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
