import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../shared/services/loading/loading.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {FormGroup} from "@angular/forms";
import {RepositoryModalConfig} from "./repository-modal.config";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {UserConfigurationService} from "../../services/user-configuration/user-configuration.service";
import {CrudService} from "../../shared/services/crud/crud.service";

@Component({
  selector: 'app-repository-modal',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService,
    CrudService
  ],
  templateUrl: './repository-modal.component.html',
  styleUrl: './repository-modal.component.scss'
})
export class RepositoryModalComponent implements OnInit{

  public formGroup: FormGroup;
  private configuration: RepositoryModalConfig = new RepositoryModalConfig();

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

  ngOnInit(): void {
    if(this.config.data){
      this.formGroup.patchValue(this.config.data.data);
    }
  }


  onNew(obj: any){
    this.crudService.onSave("repository", obj).subscribe({
      next: data => {

        this.ref.close();
      },
      error: error => {
        console.log(error);
      }
    })
  }
}
