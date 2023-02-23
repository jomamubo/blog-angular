import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public page_title: string;
  public identity: any;
  public token: any;
  public post: Post;
  public categories: any;
  public status: any;
  public is_edit: boolean;
  public url: string;

  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat']
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: 50,
    uploadAPI:  {
      url: global.url+'post/upload',
      headers: {
        "Authorization" : this._userService.getToken(),
        "Content-Type": "multipart/form-data"
      }
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts:{
      selectFileBtn: 'Sube tu imagen de post',
      attachPinBtn: 'Sube tu imagen de post'
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService

  ) { 

    this.page_title = "Crear una entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1, this.identity.id, 1, '', '', '', null);
    this.is_edit = false;
    this.url = global.url;  
  }

  ngOnInit(): void {

    this.getCategories();
    // console.log("this-identity )=" + JSON.stringify(this.identity));
    // this.post = new Post(1, this.identity.id, 1, '', '', '', null);
    // console.log(this.post);
    console.log("post-new.component   this._userService.getToken() = " + this._userService.getToken());

  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status == "success"){
          this.categories = response.categories;        }
          // console.log("Categorias = " + JSON.stringify(this.categories));
      },
      error => {
        console.log(error);
      }
    );
  }

  imageUpload(data:any){

    // console.log("imageUpload data.response = " + data.response);
    // let image_data = JSON.parse(data.response);
    //console.log("data = " + JSON.stringify(data));

    // this.post.image = data.body.image;

    console.log("Subimos la imagen");
  }

  onSubmit(form:any){

    console.log(this._postService.create(this.token, this.post));

    this._postService.create(this.token, this.post).subscribe(
      response => {

        let respuesta = JSON.parse(JSON.stringify(response));

        /*
        console.log("respuesta = " + respuesta);
        console.log("respuesta.code = " + respuesta.code);
        console.log("respuesta.post = " + respuesta.post);
        console.log("respuesta.post.title = " + respuesta.post.title);
        */
        
        if(respuesta && respuesta.status=='success'){
          this.post = respuesta.post;
          this.status= 'success';
          this._router.navigate(['/inicio']);
        }else{
          this.status='error';
        }
        
      },
      error=>{
        console.log(' HA HABIDO UN ERROR LLAMANDO AL POSTSERVICE error');
        this.status='error';
      }
    );
  }

}
