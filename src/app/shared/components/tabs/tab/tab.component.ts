import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss'
})
export class TabComponent {

  @Input() label = '';
  @Input() active = false;

}
