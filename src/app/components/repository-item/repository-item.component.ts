import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";
import {TranslateService} from "../../shared/services/translate/translate.service";

@Component({
  selector: 'app-repository-item',
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
  ],
  templateUrl: './repository-item.component.html',
  styleUrl: './repository-item.component.scss'
})
export class RepositoryItemComponent implements OnInit {

  @Input() repositorys: any[] = [];
  @Output() selectedItem: EventEmitter<any> = new EventEmitter();
  @Output() deleteItem = new EventEmitter();
  _menu: MenuItem[] | undefined;
  _currentItem: any;

  constructor(
    public readonly translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.onConfigureMenus();
  }

  onSelectedItem(item: any): void {
    this.selectedItem.emit(item);
  }

  private onConfigureMenus(){
    this._menu = [
      {
        label: this.translateService.translate("common_options"),
        items: [
          {
            label: this.translateService.translate("common_edit"),
            command: () => {
            }
          },
          {
            label: this.translateService.translate("common_delete"),
            command: () => {
              this.deleteItem.emit(this._currentItem);
            }
          }
        ]
      }

    ]
  }

  onOver(item: any) {
    this._currentItem = item;
  }
}
