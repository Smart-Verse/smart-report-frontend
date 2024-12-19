import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {RepositoryItemComponent} from "../../components/repository-item/repository-item.component";
import {RepositoryConfig} from "./repository.config";
import {CookiesService} from "../../shared/services/cookies/cookies.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {RepositoryModalComponent} from "../../components/repository-modal/repository-modal.component";

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [
    SharedCommonModule,
    RepositoryItemComponent,
    RepositoryItemComponent
  ],
  providers: [
    DialogService
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
  ) {
  }

  ngOnInit(): void {
    this.repository = [
      {
        label: 'New repository',
        command: () => {
          this.onRepository(null);
        }
      }
    ]

    this.reports = [
      {
        label: 'New report',
      }
    ]
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
  }

}
