import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { InvestorComponent } from './investor/investor.component';
import { PortalComponent } from './portal/portal.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'investor', component: InvestorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
