import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../shared/services/crud/crud.service";
import {RegisterService} from "../../shared/services/register/register.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {LoadingService} from "../../shared/services/loading/loading.service";
import {SharedCommonModule} from "../../shared/common/shared-common.module";

@Component({
  selector: 'app-report-studio',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    CrudService,
    ToastService
  ],
  templateUrl: './report-studio.component.html',
  styleUrl: './report-studio.component.scss'
})
export class ReportStudioComponent implements OnInit {

  route: string | null = "";

  constructor(
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
    });
  }

}
