import { Component } from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {FloatLabelModule} from "primeng/floatlabel";
import {TooltipModule} from "primeng/tooltip";
import {FieldsService} from "../../../services/fields/fields.service";
import {DatePickerModule} from "primeng/datepicker";
import {SelectModule} from "primeng/select";
import {AutoFocusModule} from "primeng/autofocus";
import {AutoCompleteModule} from "primeng/autocomplete";
import {AppControlValueAccessor} from "../../app-control-value";

@Component({
    selector: 'app-input-date',
    imports: [
        CommonModule,
        DatePickerModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        TooltipModule,
        SelectModule,
        AutoFocusModule,
        AutoCompleteModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: InputDateComponent,
            multi: true
        }
    ],
    templateUrl: './input-date.component.html',
    styleUrl: './input-date.component.scss'
})
export class InputDateComponent extends AppControlValueAccessor {

  constructor(
    private readonly fieldServiceInputText: FieldsService,
  ){
    super(fieldServiceInputText)
  }
}
