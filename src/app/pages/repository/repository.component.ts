import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {RepositoryItemComponent} from '../../components/repository-item/repository-item.component';
import {RepositoryConfig} from './repository.config';
import {RepositoryModalComponent} from '../../components/repository-modal/repository-modal.component';
import {CrudService} from '../../shared/services/crud/crud.service';
import {RequestData} from '../../shared/components/request-data';
import {ReportModalComponent} from '../../components/report-modal/report-modal.component';
import {ToastService} from '../../shared/services/toast/toast.service';
import {ReportService} from '../../services/report/report.service';
import {LoadingService} from '../../shared/services/loading/loading.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {PlanOption, PlanOverview, PlanService} from '../../services/plan/plan.service';
import {PlanUpgradeModalComponent} from '../../components/plan-upgrade-modal/plan-upgrade-modal.component';

@Component({
  selector: 'app-repository',
  imports: [SharedCommonModule, RepositoryItemComponent],
  providers: [DialogService, CrudService, ToastService, ReportService],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent implements OnInit {
  repositoryConfig = new RepositoryConfig();
  ref: DynamicDialogRef | null | undefined;
  currentRepository: any;
  repositorySearch = '';
  reportSearch = '';
  reportsTotal = 0;
  repositoriesTotal = 0;
  generatedTotal = 0;
  planOverview?: PlanOverview;

  constructor(
    private readonly dialogService: DialogService,
    private readonly crudService: CrudService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly reportService: ReportService,
    private readonly loadingService: LoadingService,
    public readonly translateService: TranslateService,
    private readonly planService: PlanService
  ) {}

  get filteredRepositories(): any[] { return this.filterByName(this.repositoryConfig.repositoryes, this.repositorySearch); }
  get filteredReports(): any[] { return this.filterByName(this.repositoryConfig.reports, this.reportSearch); }

  ngOnInit(): void {
    this.loadRepositories();
    this.loadPlanOverview();
  }

  openUpgrade(): void {
    if (!this.planOverview) return;
    this.ref = this.dialogService.open(PlanUpgradeModalComponent, {
      header: 'Escolha seu plano',
      width: 'min(1120px, 96vw)',
      modal: true,
      draggable: false,
      maximizable: false,
      data: {overview: this.planOverview},
      baseZIndex: 999999
    });
    this.ref?.onClose.subscribe((plan?: PlanOption) => {
      if (!plan) return;
      this.toastService.info({
        summary: plan.name,
        detail: plan.customPlan
          ? 'Vamos preparar o contato para entender sua volumetria.'
          : 'Registramos seu interesse. A contratação online será disponibilizada em breve.'
      });
    });
  }

  private loadPlanOverview(): void {
    this.planService.overview().subscribe({next: overview => this.planOverview = overview});
  }

  selectRepository(repository: any): void {
    this.currentRepository = repository;
    this.repositoryConfig.reports = [];
    this.loadReports(repository);
  }

  openStudio(report: any): void {
    this.router.navigate(['home', 'studio', report.id]);
  }

  openRepository(repository: any = null): void {
    this.ref = this.dialogService.open(RepositoryModalComponent, {
      header: repository ? 'Editar repositório' : this.translateService.translate('common_new_repository'),
      width: 'min(560px, 92vw)', modal: true, draggable: true, maximizable: false,
      data: repository, baseZIndex: 999999
    });
    this.ref?.onClose.subscribe(() => this.loadRepositories());
  }

  openReport(report: any = null): void {
    if (!this.currentRepository) {
      this.toastService.warn({summary: 'Repositório necessário', detail: 'Selecione um repositório antes de criar um template.'});
      return;
    }
    this.ref = this.dialogService.open(ReportModalComponent, {
      header: report ? 'Editar template' : this.translateService.translate('common_new_report'),
      width: report ? 'min(720px, 94vw)' : 'min(880px, 96vw)', modal: true, draggable: true, maximizable: false,
      data: {obj: report, repository: this.currentRepository}, baseZIndex: 999999
    });
    this.ref?.onClose.subscribe(() => { this.loadReports(this.currentRepository); this.loadMetrics(); });
  }

  loadRepositories(): void {
    this.crudService.onGetAll('repository', new RequestData()).subscribe({
      next: data => {
        this.repositoryConfig.repositoryes = data.contents ?? [];
        this.loadMetrics();
        const selected = this.repositoryConfig.repositoryes.find(item => item.id === this.currentRepository?.id)
          ?? this.repositoryConfig.repositoryes[0];
        if (selected) this.selectRepository(selected);
        else { this.currentRepository = null; this.repositoryConfig.reports = []; }
      },
      error: error => console.error(error)
    });
  }

  loadReports(repository: any): void {
    this.loadingService.showLoading.next(true);
    this.crudService.onGetAll('report', this.reportFilter(repository)).subscribe({
      next: data => {
        this.repositoryConfig.reports = data.contents ?? [];
        this.loadingService.showLoading.next(false);
      },
      error: error => {
        console.error(error);
        this.loadingService.showLoading.next(false);
      }
    });
  }

  deleteRepository(repository: any): void {
    this.crudService.onDelete('repository', repository.id).subscribe({
      next: () => { if (this.currentRepository?.id === repository.id) this.currentRepository = null; this.loadRepositories(); },
      error: error => console.error(error)
    });
  }

  deleteReport(report: any): void {
    this.crudService.onDelete('report', report.id).subscribe({
      next: () => { this.loadReports(this.currentRepository); this.loadMetrics(); },
      error: error => console.error(error)
    });
  }

  loadMetrics(): void {
    this.reportService.getMetrics().subscribe({
      next: data => {
        this.reportsTotal = data.report ?? 0;
        this.repositoriesTotal = data.repository ?? 0;
        this.generatedTotal = data.generateds ?? 0;
      }
    });
  }

  private reportFilter(repository: any): RequestData {
    const requestData = new RequestData();
    requestData.filter = ` repository.id eq ${repository.id}`;
    return requestData;
  }

  private filterByName(items: any[], search: string): any[] {
    const query = search.trim().toLocaleLowerCase();
    return query ? items.filter(item => String(item.name ?? '').toLocaleLowerCase().includes(query)) : items;
  }
}
