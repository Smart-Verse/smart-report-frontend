import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../shared/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent extends BaseComponent implements OnInit {

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

}
