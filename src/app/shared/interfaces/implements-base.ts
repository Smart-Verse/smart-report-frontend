import {RequestData} from "../components/request-data";
import {DataTable} from "../components/datatable/datatable";

export interface ImplementsBase {

  datatable: DataTable;
  onGetAll($event: RequestData): void;
  onGet(obj: any): void;
  onSave(obj: any): void;
  onUpdate(obj: any): void;
  onSelectedData($event: any): void;
  onOpenModal(obj: any): void;
  onSetPropertiesDatatable(obj: any): void
}
