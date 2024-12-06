import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../shared/services/loading/loading.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {FormGroup} from "@angular/forms";
import {WorkspaceModalConfig} from "./workspace-modal.config";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";

@Component({
  selector: 'app-workspace-modal',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './workspace-modal.component.html',
  styleUrl: './workspace-modal.component.scss'
})
export class WorkspaceModalComponent implements OnInit{

  public formGroup: FormGroup;
  private configuration: WorkspaceModalConfig = new WorkspaceModalConfig();

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
  ) {
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  onSave(): void {
    if(this.formGroup.valid) {
      this.ref.close(this.configuration.convertToDTO(this.formGroup));
    }else {
      this.toastService.warn({summary: "Mensagem", detail: "Existem campos inválidos"});
      this.fieldsService.verifyIsValid();
    }
  }

  onClose(): void {
    this.ref.close(null);
  }

  ngOnInit(): void {
    if(this.config.data){
      this.formGroup.patchValue(this.config.data.data);
    }
  }
}
