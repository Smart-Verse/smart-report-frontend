import {FormGroup} from "@angular/forms";

export class ReportModalConfig {
  fields: any[] = [
    {fieldName: 'id', required: false, hidden: false, type: 'string'},
    {fieldName: 'name', required: true, hidden: false, type: 'string'},
    {fieldName: 'repository', required: false, hidden: false, type: 'string'},
    {fieldName: 'templateType', required: true, hidden: false, type: 'string'},
    {fieldName: 'pageFormat', required: true, hidden: false, type: 'string'},
    {fieldName: 'pageOrientation', required: true, hidden: false, type: 'string'}
  ];

  convertToDTO(formGroup: FormGroup): any {
    return {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      repository: formGroup.get('repository')?.value,
      templateType: formGroup.get('templateType')?.value,
      pageFormat: formGroup.get('pageFormat')?.value,
      pageOrientation: formGroup.get('pageOrientation')?.value
    };
  }
}
