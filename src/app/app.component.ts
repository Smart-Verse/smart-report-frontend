import { HttpClientModule } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpModule } from './config/http/http.module';
import {ThemeService} from "./shared/services/theme/theme.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    ToastModule,
    ReactiveFormsModule,
    HttpModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService
  ],
})
export class AppComponent implements OnInit{

  constructor(
    private config: PrimeNGConfig,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.config.ripple = true;
    this.themeService.setTheme('aura-dark-cyan');
  }
}
