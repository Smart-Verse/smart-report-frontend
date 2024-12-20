import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ToastService} from "../../shared/services/toast/toast.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FormGroup} from "@angular/forms";
import {RepositoryModalConfig} from "../repository-modal/repository-modal.config";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ReportModalConfig} from "./report-modal.config";

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService,
    CrudService
  ],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.scss'
})
export class ReportModalComponent implements OnInit {


  public formGroup: FormGroup;
  private configuration: ReportModalConfig = new ReportModalConfig();

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly crudService: CrudService
  ) {
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    if(this.config.data){
      if(this.config.data.obj){
        this.formGroup.patchValue(this.config.data.obj);
      }
      this.formGroup.patchValue({
        repository: this.config.data.obj.repository,
      });
    }
  }

  onSave(): void {
    if(this.formGroup.valid) {
      let dto = this.configuration.convertToDTO(this.formGroup);
      if(!dto.id){
        this.onNew(dto);
      }
    }else {
      this.toastService.warn({summary: "Mensagem", detail: "Existem campos inválidos"});
      this.fieldsService.verifyIsValid();
    }
  }

  onClose(): void {
    this.ref.close(null);
  }


  onNew(obj: any){
    this.crudService.onSave("report", obj).subscribe({
      next: data => {
        this.ref.close();
      },
      error: error => {
        console.log(error);
      }
    })
  }

}
