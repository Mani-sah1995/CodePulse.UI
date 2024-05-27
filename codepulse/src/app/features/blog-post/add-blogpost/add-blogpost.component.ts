import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Route, Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  isImageSelectorVisible: boolean = false;

  //Create class variable of type observable and observable of type category
  categories$?: Observable<Category[]>;
  imageSelectorSubscription?: Subscription;

  //Inject service in the constructor
  constructor(private blogPostService:BlogPostService, private router:Router,
     private categoryService: CategoryService,
    private imageService: ImageService){
    this.model={
      title:'',
      shortDescription:'',
      urlHandle:'',
      content:'',
      featuredImageUrl:'',
      author:'',
      isVisible:true,
      publishedDate: new Date(),
      categories:[]


    }
  }
  
  ngOnInit(): void {
    //now we have categories observable here that is coming from the service
    //we can use this observable and display the value in multiselect dropdown list
    this.categories$= this.categoryService.getAllCategories();

    this.imageSelectorSubscription=this.imageService.onSelectImage()
    .subscribe({
      next: (selectedImage) =>{
        this.model.featuredImageUrl = selectedImage.url;
        this.closeImageSelector();

      }
    })
  }
  onFormSubmit(): void{
    console.log(this.model);
    //To use the service instace we have to inject that inside the constructor
    this.blogPostService.createBlogPost(this.model)
    .subscribe({
      next: (response) =>{
        this.router.navigateByUrl('/admin/blogposts');

      }
    });
  }

  openImageSelector(): void{
    this.isImageSelectorVisible=true;

  }
  closeImageSelector(): void {
    this.isImageSelectorVisible=false;  
  }

  ngOnDestroy(): void {
    this.imageSelectorSubscription?.unsubscribe();
  }

}
