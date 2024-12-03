import {Component, HostListener, OnInit} from '@angular/core';
import { SharedCommonModule } from '../../common/shared-common.module';
import { RouterLink, RouterOutlet} from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SidebarSubmenuComponent } from './sidebar-submenu/sidebar-submenu.component';

import {MenuModule} from "primeng/menu";

import {ImageUploadService} from "../inputs/image-upload/image-upload.service";
import {ThemeService} from "../../services/theme/theme.service";
import {TranslateService} from "../../services/translate/translate.service";
import {MenuItens} from "../../../config/sidebar/menu-itens";




@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SharedCommonModule,
    RouterLink,
    TooltipModule,
    AvatarModule,
    AvatarGroupModule,
    RouterOutlet,
    SidebarSubmenuComponent,
    MenuModule
  ],
  providers: [
    ImageUploadService
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  theme: string = 'aura-dark-purple';
  menu = new MenuItens();
  isExpanded = false;
  menuItems: any;
  currentMenu: any;
  showSidebar: boolean = true;
  showSidebarMobile: boolean = false;
  screenWidth: number = 0;
  isMobile: boolean = false;
  image: string | null = null;

  constructor(
    private readonly imageService: ImageUploadService,
    private readonly themeService: ThemeService,
    private readonly translateService: TranslateService,
  ){
    this.menuItems = this.menu.menuItems;
    this.currentMenu = this.menuItems[0];
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.onVerifyMobile();
    this.onSetConfigurationMobile();
    //this.onLoadImage();

  }

  toggleMenu(menu: any) {
    this.isExpanded = false;
    if(menu.submenu.length > 0){
      this.isExpanded = true;

    }
    this.currentMenu = menu;
    this.onDisableAndSetActiveLink();
  }

  closeMenu(){
    this.isExpanded = false;
    if(this.isMobile){
      this.showSidebar = false;
      this.showSidebarMobile = true;
    }
    this.onDisableAndSetActiveLink();
  }

  onDisableAndSetActiveLink() {

    this.menu.menuItems.forEach(e => {

      const disableLink = document.getElementById(e.name);
      if(disableLink){
        disableLink.classList.remove('active');
      }
    });

    const activeLink = document.getElementById(this.currentMenu.name);
    if(activeLink){
      activeLink.classList.add('active');
    }
  }

  onMobileOpenMenu(){
    this.onDisableAndSetActiveLink();
    this.isExpanded = true;
    if(this.isMobile){
      this.showSidebar = true;
      this.showSidebarMobile = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.onVerifyMobile();
    this.onSetConfigurationMobile();
  }

  onVerifyMobile(){
    if(this.screenWidth <= 600){
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  onSetConfigurationMobile(){
    if(this.isMobile) {
      this.showSidebarMobile = true;
      this.showSidebar = false;
    } else {
      this.showSidebarMobile = false;
      this.showSidebar = true;
    }
  }

/*
  //Exclusivo para uso aqui
  onLoadImage(){
    this.userConfigurationService.getUser().subscribe({
      next: (res) => {
        this.imageService.onRequestDonwload(res.output.userPhoto).subscribe({
          next: (req) => {
            this.image = req["url"];
            this.themeService.onConfigurationTheme(res.output.theme);
            this.translateService.loadTranslationsUser(res.output.lang);
          }
        });
      }
    });
  }
  */
}
