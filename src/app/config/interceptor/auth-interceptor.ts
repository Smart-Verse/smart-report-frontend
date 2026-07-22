import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";

import { Router } from "@angular/router";
import { inject } from "@angular/core";

import { environment } from "../../../environments/environment";
import {EnumCookie} from "../../shared/services/cookies/cookie.enum";
import {CookiesService} from "../../shared/services/cookies/cookies.service";


export function authInterceptor(originalRequest: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const cookiesService = inject(CookiesService);
    const router = inject(Router);
    //const toastService = inject(ToastService, { optional: true });

    let request: HttpRequest<unknown>;

    let headers = new HttpHeaders();
    if(cookiesService.get(EnumCookie.AUTHORIZATION) !== null){
      headers = headers.set('Authorization', "Bearer " + cookiesService.get(EnumCookie.AUTHORIZATION));
    }

    if(urlPermission(originalRequest)){
      request = originalRequest.clone({
        url: `${originalRequest.url}`,
      });
    } else {
      request = originalRequest.clone({
        headers: headers,
        url: `${environment.apiUrl}/${originalRequest.url}`,
      });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {

            if(error.status === 401){
              cookiesService.clearClientSession();
              router.navigateByUrl('/login', {replaceUrl: true});
            }

            return throwError(() => error);
          })
    );
}
export function urlPermission(request: HttpRequest<unknown>): boolean {
  const url = request.url;
  return url.includes("/assets/") || url.startsWith("assets/") || url.includes("amazon");
}
