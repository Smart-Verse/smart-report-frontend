import { Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {publicGuard} from "./security/guards/public.guard";
import {SignupComponent} from "./security/signup/signup.component";

export const routes: Routes = [

  { path: "login", component: LoginComponent, pathMatch: "full", canActivate: [publicGuard] },
  { path: "singup", component: SignupComponent, pathMatch: "full", canActivate: [publicGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
