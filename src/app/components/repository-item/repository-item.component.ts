import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-repository-item',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './repository-item.component.html',
  styleUrl: './repository-item.component.scss'
})
export class RepositoryItemComponent {

  @Input() repositorys: any[] = []
  @Output() selectedItem: EventEmitter<any> = new EventEmitter();

  onSelectedItem(item: any): void {
    this.selectedItem.emit(item);
  }

}
