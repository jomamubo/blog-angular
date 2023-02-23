import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

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

    this.page_title = "Editar entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1, this.identity.id, 1, '', '', '', null);
    this.is_edit = true;
    this.url = global.url;  

  }

  ngOnInit(): void {
    this.getCategories();
    this.getPost();
  }

  getPost(){
    // Sacar el id del post de la url
    this._route.params.subscribe(params=>{
      
      let id = +params['id'];

      // Peticion ajax para sacar lo datos del post
      this._postService.getPost(id).subscribe(
        response=> {
          if(response.status=='success'){
            this.post=response.posts;
            console.log('post.user_id = ' + this.post.user_id)
            console.log('identity.sub = ' + this.identity.id);
                
            if(this.post.user_id != this.identity.id){
               this._router.navigate(['/inicio']);
            }

          }else{
            this._router.navigate(['/inicio']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/inicio'])
        }
      );
      
    });

    
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status == "success"){
          this.categories = response.categories;        
        }
          // console.log("Categorias = " + JSON.stringify(this.categories));
      },
      error => {
        console.log(error);
      }
    );
  }

  imageUpload(data:any){

    // console.log("imageUpload data.response = " + data.response);
    // console.log("data = " + JSON.stringify(data));
    
    /*
    let image_data = JSON.parse(data.response);
    this.post.image = image_data.image;
    */
    // console.log("Subimos la imagen");
  }

  onSubmit(form:any){

    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response=>{
        if(response.status=='success'){
          this.status = 'success';
          // this.post = response.post;
          
          // redigir a la pagina del post
          this._router.navigate(['/entrada', this.post.id]);

        }else{
          this.status='error';
        }
      },
      error=>{
          this.status='error';
      }
    );
  }


}
