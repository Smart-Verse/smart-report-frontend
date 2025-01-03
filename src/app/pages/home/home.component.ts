import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {AvatarModule} from "primeng/avatar";
import {Router, RouterOutlet} from "@angular/router";
import {MenuItem} from "primeng/api";
import {EnumCookie} from "../../shared/services/cookies/cookie.enum";
import {SecurityService} from "../../security/services/security.service";
import {CookiesService} from "../../shared/services/cookies/cookies.service";
import {TranslateService} from "../../shared/services/translate/translate.service";


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
export class HomeComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private readonly cookiesService: CookiesService,
    private readonly translateService: TranslateService
  ) {}

  onConfigUser() {
    this.router.navigate(['home','userConfiguration']);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: '',
        items: [
          {
            label: this.translateService.translate("home_initial_page"),
            icon: 'pi pi-cog',
            command: () => {
              this.router.navigate(['home']);
            }
          },
          {
            label: this.translateService.translate("home_settings"),
            icon: 'pi pi-cog',
            command: () => {
              this.onConfigUser();
            }
          },
          {
            label: this.translateService.translate("home_logout"),
            icon: 'pi pi-sign-out',
            command: () => {
              this.cookiesService.delete(EnumCookie.AUTHORIZATION);
              this.cookiesService.delete(EnumCookie.HASH);
              this.router.navigate(['login']);
            }
          }
        ]
      }
    ];
  }


}
