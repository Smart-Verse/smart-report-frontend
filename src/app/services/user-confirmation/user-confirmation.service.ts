import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserConfirmationService {

  constructor(private readonly httpClient: HttpClient) { }


  public onValidURL(params: any) : Observable<any> {
    return this.httpClient.get<any>(`verifyURL?token=${params}`);
  }
}
