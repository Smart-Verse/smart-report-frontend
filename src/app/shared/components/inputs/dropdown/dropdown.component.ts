import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {TooltipModule} from "primeng/tooltip";
import {SelectModule} from "primeng/select";
import {FieldsService} from "../../../services/fields/fields.service";
import {AutoCompleteModule} from "primeng/autocomplete";
import {AutoFocusModule} from "primeng/autofocus";
import {AppControlValueAccessor} from "../../app-control-value";


@Component({
    selector: 'app-dropdown',
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        TooltipModule,
        AutoCompleteModule,
        AutoFocusModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DropdownComponent,
            multi: true
        }
    ],
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.scss'
})
export class DropdownComponent extends AppControlValueAccessor {

  @Input() options: any[] = [];
  @Input() optionLabel: string = "";

  constructor(
    private readonly fieldServiceInputText: FieldsService,
  ){
    super(fieldServiceInputText)
  }
}
