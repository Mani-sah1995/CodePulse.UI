import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-Image.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  private file?: File;
  fileName: string ='';
  title: string = '';

  //Create View child variable of form element which is in html
  //defining variable of the form element which is in the html
  //now we can use this variable to clear the form
  @ViewChild('form', {static:false}) imageUploadForm?: NgForm;

  //$ represents observable
  images$?: Observable<BlogImage[]>;

  constructor(private imageService: ImageService){}
  ngOnInit(): void {

    //It return an observable so we will store this observable which needs to create
    //this.images$ =this.imageService.getAllImages()
    //extract this into it's own private method so that we can use it few times inside the component

    this.getImages(); // Now we can use this in html


  }

  //When the change happens we will get the input element first and will get the files from here
  //and save it in a private variable
  onFileUploadChange(event: Event): void{
    const element= event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];

  }
  uploadImage(): void{
    if(this.file && this.fileName!=='' && this.title!== ''){
      //Image service to upload the image
      //in return it will give an observable to which we have to subscribe before actuall
      //we can use this method
      this.imageService.uploadImage(this.file, this.fileName, this.title)
      .subscribe({
        next: (response)=>{
          this.imageUploadForm?.resetForm();
          this.getImages();
        }
      });

    }
  }

  selectImage(image: BlogImage): void{
    //we want to pass the url that is selected to the parent component
    //we will make use of angular service - Image service to first save this selected image somewhere
    //and have an event observable change and edit component will listen to this change
    //passing the selected image to the image service which is subscribing from diff. component
    this.imageService.selectImage(image);
  }

  private getImages(){
    this.images$ =this.imageService.getAllImages()
  }

}
