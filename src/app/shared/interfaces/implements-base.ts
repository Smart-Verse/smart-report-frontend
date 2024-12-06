import {RequestData} from "../components/request-data";

export interface ImplementsBase {

  onLoadAllData($event: RequestData): void;
  onSave(obj: any): void;
  onUpdate(obj: any): void;
  onSelectedData($event: any): void;
  onOpenModal(obj: any): void;
}
