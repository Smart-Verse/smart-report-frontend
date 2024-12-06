import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../shared/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DatatableComponent} from "../../shared/components/datatable/datatable.component";
import {RequestData} from "../../shared/components/request-data";
import {DataTable} from "../../shared/components/datatable/datatable";
import {ButtonModule} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../shared/services/toast/toast.service";
import {WorkspaceModalComponent} from "../../components/workspace-modal/workspace-modal.component";
import {CrudService} from "../../shared/services/crud/crud.service";
import {LoadingService} from "../../shared/services/loading/loading.service";
import {ImplementsBase} from "../../shared/interfaces/implements-base";
import {ActivatedRoute, Router} from "@angular/router";
import {RegisterService} from "../../shared/services/register/register.service";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    LoadingComponent,
    DatatableComponent,
    ButtonModule,
    Ripple
  ],
  providers: [
    DialogService,
    ToastService,
    CrudService
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent implements OnInit, ImplementsBase {

  datatable: DataTable = new DataTable();
  ref: DynamicDialogRef | undefined;
  originalClose: any;


  constructor(
    private readonly router: Router,
    public readonly translateService: TranslateService,
    private readonly registerService: RegisterService,
    private readonly dialogService: DialogService,
    private readonly toastService: ToastService,
    private readonly crudService: CrudService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    var obj = this.registerService.getModel("workspace");
    this.onSetPropertiesDatatable(obj);
  }

  onSetPropertiesDatatable(obj: any): void  {
    this.datatable.fields = obj.fields;
    this.onLoadAllData(new RequestData());
  }

  private includeFilters(requestData: RequestData) {
    return requestData;
  }

  onSave(obj: any){
    this.loadingService.showLoading.next(true);
    this.crudService.onSave("workspace",obj).subscribe({
      next: (res) => {
        this.toastService.success({ detail: "salvo com sucesso", summary: "Mensagem" });
        this.loadingService.showLoading.next(false);
        this.originalClose(null);
        this.onLoadAllData(new RequestData());
      },
      error: err => {
        this.loadingService.showLoading.next(false);
      }
    });
  }

  onUpdate(obj: any){
    this.loadingService.showLoading.next(true);
    this.crudService.onUpdate("workspace",obj.id, obj).subscribe({
      next: (res) => {
        this.loadingService.showLoading.next(false);
        this.onLoadAllData(new RequestData());
        this.originalClose(null);
      },
      error: err => {
        this.loadingService.showLoading.next(false);
      }
    });
  }

  onDelete(obj: any){
    this.loadingService.showLoading.next(true);
    this.crudService.onDelete("workspace",obj.id).subscribe({
      next: (res) => {
        this.loadingService.showLoading.next(false);
        this.onLoadAllData(new RequestData());
      },
      error: err => {
        this.loadingService.showLoading.next(false);
      }
    });
  }

  onLoadAllData(requestData: RequestData) {
    requestData = this.includeFilters(requestData);
    this.loadingService.showLoading.next(true);
    this.crudService.onGetAll("workspace",requestData).subscribe({
      next: (res) => {
        this.datatable.values = res.contents;
        this.datatable.totalRecords = res.total;
        this.datatable.page = res.offset + 1;
        this.datatable.size = res.size;
        this.loadingService.showLoading.next(false);
        this.loadingService.showLoading.next(false);
      },
      error: (err) => {
        this.loadingService.showLoading.next(false);
      }
    });
  }

  onSelectedData($event: any) {
    if($event.action === 0){
      this.onDelete($event.data);
    } else {
      this.onOpenModal($event);
    }

  }

  onOpenModal(obj: any){
    this.ref = this.dialogService.open(WorkspaceModalComponent,
      {
        header: "Cadastrar workspace",
        width: '80vw',
        modal:true,
        draggable: true,
        maximizable: false,
        data: obj,
        baseZIndex: 999999,
      });


    this.originalClose = this.ref.close.bind(this.ref);
    this.ref.close = (result: any) => {
      if (result) {
        if(!result.id){
          this.onSave(result);
        } else {
          this.onUpdate(result);
        }
      } else {
        this.originalClose(null);
      }
    };
  }

  onReports(row: any) {
    this.router.navigate(["home","reports",row.id]);
  }
}
