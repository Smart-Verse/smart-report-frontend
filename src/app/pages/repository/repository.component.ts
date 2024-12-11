import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent implements OnInit {
  repository: MenuItem[] | undefined;
  reports: MenuItem[] | undefined;

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

}
