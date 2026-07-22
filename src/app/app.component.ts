import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import {ThemeService} from "./shared/services/theme/theme.service";
import {LoadingComponent} from "./shared/loading/loading.component";
import {LoadingService} from "./shared/services/loading/loading.service";

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ToastModule,
        ReactiveFormsModule,
        LoadingComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  showLoading: boolean = false;

  constructor(
    private themeService: ThemeService,
    private loadingService: LoadingService,
    private readonly chancheDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeService.loadTheme('dark');
    this.onRegistrySubjectLoading();
  }

  onRegistrySubjectLoading(){
    this.loadingService.showLoading.subscribe({
      next: data => {
        this.showLoading = data;
        this.chancheDetector.detectChanges();
      },
    })
  }
}
