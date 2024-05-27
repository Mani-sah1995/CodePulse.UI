import { Injectable } from '@angular/core';
import { BlogImage } from '../../models/blog-Image.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  //Behaviour subject is use to create observable to emit values to it's subscribers
  //we have to give the default value
  //behaviour subject are used so that we can trigger or emit multiple values of observable 
selectedImage: BehaviorSubject<BlogImage> = new BehaviorSubject<BlogImage>({
  id: '',
  fileExtension: '',
  fileName:'',
  title:'',
  url: ''
});

  constructor(private http:HttpClient) { }

  getAllImages(): Observable<BlogImage[]>{
    return this.http.get<BlogImage[]>(`${environment.apiBaseUrl}/api/images`)
  }

  //uploadImage service will return Observable of type BlogImage
  //Let's create a Model folder inside the shared folder 
  uploadImage(file: File, fileName: string, title: string): Observable<BlogImage>{

    //Construct a form
    const formData = new FormData();
    //Now we want to apend to this form
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);
    //Now we have formData ready

    //Now we will use http client so inject that inside the construcotr
    //post method will return BlogImage
    //Finally we use the return keyword and pass the observable back to the component
    //Now uploadImage service is rady now use it inside the component
    return this.http.post<BlogImage>(`${environment.apiBaseUrl}/api/images`, formData);


  }


  //It will change the value of behaviour subject
  selectImage(image: BlogImage): void{
    //use next method to emit value
    this.selectedImage.next(image); 

  }
  //This is the method that other component will subscribe to
  onSelectImage(): Observable<BlogImage>{
    return this.selectedImage.asObservable()
  }
}
