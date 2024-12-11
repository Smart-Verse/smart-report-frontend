import { Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {publicGuard} from "./security/guards/public.guard";
import {SignupComponent} from "./security/signup/signup.component";
import {HomeComponent} from "./pages/home/home.component";
import {privateGuard} from "./security/guards/private.guard";
import {UserConfigurationComponent} from "./pages/user-configuration/user-configuration.component";
import {UserConfirmationComponent} from "./pages/user-confirmation/user-confirmation.component";
import {RepositoryComponent} from "./pages/repository/repository.component";

export const routes: Routes = [

  { path: "login", component: LoginComponent, pathMatch: "full", canActivate: [publicGuard] },
  { path: "singup", component: SignupComponent, pathMatch: "full", canActivate: [publicGuard] },
  { path: "user-confirmation/:hash", component: UserConfirmationComponent, pathMatch: "full", canActivate: [publicGuard] },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [privateGuard],
    children: [
      { path: 'userConfiguration', component: UserConfigurationComponent },
      { path: 'repository', component: RepositoryComponent },
      { path: '', redirectTo: 'repository', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
