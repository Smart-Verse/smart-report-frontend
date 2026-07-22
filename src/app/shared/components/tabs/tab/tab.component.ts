import {Component, Input} from '@angular/core';


@Component({
    selector: 'app-tab',
    imports: [],
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss'
})
export class TabComponent {

  @Input() label = '';
  @Input() active = false;

}
