import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment.development';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient,
    private cookieService: CookieService) { }

 
    getAllCategories(
      query?: string, sortBy?: string, sortDirection?: string,
      pageNumber?: number, pageSize?: number): Observable<Category[]> {
      let params = new HttpParams();
  
      if (query) {
        params = params.set('query', query)
      }
  
      if (sortBy) {
        params = params.set('sortBy', sortBy)
      }
  
      if (sortDirection) {
        params = params.set('sortDirection', sortDirection)
      }
  
      if (pageNumber) {
        params = params.set('pageNumber', pageNumber)
      }
  
      if (pageSize) {
        params = params.set('pageSize', pageSize)
      }
  
      return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/categories`, {
        params: params
      });
    }

    
  getCategoryById(id:string): Observable<Category>{
    return this.http.get<Category>(`${environment.apiBaseUrl}/api/categories/${id}`);
    
  }

  getCategoryCount(): Observable<number>{
    return this.http.get<number>(`${environment.apiBaseUrl}/api/categories/count`);
    
  }

  addCategory(model: AddCategoryRequest): Observable<void> {
    return this.http.post<void>('https://localhost:7072/api/categories?addAuth=true', model);
    //return this.http.post<void>('${environment.apiBaseUrl}/api/categories', model);

  }

  //This service will talk to API giving the id it needs also the object the body it needs
  //return observable back to the component
  //This service can be use inside the component.
  updateCategory(id:string, updateCategoryRequest: UpdateCategoryRequest) : Observable<Category>{
    return this.http.put<Category>(`${environment.apiBaseUrl}/api/categories/${id}?addAuth=true`,
     updateCategoryRequest);
  }

  //This service method will delete category based on id and in return it will give an observable of type Category
  deleteCategory(id:string): Observable<Category> {
    //use http client to make this http call
    //return keyword will return the observable back to the component
    return this.http.delete<Category>(`${environment.apiBaseUrl}/api/categories/${id}?addAuth=true`);
  }
}
