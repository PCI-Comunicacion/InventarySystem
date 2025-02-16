import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})

export class AppComponent implements OnInit {
  title = 'InvenPci';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBodyClass(event.urlAfterRedirects);
      }
    });
  }

  updateBodyClass(url: string) {
    if (url.includes('/auth/login') || url.includes('/auth/forgotPassword')) {
      document.body.classList.add('img-background');
    } else {
      document.body.classList.remove('img-background');
    }
  }

}
