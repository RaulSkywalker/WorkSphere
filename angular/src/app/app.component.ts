import { Router, NavigationError } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular';
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationError) {
        switch (event.error.status) {
          case 404:
            router.navigate(['/404']);
            break;
          case 500:
            router.navigate(['/500']);
            break;
          default:
            break;
        }
      }
    });
  }
}
