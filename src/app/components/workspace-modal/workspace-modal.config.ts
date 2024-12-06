import {FormGroup} from "@angular/forms";

export class WorkspaceModalConfig {
  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'description',
      required: true,
      hidden: false,
      type: 'string'
    }
  ]

  convertToDTO(formGroup: FormGroup): any {
    return {
      id: formGroup.get('id')?.value,
      description: formGroup.get('description')?.value
    };
  }
}
