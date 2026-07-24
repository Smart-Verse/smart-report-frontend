import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {StudioConfig} from './studio.config';
import {ReportService} from '../../services/report/report.service';
import {LoadingService} from '../../shared/services/loading/loading.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {base64ToBlob} from '../../shared/util/constants';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {CodeEditorComponent, CodeEditorLanguage} from '../../shared/components/code-editor/code-editor.component';
import {
  isThermalPageFormat,
  normalizePageFormat,
  normalizePageOrientation,
  PAGE_FORMATS,
  PAGE_ORIENTATIONS,
  PageFormat,
  PageOrientation,
  pageFormatLabel,
  pagePreviewAspectRatio
} from '../../services/report/page-layout';
import {
  appendSnippetOnce, mergeComponentData, REPORT_COMPONENT_CATEGORIES, REPORT_COMPONENTS,
  ReportComponentCategory, ReportComponentSnippet
} from './report-component-catalog';

type StudioFileKey = 'html' | 'css' | 'javascript' | 'json';
interface StudioFile { key: StudioFileKey; name: string; description: string; icon: string; language: CodeEditorLanguage; badge: string; }

@Component({
  selector: 'app-constructor-report',
  imports: [SharedCommonModule, CodeEditorComponent],
  providers: [ReportService, ToastService],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss'
})
export class StudioComponent extends StudioConfig implements OnInit {
  @ViewChild(CodeEditorComponent) private codeEditor?: CodeEditorComponent;
  readonly files: StudioFile[] = [
    {key: 'html', name: 'template.html', description: 'Estrutura do relatório', icon: 'pi pi-code', language: 'html', badge: 'HTML'},
    {key: 'css', name: 'styles.css', description: 'Aparência e impressão', icon: 'pi pi-palette', language: 'css', badge: 'CSS'},
    {key: 'javascript', name: 'script.js', description: 'Comportamento do template', icon: 'pi pi-bolt', language: 'javascript', badge: 'JS'},
    {key: 'json', name: 'data.json', description: 'Dados para visualização', icon: 'pi pi-database', language: 'json', badge: 'JSON'}
  ];
  readonly pageFormats = PAGE_FORMATS;
  readonly componentCategories = REPORT_COMPONENT_CATEGORIES;
  readonly components = REPORT_COMPONENTS;
  readonly pageOrientations = PAGE_ORIENTATIONS;
  activeFileKey: StudioFileKey = 'html';
  pageFormat: PageFormat = 'A4';
  pageOrientation: PageOrientation = 'PORTRAIT';
  hasUnsavedChanges = false;
  lastSavedAt?: Date;
  copiedReportId = false;
  toolboxOpen = true;
  componentSearch = '';
  activeComponentCategory: 'all' | ReportComponentCategory = 'all';
  lastInsertedComponent?: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly reportService: ReportService,
    private readonly loadingService: LoadingService,
    private readonly toastService: ToastService,
    public readonly translateService: TranslateService
  ) { super(); }

  get activeFile(): StudioFile { return this.files.find(file => file.key === this.activeFileKey) ?? this.files[0]; }
  get activeContent(): string {
    switch (this.activeFileKey) {
      case 'css': return this.css;
      case 'javascript': return this.js;
      case 'json': return this.json;
      default: return this.html;
    }
  }
  get lineCount(): number { return this.activeContent ? this.activeContent.split(/\r?\n/).length : 1; }
  get availablePageOrientations() {
    return isThermalPageFormat(this.pageFormat)
      ? this.pageOrientations.filter(option => option.value === 'PORTRAIT')
      : this.pageOrientations;
  }
  get filteredComponents(): readonly ReportComponentSnippet[] {
    const query = this.componentSearch.trim().toLocaleLowerCase('pt-BR');
    return this.components.filter(item => {
      const categoryMatches = this.activeComponentCategory === 'all' || item.category === this.activeComponentCategory;
      const textMatches = !query || `${item.name} ${item.description} ${item.files.join(' ')}`.toLocaleLowerCase('pt-BR').includes(query);
      return categoryMatches && textMatches;
    });
  }
  get pagePreviewRatio(): string { return pagePreviewAspectRatio(this.pageFormat, this.pageOrientation); }
  get pageLayoutLabel(): string {
    const format = pageFormatLabel(this.pageFormat);
    if (isThermalPageFormat(this.pageFormat)) return `${format} · altura automática`;
    return `${format} · ${this.pageOrientation === 'LANDSCAPE' ? 'Paisagem' : 'Retrato'}`;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => this.id = params.get('id') || '');
    this.onGet();
  }
  copyReportId(): void {
    navigator.clipboard?.writeText(this.id).then(() => {
      this.copiedReportId = true;
      window.setTimeout(() => this.copiedReportId = false, 1800);
    });
  }

  goBack(): void {
    if (!this.hasUnsavedChanges || window.confirm('Existem alterações não salvas. Deseja sair mesmo assim?')) {
      this.router.navigate(['home', 'repository']);
    }
  }

  selectFile(file: StudioFile): void { this.activeFileKey = file.key; }
  selectComponentCategory(category: 'all' | ReportComponentCategory): void { this.activeComponentCategory = category; }
  insertComponent(item: ReportComponentSnippet): void {
    const htmlWasActive = this.activeFileKey === 'html';
    if (htmlWasActive) {
      this.codeEditor?.insertAtCursor(item.html);
    } else {
      this.html = `${this.html.trimEnd()}${this.html.trim() ? '\n' : ''}${item.html}`;
      this.activeFileKey = 'html';
    }

    const marker = `sr:component:${item.id}`;
    this.css = appendSnippetOnce(this.css, item.css, marker);
    this.js = appendSnippetOnce(this.js, item.javascript, marker);
    try {
      this.json = mergeComponentData(this.json, item.data);
    } catch {
      this.toastService.error({summary: 'Componente adicionado sem dados', detail: 'O data.json atual é inválido. O HTML e o CSS foram inseridos, mas revise o JSON para incluir os dados de exemplo.'});
    }
    this.hasUnsavedChanges = true;
    this.lastInsertedComponent = item.id;
    window.setTimeout(() => {
      if (!htmlWasActive) this.codeEditor?.insertAtCursor('');
      if (this.lastInsertedComponent === item.id) this.lastInsertedComponent = undefined;
    }, 1600);
  }
  changePageFormat(format: PageFormat): void {
    this.pageFormat = format;
    if (isThermalPageFormat(format)) this.pageOrientation = 'PORTRAIT';
    this.hasUnsavedChanges = true;
  }
  changePageOrientation(orientation: PageOrientation): void {
    this.pageOrientation = isThermalPageFormat(this.pageFormat) ? 'PORTRAIT' : orientation;
    this.hasUnsavedChanges = true;
  }
  updateActiveContent(content: string): void {
    switch (this.activeFileKey) {
      case 'css': this.css = content; break;
      case 'javascript': this.js = content; break;
      case 'json': this.json = content; break;
      default: this.html = content;
    }
    this.hasUnsavedChanges = true;
  }
  formatJson(): void {
    if (this.activeFileKey !== 'json') return;
    try {
      this.json = JSON.stringify(JSON.parse(this.json), null, 2);
      this.hasUnsavedChanges = true;
    } catch {
      this.toastService.error({summary: 'JSON inválido', detail: 'Revise a estrutura antes de formatar.'});
    }
  }
  onSave(generated = false): void {
    this.loadingService.showLoading.next(true);
    const param = {
      idreport: this.id,
      js: this.js,
      html: this.html,
      css: this.css,
      data: this.json,
      pageFormat: this.pageFormat,
      pageOrientation: this.pageOrientation
    };
    this.reportService.saveTemplate(param).subscribe({
      next: () => {
        this.loadingService.showLoading.next(false);
        this.hasUnsavedChanges = false;
        this.lastSavedAt = new Date();
        generated ? this.onGenerate() : this.toastService.success({summary: 'SmartVerse', detail: 'Salvo com sucesso'});
      },
      error: () => this.loadingService.showLoading.next(false)
    });
  }
  onGet(): void {
    this.loadingService.showLoading.next(true);
    this.reportService.getTemplate(this.id).subscribe({
      next: data => {
        this.js = data.js ?? ''; this.json = data.data ?? ''; this.html = data.html ?? ''; this.css = data.css ?? '';
        this.pageFormat = normalizePageFormat(data.pageFormat);
        this.pageOrientation = isThermalPageFormat(this.pageFormat)
          ? 'PORTRAIT'
          : normalizePageOrientation(data.pageOrientation);
        this.hasUnsavedChanges = false;
        this.loadingService.showLoading.next(false);
      },
      error: () => this.loadingService.showLoading.next(false)
    });
  }
  onGenerate(): void {
    this.loadingService.showLoading.next(true);
    this.reportService.generateReport({data: null, idreport: this.id}).subscribe({
      next: data => {
        const blobUrl = URL.createObjectURL(base64ToBlob(data.report));
        window.open(blobUrl, '_blank');
        this.loadingService.showLoading.next(false);
      },
      error: () => this.loadingService.showLoading.next(false)
    });
  }
}
