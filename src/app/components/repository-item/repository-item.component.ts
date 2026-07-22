import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuModule} from 'primeng/menu';
import {TranslateService} from '../../shared/services/translate/translate.service';

@Component({
  selector: 'app-repository-item',
  imports: [MenuModule],
  templateUrl: './repository-item.component.html',
  styleUrl: './repository-item.component.scss'
})
export class RepositoryItemComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() itemType: 'repository' | 'report' = 'repository';
  @Input() selectedId?: string;
  @Input() emptyTitle = 'Nenhum item encontrado';
  @Input() emptyText = 'Não há itens para mostrar.';
  @Output() selectedItem = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  menuItems: MenuItem[] = [];
  currentItem: any;
  copiedId?: string;

  constructor(public readonly translateService: TranslateService) {}

  ngOnInit(): void {
    this.menuItems = [{
      label: this.translateService.translate('common_options'),
      items: [
        {label: this.translateService.translate('common_edit'), icon: 'pi pi-pencil', command: () => this.editItem.emit(this.currentItem)},
        {label: this.translateService.translate('common_delete'), icon: 'pi pi-trash', command: () => this.deleteItem.emit(this.currentItem)}
      ]
    }];
  }

  copyId(event: MouseEvent, item: any): void {
    event.stopPropagation();
    navigator.clipboard?.writeText(String(item.id)).then(() => {
      this.copiedId = item.id;
      window.setTimeout(() => this.copiedId = undefined, 1800);
    });
  }

  select(item: any): void { this.selectedItem.emit(item); }
  openMenu(event: MouseEvent, item: any, menu: any): void {
    event.stopPropagation();
    this.currentItem = item;
    menu.toggle(event);
  }
}
