import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

type NewType = Subscription;

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent  implements OnInit, OnDestroy{

  id: string | null=null;
  paramsSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  category?: Category;
  constructor(private route: ActivatedRoute, private categoryService: CategoryService, private router:Router){

  }
  
  ngOnInit(): void {
    this.paramsSubscription=this.route.paramMap.subscribe({
      next: (params) =>{
        this.id = params.get('id');
        if(this.id){
          //get the data from the API for this id
          this.categoryService.getCategoryById(this.id)
          .subscribe({
            next: (response) =>{
              this.category=response;

            }
          })
        }
      }
    });
  }
  //onFormSubmit() method calling the service and service calling the API
  onFormSubmit():void{
    const updateCategoryRequest: UpdateCategoryRequest ={
      name: this.category?.name ??'',
      urlHandle:this.category?.urlHandle ?? ''
    };

    
    //pass this object to service
    //using service to connect to api but call won't start before we actually subscribe to this
    //as this is the subscription we also have to unsubscribe it.
    //create a subscription and assign to from whenever we are subscribing to it
    //on ngOnDestroy we will unsubscribe it.
    //passing id and request object(needs in body) 
    // if this comes back with response then we navigate to different page
    if(this.id) //checking if category id is defined
      {
      this.editCategorySubscription=this.categoryService.updateCategory(this.id, updateCategoryRequest)
      .subscribe({
        next: (response) => 
          {
          this.router.navigateByUrl('/admin/categories');
        }
      });
    }
    

  }

  onDelete(): void {
    if(this.id) // Use this.id when id is defined{
      this.categoryService.deleteCategory(this.id) //This is an observable so we have to subscribe to observable
      .subscribe({
        next: (response) =>{
          this.router.navigateByUrl('/admin/categories');
        }
      });
    }
    

  

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
  }
}
