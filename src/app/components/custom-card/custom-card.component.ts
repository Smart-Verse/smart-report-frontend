import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-custom-card',
    imports: [
        CommonModule
    ],
    templateUrl: './custom-card.component.html',
    styleUrl: './custom-card.component.scss'
})
export class CustomCardComponent {

  @Input() backgroundColor: string = "";
  @Input() title: string = "";
  @Input() value: number = 0;

}
