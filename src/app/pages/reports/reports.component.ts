import {Component, OnInit} from '@angular/core';
import {ImplementsBase} from "../../shared/interfaces/implements-base";
import {RequestData} from "../../shared/components/request-data";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../shared/services/crud/crud.service";
import {RegisterService} from "../../shared/services/register/register.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DataTable} from "../../shared/components/datatable/datatable";
import {DatatableComponent} from "../../shared/components/datatable/datatable.component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";

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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly crudService: CrudService,
    private readonly registerService: RegisterService,
    private readonly toastService: ToastService,
    public readonly translateService: TranslateService
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.route = params.get('hash');
    });
  }

  onLoadAllData($event: RequestData): void {
  }

  onOpenModal(obj: any): void {
  }

  onSave(obj: any): void {
  }

  onSelectedData($event: any): void {
  }

  onUpdate(obj: any): void {
  }

  onSetPropertiesDatatable(obj: any): void {
    this.datatable.fields = obj.fields;
    this.onLoadAllData(new RequestData());
  }



}
