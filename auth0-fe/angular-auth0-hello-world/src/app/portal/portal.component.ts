import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxCumulioDashboardComponent } from '@cumul.io/ngx-cumulio-dashboard';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  @ViewChild('dashboardInstance') dashboardInstance?: NgxCumulioDashboardComponent;

  dashboardId: string | undefined = undefined;
  appServer='APP_SERVER_HERE';
  apiHost='API_HOST_HERE';
  key?: string;
  token?: string;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // We can use raw claims to send JWT token instead of cumulio object.
    this.auth.idTokenClaims$.subscribe((claims) => {
      const token = claims?.__raw;
      this.http.get<{
        status: string;
        key?: string;
        token?: string;
      }>(`http://localhost:4001`, {
        headers: {
          'Authorization': 'Bearer ' + token 
        }
      })
      .subscribe((data) => {
        console.log(data);
        this.key = data.key;
        this.token = data.token;
        console.log('Fetching accessible dashboards');

        setTimeout(() => {
          // dynamically fetch dashboards and load the first one
          this.dashboardInstance?.getAccessibleDashboards().subscribe(dashboards => {
            this.dashboardId = dashboards[0]?.id;
          });
        }, 100);

      });
    });
  }

}
