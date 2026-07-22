import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';

export interface ApiKeySummary {
  id: string;
  name: string;
  keyPrefix: string;
  active: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export interface CreatedApiKey {
  id: string;
  name: string;
  apiKey: string;
  keyPrefix: string;
  createdAt: string;
  expiresAt?: string;
}

@Injectable({providedIn: 'root'})
export class ApiKeyService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<ApiKeySummary[]> {
    return this.http.get<{output: ApiKeySummary[]}>('getApiKeys').pipe(map(response => response.output));
  }

  create(name: string): Observable<CreatedApiKey> {
    return this.http.post<{output: CreatedApiKey}>('createApiKey', {name, expiresAt: null})
      .pipe(map(response => response.output));
  }

  revoke(id: string): Observable<boolean> {
    return this.http.post<{result: boolean}>('revokeApiKey', {id}).pipe(map(response => response.result));
  }
}
