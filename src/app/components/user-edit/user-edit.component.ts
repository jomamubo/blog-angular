import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {global} from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
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
      url: global.url+'user/upload',
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
      selectFileBtn: 'Sube tu avatar de usuario',
      attachPinBtn: 'Sube tu avatar de usuario'      
    }
  }


  constructor(
      private _userService: UserService
    ) { 
    this.page_title = 'Ajustes de usuario';
    this.user = new User(1,'', '', 'ROLE_USER', '', '', '', '');
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.status = '';
    this.url = global.url;

    // Rellenar objeto usuario
    this.user = this.identity;

  }

  ngOnInit(): void {
  }

  onSubmit(form:any){
    this._userService.update(this.token, this.user).subscribe(
        response => {
          if(response && response.status){
            
            console.log(response);
            console.log(" respuesta tipo = " + typeof response);
            
            this.status = 'success';
            let respuesta = JSON.parse(JSON.stringify(response));

            //Actualizar usuario en sesion
            
            if(respuesta.changes.name){
              this.user.name = respuesta.changes.name;
            }
            if(respuesta.changes.surname){
              this.user.surname = respuesta.changes.surname;
            }
            if(respuesta.changes.email){
              this.user.email = respuesta.changes.email;
            }
            if(respuesta.changes.description){
              this.user.description = respuesta.changes.description;
            }
            if(respuesta.changes.image){
              this.user.image = respuesta.changes.image;
            }
            
            this.identity = this.user;
            localStorage.setItem('identity', JSON.stringify(this.identity));
            

          }else{
            this.status = 'error';
          }
          
          
        },
        error => {
          this.status='error';
          console.log(<any>error);
        }
      );
  }
  
  avatarUpload(datos:any){
    
    console.log("Aqui llega avatarUpload");
    console.log("datos = " + JSON.stringify(datos));
    //console.log("datos.status = " + datos.body.imagen);
    

    //this.user.image = datos.body.imagen;

  }
  
}
