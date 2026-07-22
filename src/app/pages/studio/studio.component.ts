import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {StudioConfig} from './studio.config';
import {ReportService} from '../../services/report/report.service';
import {LoadingService} from '../../shared/services/loading/loading.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {base64ToBlob} from '../../shared/util/constants';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {CodeEditorComponent, CodeEditorLanguage} from '../../shared/components/code-editor/code-editor.component';

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
  readonly files: StudioFile[] = [
    {key: 'html', name: 'template.html', description: 'Estrutura do relatório', icon: 'pi pi-code', language: 'html', badge: 'HTML'},
    {key: 'css', name: 'styles.css', description: 'Aparência e impressão', icon: 'pi pi-palette', language: 'css', badge: 'CSS'},
    {key: 'javascript', name: 'script.js', description: 'Comportamento do template', icon: 'pi pi-bolt', language: 'javascript', badge: 'JS'},
    {key: 'json', name: 'data.json', description: 'Dados para visualização', icon: 'pi pi-database', language: 'json', badge: 'JSON'}
  ];
  activeFileKey: StudioFileKey = 'html';
  hasUnsavedChanges = false;
  lastSavedAt?: Date;
  copiedReportId = false;

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
    const param = {idreport: this.id, js: this.js, html: this.html, css: this.css, data: this.json};
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
