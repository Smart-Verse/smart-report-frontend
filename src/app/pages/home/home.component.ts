import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {EnumCookie} from '../../shared/services/cookies/cookie.enum';
import {CookiesService} from '../../shared/services/cookies/cookies.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {ThemeService} from '../../shared/services/theme/theme.service';

@Component({
  selector: 'app-home',
  imports: [SharedCommonModule, AvatarModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(
    private readonly router: Router,
    private readonly cookiesService: CookiesService,
    private readonly translateService: TranslateService,
    public readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.items = [
      {label: this.translateService.translate('home_settings'), icon: 'pi pi-cog', command: () => this.router.navigate(['home', 'userConfiguration'])},
            {label: 'Chaves de API', icon: 'pi pi-key', command: () => this.router.navigate(['home', 'apiKeys'])},
      {separator: true},
      {label: this.translateService.translate('home_logout'), icon: 'pi pi-sign-out', command: () => this.logout()}
    ];
  }

  toggleTheme(): void {
    this.themeService.setTheme(this.themeService.currentTheme === 'dark' ? 'light' : 'dark');
  }

  private logout(): void {
    this.cookiesService.clearClientSession();
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }
}
