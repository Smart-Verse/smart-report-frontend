import {FormGroup} from "@angular/forms";

export class ReportModalConfig {

  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'name',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'templateId',
      required: true,
      hidden: false,
      type: 'string'
    }
  ]

  convertToDTO(formGroup: FormGroup): any {
    return {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      templateId: formGroup.get('templateId')?.value,
      repository: formGroup.get('repository')?.value
    };
  }
}
