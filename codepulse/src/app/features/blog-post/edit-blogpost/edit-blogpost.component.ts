import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post-model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy{
  id: string | null =null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
isImageSelectorVisible: boolean = false;


  selectedCategories?: string[];
  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  imageSelectSubscription?: Subscription;

  constructor(private route:ActivatedRoute,
  private blogPostService: BlogPostService,
  private categoryService: CategoryService,
  private router: Router,
 private imageService: ImageService) //Inject router in the constructor to navigate to specified url
  { 

  }
  
  ngOnInit(): void {
  
   this.categories$= this.categoryService.getAllCategories();

   this.routeSubscription=this.route.paramMap.subscribe({
    next: (params) =>{
      this.id=params.get('id'); // now we can use this.id inside our template
      //Get blogPost from API\
      if(this.id){
        this.getBlogPostSubscription =this.blogPostService.getBlogPostById(this.id).subscribe({
          next: (response) =>{
              this.model=response;
              this.selectedCategories=response.categories.map(x=>x.id);              
          }
        });
      }

      this.imageSelectSubscription=this.imageService.onSelectImage()
      .subscribe({
        next: (response) =>{
          //response can be stored in local variable
          if(this.model){
            this.model.featuredImageUrl=response.url;
            this.isImageSelectorVisible=false;
          }

        }
          
      })
      

    }
   });
  }

  //OnFormSubmit() method talks to the service which talks to the api and update the result for us
  //When it is successful it redirects back to the list page
  onFormSubmit(): void{
  //Convert this model to request object
  //when we call the onFormSubmit we first have to re map the model to this update method
  if(this.model && this.id){
    //Now this object we can pass to API via the service.
    var updateBlogPost: UpdateBlogPost = {
      author:this.model.author,
      content:this.model.content,
      shortDescription:this.model.shortDescription,
      featuredImageUrl:this.model.featuredImageUrl,
      isVisible:this.model.isVisible,
      publishedDate:this.model.publishedDate,
      title:this.model.title,
      urlHandle: this.model.urlHandle,
      categories: this.selectedCategories ?? []
    };
    this.updateBlogPostSubscription =this.blogPostService.updateBlopPost(this.id, updateBlogPost)
    .subscribe({  //Because we are subscribing to this observable we have to unsubscribe it 
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      }
    });
  }
  //use service 
 
  }
  onDelete(): void{
    if(this.id){
      // if this.id not defined it will call service and delete blogpost
      this.deleteBlogPostSubscription =this.blogPostService.deleteBlogPost(this.id)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }

  openImageSelector(): void{
    this.isImageSelectorVisible=true;

  }
  closeImageSelector(): void {
    this.isImageSelectorVisible=false;  
  }
  ngOnDestroy(): void {
   this.routeSubscription?.unsubscribe();
   this.updateBlogPostSubscription?.unsubscribe();
   this.getBlogPostSubscription?.unsubscribe();
   this.deleteBlogPostSubscription?.unsubscribe();
   this.imageSelectSubscription?.unsubscribe();
  }

}
