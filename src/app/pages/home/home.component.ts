import { Component } from '@angular/core';
import {SharedModule} from "primeng/api";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {AvatarModule} from "primeng/avatar";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedCommonModule,
    AvatarModule,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private router: Router
  ) {}

  onConfigUser() {
    this.router.navigate(['home','userConfiguration']);
  }
}
