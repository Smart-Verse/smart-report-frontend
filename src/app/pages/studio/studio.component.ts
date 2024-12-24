import {AfterContentInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import { SplitterModule } from 'primeng/splitter';
import {MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG} from "ngx-monaco-editor-v2";
import { MenuModule } from 'primeng/menu';
import {MenuItem} from "primeng/api";
import {TreeModule, TreeNodeSelectEvent} from 'primeng/tree';
import {StudioConfig} from "./studio.config";
import {ReportService} from "../../services/report/report.service";
import {LoadingService} from "../../shared/services/loading/loading.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {base64ToBlob} from "../../shared/util/constants";

@Component({
  selector: 'app-constructor-report',
  standalone: true,
  imports: [
    CommonModule,
    SharedCommonModule,
    SplitterModule,
    MonacoEditorModule,
    MenuModule,
    TreeModule
  ],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: 'assets',
      },
    },
    ReportService,
    ToastService
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss'
})
export class StudioComponent extends StudioConfig implements OnInit {

  @ViewChild('tHtml') tHtml!: TemplateRef<any>;
  @ViewChild('tJson') tJson!: TemplateRef<any>;
  @ViewChild('tCss') tCss!: TemplateRef<any>;
  @ViewChild('tJs') tJs!: TemplateRef<any>;


  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly reportService: ReportService,
    private readonly loadingService: LoadingService,
    private readonly toastService: ToastService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
    this.currentTemplate = this.tHtml;
    this.onGet();
  }

  nodeSelect($event: TreeNodeSelectEvent) {
    switch ($event.node.label){
      case 'js':
        this.currentTemplate = this.tJs;
        break;
      case 'css':
        this.currentTemplate = this.tCss;
        break;
      case 'template':
        this.currentTemplate = this.tHtml;
        break;
      case 'data':
        this.currentTemplate = this.tJson;
        break;
    }
  }

  onSave(){
    this.loadingService.showLoading.next(true);
    var param = {
      idreport: this.id,
      js: this.js,
      html: this.html,
      css: this.css,
      data: this.json
    }
    this.reportService.saveTemplate(param).subscribe({
      next: (data) => {
        this.loadingService.showLoading.next(false);
        this.toastService.success({summary: "SmartVerse", detail: "Salvo com sucesso"});
      },
      error: error => {
        this.loadingService.showLoading.next(false);
      }
    })
  }

  onGet(){
    this.loadingService.showLoading.next(true);
    this.reportService.getTemplate(this.id).subscribe({
      next: (data) => {
        this.js = data.js;
        this.json = data.data;
        this.html = data.html;
        this.css = data.css;
        this.loadingService.showLoading.next(false);
      },
      error: error => {
        this.loadingService.showLoading.next(false);
      }
    })
  }

  onGenerate(){
    this.loadingService.showLoading.next(true);
    const param = {
      data: "",
      idreport: this.id
    }
    this.reportService.generateReport(param).subscribe({
      next: (data) => {
        const pdfBlob = base64ToBlob(data.report);
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
        this.loadingService.showLoading.next(false);
      },
      error: error => {
        this.loadingService.showLoading.next(false);
      }
    })
  }
}
