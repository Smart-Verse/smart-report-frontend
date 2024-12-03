import { Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {publicGuard} from "./security/guards/public.guard";
import {SignupComponent} from "./security/signup/signup.component";
import {HomeComponent} from "./pages/home/home.component";
import {privateGuard} from "./security/guards/private.guard";

export const routes: Routes = [

  { path: "login", component: LoginComponent, pathMatch: "full", canActivate: [publicGuard] },
  { path: "singup", component: SignupComponent, pathMatch: "full", canActivate: [publicGuard] },
  { path: "home", component: HomeComponent, pathMatch: "full", canActivate: [privateGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
