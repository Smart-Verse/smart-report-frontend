import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-custom-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './custom-card.component.html',
  styleUrl: './custom-card.component.scss'
})
export class CustomCardComponent {

  @Input() backgroundColor: string = "";
  @Input() title: string = "";
  @Input() value: string = "";

}
