import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  showLoading   = new Subject<boolean>();

  constructor() { }
}
