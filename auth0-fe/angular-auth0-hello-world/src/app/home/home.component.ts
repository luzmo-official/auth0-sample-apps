import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  showLoader = true;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, public router: Router) {
    auth.isAuthenticated$.subscribe(isAuthenticated => {
      this.showLoader = false;
      if (isAuthenticated) {
        router.navigateByUrl('/portal')
      }
    });
  }
}
