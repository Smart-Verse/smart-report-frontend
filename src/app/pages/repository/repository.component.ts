import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {MenuItem} from "primeng/api";
import {RepositoryItemComponent} from "../../components/repository-item/repository-item.component";
import {RepositoryConfig} from "./repository.config";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {RepositoryModalComponent} from "../../components/repository-modal/repository-modal.component";
import {CrudService} from "../../shared/services/crud/crud.service";
import {RequestData} from "../../shared/components/request-data";

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [
    SharedCommonModule,
    RepositoryItemComponent,
    RepositoryItemComponent
  ],
  providers: [
    DialogService,
    CrudService
  ],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent implements OnInit {
  repository: MenuItem[] | undefined;
  reports: MenuItem[] | undefined;
  repositoryConfig: RepositoryConfig = new RepositoryConfig();
  ref: DynamicDialogRef | undefined;


  constructor(
    private readonly dialogService: DialogService,
    private readonly crudService: CrudService,
  ) {
  }

  ngOnInit(): void {
    this.repository = [
      {
        label: 'Novo reposutório',
        command: () => {
          this.onRepository(null);
        }
      }

    ]

    this.reports = [
      {
        label: 'Novo relatório',
      }
    ]

    this.onGetAll();
  }


  onSelectedItem($event: any){

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

  onGetAll(){
    this.crudService.onGetAll("repository", new RequestData()).subscribe({
      next: data => {
        this.repositoryConfig.repositoryes = data.contents;
      },
      error: error => {
        console.log(error);
      }
    })
  }



}
