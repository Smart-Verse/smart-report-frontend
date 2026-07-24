import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {PageFormat, PageOrientation} from './page-layout';

export interface ReportTemplatePayload {
  idreport: string;
  js: string;
  html: string;
  css: string;
  data: string;
  pageFormat: PageFormat;
  pageOrientation: PageOrientation;
}

export interface ReportTemplateResponse extends ReportTemplatePayload {}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly httpClient: HttpClient) { }

  public saveTemplate(params: ReportTemplatePayload): Observable<any> {
    return this.httpClient.post<any>(`saveTemplate`,params);
  }

  public getTemplate(id: string): Observable<ReportTemplateResponse> {
    return this.httpClient.get<ReportTemplateResponse>(`getTemplate?idreport=${id}`);
  }

  public generateReport(params: any) : Observable<any> {
    return this.httpClient.post<any>(`generateReport`,params);
  }

  public getMetrics() : Observable<any> {
    return this.httpClient.get<any>(`getMetrics`);
  }
}
