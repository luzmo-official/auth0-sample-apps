import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from '@auth0/auth0-angular';
import { PortalComponent } from './portal/portal.component';
import { HomeComponent } from './home/home.component';
import { InvestorComponent } from './investor/investor.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { NgxCumulioDashboardModule } from '@cumul.io/ngx-cumulio-dashboard';

@NgModule({
  declarations: [	
    AppComponent,
    PortalComponent,
    HomeComponent,
      InvestorComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: environment.domain,
      clientId: environment.clientId
    }),
    HttpClientModule,
    NgxCumulioDashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
