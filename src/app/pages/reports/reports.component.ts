import {Component, OnInit} from '@angular/core';
import {ImplementsBase} from "../../shared/interfaces/implements-base";
import {RequestData} from "../../shared/components/request-data";
import {ActivatedRoute, Router} from "@angular/router";
import {CrudService} from "../../shared/services/crud/crud.service";
import {RegisterService} from "../../shared/services/register/register.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DataTable} from "../../shared/components/datatable/datatable";
import {DatatableComponent} from "../../shared/components/datatable/datatable.component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {LoadingService} from "../../shared/services/loading/loading.service";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    DatatableComponent,
    SharedCommonModule
  ],
  providers: [
    ToastService,
    CrudService
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, ImplementsBase{

  route: string | null = "";
  datatable: DataTable = new DataTable();
  title: string = "";

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly crudService: CrudService,
    private readonly registerService: RegisterService,
    private readonly toastService: ToastService,
    public readonly translateService: TranslateService,
    private readonly loadingService: LoadingService
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.route = params.get('hash');
      this.onGet(this.route);
    });
  }

  onGetAll($event: RequestData): void {
  }

  onGet(id: any): void {
    this.loadingService.showLoading.next(true);
    this.crudService.onGet("workspace",id).subscribe({
      next: (res) => {
        this.title = res.description;
        this.loadingService.showLoading.next(false);
      },
      error: (err) => {
        this.loadingService.showLoading.next(false);
      }
    });
  }

  onOpenModal(obj: any): void {}

  onSave(obj: any): void {}

  onSelectedData($event: any): void {
    this.router.navigate(["home","report-studio",this.route]);
  }

  onUpdate(obj: any): void {}

  onSetPropertiesDatatable(obj: any): void {
    this.datatable.fields = obj.fields;
    this.onGetAll(new RequestData());
  }
}
