import { HttpClientModule } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpModule } from './config/http/http.module';
import {ThemeService} from "./shared/services/theme/theme.service";
import {LoadingComponent} from "./shared/loading/loading.component";
import {LoadingService} from "./shared/services/loading/loading.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    ToastModule,
    ReactiveFormsModule,
    HttpModule,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService
  ],
})
export class AppComponent implements OnInit{

  showLoading: boolean = false;

  constructor(
    private config: PrimeNGConfig,
    private themeService: ThemeService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.config.ripple = true;
    this.themeService.setTheme('aura-dark-cyan');
    this.onRegistrySubjectLoading();
  }

  onRegistrySubjectLoading(){
    this.loadingService.showLoading.subscribe({
      next: data => {
        this.showLoading = data;
      },
    })
  }
}
