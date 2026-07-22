import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ToastService} from "../../shared/services/toast/toast.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ReportModalConfig} from "./report-modal.config";

interface TemplateOption {
  key: 'STANDARD' | 'LIST' | 'CHART' | 'FINANCIAL';
  name: string;
  description: string;
  icon: string;
  accent: string;
  preview: 'standard' | 'list' | 'chart' | 'financial';
}

@Component({
  selector: 'app-report-modal',
  imports: [SharedCommonModule],
  providers: [ToastService, CrudService],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.scss'
})
export class ReportModalComponent implements OnInit {
  public formGroup: FormGroup;
  private configuration = new ReportModalConfig();

  readonly templates: TemplateOption[] = [
    {key: 'STANDARD', name: 'Executivo', description: 'Resumo moderno com indicadores e destaques.', icon: 'pi pi-file', accent: '#2563eb', preview: 'standard'},
    {key: 'LIST', name: 'Listagem', description: 'Tabela organizada para registros e cadastros.', icon: 'pi pi-list', accent: '#0891b2', preview: 'list'},
    {key: 'CHART', name: 'Gráficos', description: 'Painel analítico com métricas e evolução.', icon: 'pi pi-chart-bar', accent: '#7c3aed', preview: 'chart'},
    {key: 'FINANCIAL', name: 'Financeiro', description: 'Receitas, despesas e demonstrativo mensal.', icon: 'pi pi-wallet', accent: '#15803d', preview: 'financial'}
  ];

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

  get isEditing(): boolean {
    return !!this.config.data?.obj;
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      repository: this.config.data?.repository,
      templateType: 'STANDARD'
    });
    if (this.config.data?.obj) this.formGroup.patchValue(this.config.data.obj);
  }

  selectTemplate(template: TemplateOption): void {
    if (!this.isEditing) this.formGroup.patchValue({templateType: template.key});
  }

  isSelected(template: TemplateOption): boolean {
    return this.formGroup.get('templateType')?.value === template.key;
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      this.toastService.warn({summary: 'Mensagem', detail: 'Existem campos inválidos'});
      this.fieldsService.verifyIsValid();
      return;
    }

    const dto = this.configuration.convertToDTO(this.formGroup);
    if (!dto.id) this.onNew(dto);
  }

  onClose(): void {
    this.ref.close(null);
  }

  private onNew(obj: any): void {
    this.crudService.onSave('report', obj).subscribe({
      next: () => this.ref.close(),
      error: () => this.toastService.error({summary: 'Não foi possível criar', detail: 'Tente novamente em alguns instantes.'})
    });
  }
}
