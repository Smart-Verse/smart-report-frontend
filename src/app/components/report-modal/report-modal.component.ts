import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ToastService} from "../../shared/services/toast/toast.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ReportModalConfig} from "./report-modal.config";
import {
  isThermalPageFormat,
  PAGE_FORMATS,
  PAGE_ORIENTATIONS,
  PageFormat,
  PageOrientation,
  pagePreviewAspectRatio
} from '../../services/report/page-layout';

interface TemplateOption {
  key: 'BLANK' | 'STANDARD' | 'LIST' | 'CHART' | 'FINANCIAL' | 'LANDSCAPE' | 'SALES_RECEIPT';
  name: string;
  description: string;
  icon: string;
  accent: string;
  preview: 'blank' | 'standard' | 'list' | 'chart' | 'financial' | 'landscape' | 'receipt';
  pageFormat: PageFormat;
  pageOrientation: PageOrientation;
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

  readonly pageFormats = PAGE_FORMATS;
  readonly pageOrientations = PAGE_ORIENTATIONS;
  readonly templates: TemplateOption[] = [
    {key: 'BLANK', name: 'Em branco', description: 'Estrutura mínima para começar do zero.', icon: 'pi pi-file-plus', accent: '#0f766e', preview: 'blank', pageFormat: 'A4', pageOrientation: 'PORTRAIT'},
    {key: 'STANDARD', name: 'Executivo', description: 'Resumo moderno com indicadores e destaques.', icon: 'pi pi-file', accent: '#2563eb', preview: 'standard', pageFormat: 'A4', pageOrientation: 'PORTRAIT'},
    {key: 'LIST', name: 'Listagem', description: 'Tabela organizada para registros e cadastros.', icon: 'pi pi-list', accent: '#0891b2', preview: 'list', pageFormat: 'A4', pageOrientation: 'PORTRAIT'},
    {key: 'CHART', name: 'Gráficos', description: 'Painel analítico com métricas e evolução.', icon: 'pi pi-chart-bar', accent: '#7c3aed', preview: 'chart', pageFormat: 'A4', pageOrientation: 'PORTRAIT'},
    {key: 'FINANCIAL', name: 'Financeiro', description: 'Receitas, despesas e demonstrativo mensal.', icon: 'pi pi-wallet', accent: '#15803d', preview: 'financial', pageFormat: 'A4', pageOrientation: 'PORTRAIT'},
    {key: 'LANDSCAPE', name: 'Painel landscape', description: 'Tabela ampla e indicadores para análise regional.', icon: 'pi pi-table', accent: '#0f766e', preview: 'landscape', pageFormat: 'A4', pageOrientation: 'LANDSCAPE'},
    {key: 'SALES_RECEIPT', name: 'Comprovante 80 mm', description: 'Venda detalhada para impressoras térmicas.', icon: 'pi pi-receipt', accent: '#334155', preview: 'receipt', pageFormat: 'THERMAL_80MM', pageOrientation: 'PORTRAIT'}
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
      templateType: 'STANDARD',
      pageFormat: 'A4',
      pageOrientation: 'PORTRAIT'
    });
    if (this.config.data?.obj) this.formGroup.patchValue(this.config.data.obj);
  }

  get selectedPageFormat(): PageFormat {
    return (this.formGroup.get('pageFormat')?.value || 'A4') as PageFormat;
  }

  get selectedPageOrientation(): PageOrientation {
    return (this.formGroup.get('pageOrientation')?.value || 'PORTRAIT') as PageOrientation;
  }

  get availableOrientations() {
    return isThermalPageFormat(this.selectedPageFormat)
      ? this.pageOrientations.filter(option => option.value === 'PORTRAIT')
      : this.pageOrientations;
  }

  get previewAspectRatio(): string {
    return pagePreviewAspectRatio(this.selectedPageFormat, this.selectedPageOrientation);
  }

  get selectedFormatDescription(): string {
    return this.pageFormats.find(option => option.value === this.selectedPageFormat)?.description ?? '210 × 297 mm';
  }

  onPageFormatChange(format: PageFormat): void {
    if (isThermalPageFormat(format)) {
      this.formGroup.patchValue({pageOrientation: 'PORTRAIT'});
    }
  }

  selectTemplate(template: TemplateOption): void {
    if (!this.isEditing) this.formGroup.patchValue({
      templateType: template.key,
      pageFormat: template.pageFormat,
      pageOrientation: template.pageOrientation
    });
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
    dto.id ? this.onUpdate(dto) : this.onNew(dto);
  }

  onClose(): void {
    this.ref.close(null);
  }

  private onUpdate(obj: any): void {
    this.crudService.onUpdate('report', obj.id, obj).subscribe({
      next: () => this.ref.close(obj),
      error: () => this.toastService.error({summary: 'Não foi possível atualizar', detail: 'Tente novamente em alguns instantes.'})
    });
  }

  private onNew(obj: any): void {
    this.crudService.onSave('report', obj).subscribe({
      next: () => this.ref.close(),
      error: () => this.toastService.error({summary: 'Não foi possível criar', detail: 'Tente novamente em alguns instantes.'})
    });
  }
}
