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
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss'
})
export class StudioComponent extends StudioConfig implements AfterContentInit, OnInit {

  @ViewChild('tHtml') tHtml!: TemplateRef<any>;
  @ViewChild('tJson') tJson!: TemplateRef<any>;
  @ViewChild('tCss') tCss!: TemplateRef<any>;
  @ViewChild('tJs') tJs!: TemplateRef<any>;


  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) {
    super()
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
    this.currentTemplate = this.tHtml;
  }

  ngAfterContentInit(): void {

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
}
