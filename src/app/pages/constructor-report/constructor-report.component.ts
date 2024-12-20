import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import { SplitterModule } from 'primeng/splitter';
import {MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG} from "ngx-monaco-editor-v2";
import { MenuModule } from 'primeng/menu';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-constructor-report',
  standalone: true,
  imports: [
    CommonModule,
    SharedCommonModule,
    SplitterModule,
    MonacoEditorModule,
    MenuModule
  ],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: 'assets',
      },
    },
  ],
  templateUrl: './constructor-report.component.html',
  styleUrl: './constructor-report.component.scss'
})
export class ConstructorReportComponent implements OnInit {

  id!: string;
  html: string = "";
  json: string = "";
  menuitens: MenuItem[] | undefined;

  editorJson = {theme: 'vs-dark', language: 'json'};
  editorHtml = {theme: 'vs-dark', language: 'html'};

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
    this.onConfigureMenus();
  }

  private onConfigureMenus() {
    this.menuitens = [
      {
        label: 'Modelo',
        command: () => {
        }
      },
      {
        label: 'Data',
        command: () => {
        }
      },
      {
        label: 'Assets',
        command: () => {
        }
      }
    ]
  }

}
