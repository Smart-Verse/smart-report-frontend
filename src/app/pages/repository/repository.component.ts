import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {MenuItem} from "primeng/api";
import {RepositoryItemComponent} from "../../components/repository-item/repository-item.component";
import {RepositoryConfig} from "./repository.config";

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [
    SharedCommonModule,
    RepositoryItemComponent
  ],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent implements OnInit {
  repository: MenuItem[] | undefined;
  reports: MenuItem[] | undefined;
  repositoryConfig: RepositoryConfig = new RepositoryConfig();

  constructor() {
  }

  ngOnInit(): void {
    this.repository = [
      {
        label: 'New repository',
      }
    ]

    this.reports = [
      {
        label: 'New report',
      }
    ]
  }


  onSelectedItem($event: any){
    console.log($event);
  }

}
