import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post-model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit{

  blogPosts$?: Observable<BlogPost[]>;

  constructor(private blogPostService: BlogPostService){

  }
  ngOnInit(): void {
    //Get all blog post from API
    //	Because we use this data only for display purposes we are not assigning it to a form we can use async pipe 
    //	Async pipe in template will automatically handle the subscription and the un-subscription for us

    this.blogPosts$ = this.blogPostService.getAllBlogPosts();

  }

}
