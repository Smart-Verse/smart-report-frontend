import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../shared/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DatatableComponent} from "../../shared/components/datatable/datatable.component";
import {RequestData} from "../../shared/components/request-data";
import {DataTable} from "../../shared/components/datatable/datatable";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    LoadingComponent,
    DatatableComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent extends BaseComponent implements OnInit {

  datatable: DataTable = new DataTable();

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  onLoadAllData($event: RequestData) {

  }

  onSelectedData($event: any) {
    if($event.action == 2){

    }
  }
}
