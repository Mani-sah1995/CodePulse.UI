import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.shouldInterceptRequest(request)){
        //Clon the request
      const authRequest = request.clone({
        setHeaders: {
          //Authorization is comming from cookie service so inject it into the constructor
          'Authorization': this.cookieService.get('Authorization')
        }
      });
  
      return next.handle(authRequest);
      
    }

    return next.handle(request);
  
    
    
  }

  //It will check the request url with parameters and checking for AddAuth keyword 
  private shouldInterceptRequest(request: HttpRequest<any>): boolean {
    return request.urlWithParams.indexOf('addAuth=true', 0) > -1? true: false;

  }
}
