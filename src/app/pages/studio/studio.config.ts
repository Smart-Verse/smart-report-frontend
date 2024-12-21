import {MenuItem, TreeNode} from "primeng/api";
import {TemplateRef} from "@angular/core";

export class StudioConfig {

  id!: string;
  html: string = "";
  json: string = "";
  css: string = "";
  js: string = "";
  menuItens: MenuItem[] | undefined;
  currentTemplate!: TemplateRef<any>;
  selected!: TreeNode;

  editorJson = {theme: 'vs-dark', language: 'json'};
  editorHtml = {theme: 'vs-dark', language: 'html'};
  editorCss = {theme: 'vs-dark', language: 'css'};
  editorJs = {theme: 'vs-dark', language: 'javascript'};

  tree: TreeNode[] = [
    {
      key: "name",
      label: 'Report',
      icon: 'pi pi-fw pi-inbox',
      expanded: true,
      children: [
        {
          key: '0-0',
          label: 'template',
          icon: 'pi pi-fw pi-file-word',
        },
        {
          key: '0-1',
          label: 'js',
          icon: 'pi pi-fw pi-cog',
        },
        {
          key: '0-3',
          label: 'css',
          icon: 'pi pi-fw pi-cog',
        },
        {
          key: '0-4',
          label: 'data',
          icon: 'pi pi-fw pi-database',
        }
      ]
    }
  ]
}
