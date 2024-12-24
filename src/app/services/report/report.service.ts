import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly httpClient: HttpClient) { }

  public saveTemplate(params: any) : Observable<any> {
    return this.httpClient.post<any>(`saveTemplate`,params);
  }

  public generateReport(params: any) : Observable<any> {
    return this.httpClient.post<any>(`saveTemplate`,params);
  }
}
