import { Injectable } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor(private http:HttpClient) { }

  //This method will accept the AddBlogPost Model
  //Method will return an Observable of type BlogPost this is the same type API is returing to us
  //Now as a return type it will give observable of type BlogPost (Create Model for this) 
  createBlogPost(data: AddBlogPost): Observable<BlogPost> {
    //Here we will use http client so let's inject that inside the constructor
    return this.http.post<BlogPost>(`${environment.apiBaseUrl}/api/blogposts?addAuth=true`, data);
  }

  getAllBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogposts`);
  }
  getBlogPostById(id: string): Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}`);
  }
  updateBlopPost(id: string, updatedBlogPost: UpdateBlogPost): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`,updatedBlogPost);
  }
  deleteBlogPost(id: string): Observable<BlogPost>{
    return this.http.delete<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`);
  }
  getBlogPostByUrlHandle(urlHandle: string): Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${urlHandle}`);
  }
}
