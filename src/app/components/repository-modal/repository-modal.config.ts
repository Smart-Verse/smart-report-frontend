import {FormGroup} from "@angular/forms";

export class RepositoryModalConfig {
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
    }
  ]

  convertToDTO(formGroup: FormGroup): any {
    return {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value
    };
  }
}
