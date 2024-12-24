import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {MenuItem} from "primeng/api";
import {RepositoryItemComponent} from "../../components/repository-item/repository-item.component";
import {RepositoryConfig} from "./repository.config";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {RepositoryModalComponent} from "../../components/repository-modal/repository-modal.component";
import {CrudService} from "../../shared/services/crud/crud.service";
import {RequestData} from "../../shared/components/request-data";
import {ReportModalComponent} from "../../components/report-modal/report-modal.component";
import {ToastService} from "../../shared/services/toast/toast.service";
import { ContextMenuModule } from 'primeng/contextmenu';
import {CustomCardComponent} from "../../components/custom-card/custom-card.component";
import {Route, Router} from "@angular/router";
import {ReportService} from "../../services/report/report.service";
import {LoadingService} from "../../shared/services/loading/loading.service";

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [
    SharedCommonModule,
    RepositoryItemComponent,
    RepositoryItemComponent,
    ContextMenuModule,
    CustomCardComponent
  ],
  providers: [
    DialogService,
    CrudService,
    ToastService,
    ReportService
  ],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent implements OnInit {
  repository: MenuItem[] | undefined;
  reports: MenuItem[] | undefined;
  repositoryConfig: RepositoryConfig = new RepositoryConfig();
  ref: DynamicDialogRef | undefined;
  _currentReposrt: any;

  _reports: number = 0;
  _repositorys: number = 0;
  _totalGenerated: number = 0;


  constructor(
    private readonly dialogService: DialogService,
    private readonly crudService: CrudService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly reportService: ReportService,
    private readonly loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.onConfigureMenus();
    this.onGetAll();
    this.onGetMetrics();
  }


  onSelectedItem($event: any){
    this._currentReposrt = $event;
    this.onGetAllReport($event);
  }

  onSelectedReport($event: any){
    this.router.navigate(["home","studio",$event.id]);
  }

  onRepository(obj: any){
    this.ref = this.dialogService.open(RepositoryModalComponent,
      {
        header: "Repositorio",
        width: '40vw',
        modal:true,
        draggable: true,
        maximizable: false,
        data: obj,
        baseZIndex: 999999,
      });

    this.ref.onClose.subscribe({
      next: result => {
        this.onGetAll();
      }
    })
  }

  onReport(obj: any){
    this.ref = this.dialogService.open(ReportModalComponent,
      {
        header: "Relatorio",
        width: '40vw',
        modal:true,
        draggable: true,
        maximizable: false,
        data: {obj: obj, repository: this._currentReposrt},
        baseZIndex: 999999,
      });

    this.ref.onClose.subscribe({
      next: result => {
        this.onGetAllReport(this._currentReposrt);
      }
    })
  }

  onGetAll(){
    this.crudService.onGetAll("repository", new RequestData()).subscribe({
      next: data => {
        this.repositoryConfig.repositoryes = data.contents;
        this.onGetMetrics();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  onGetAllReport(repository: any){

    this.crudService.onGetAll("report", this.onFilterReport(repository)).subscribe({
      next: data => {
        this.repositoryConfig.reports = data.contents;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  private onFilterReport(repository: any): RequestData {
    let requestData = new RequestData();
    requestData.filter = ` repository.id eq ${repository.id}`
    return requestData;
  }

  private onConfigureMenus() {
    this.repository = [
      {
        label: 'Novo repositório',
        command: () => {
          this.onRepository(null);
        }
      }

    ]

    this.reports = [
      {
        label: 'Novo relatório',
        command: () => {
          if(this._currentReposrt){
            this.onReport(null);
          } else {
            this.toastService.warn({summary: "Mensagem", detail: "Selecione um repósitório"});
          }
        }
      }
    ]
  }

  onDeleteRepository($event: any){
    this.crudService.onDelete("repository", $event.id).subscribe({
      next: data => {
        this.onGetAll();
        this.onGetMetrics();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onDeleteReport($event: any){
    this.crudService.onDelete("report", $event.id).subscribe({
      next: data => {
        this.onGetAllReport($event.repository);
        this.onGetMetrics();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onGetMetrics(){
    this.loadingService.showLoading.next(true);
    this.reportService.getMetrics().subscribe({
      next: (data) => {
        this._reports = data.report;
        this._repositorys = data.repository;
        this._totalGenerated = data.generateds;
        this.loadingService.showLoading.next(false);
      },
      error: (error) => {
        this.loadingService.showLoading.next(false);
      }
    })
  }
}
