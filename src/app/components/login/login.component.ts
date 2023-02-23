import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
    public page_title: string;
    public user: User;
    public status: string;
    public token: any;
    public identity: any;

  constructor(
      private _userService: UserService,
      private _router: Router,
      private _route: ActivatedRoute
    ) { 
    this.page_title = 'Identifícate';
    this.user =  new User(7,'Juana','García','ROLE_USER','','','','B_Contactar.jpg');
    this.status = '';

  }

  ngOnInit(): void {
    // Se ejecuta siempre que se cargue el componente
    // y cierra sesión sólo cuando le llega el parametro sure por la URL
    this.logout();
  }

  onSubmit(form:any){
    //console.log(this.user);
    this._userService.signup(this.user).subscribe(
        response=>{
          
          //TOKEN
          if(response.status != 'error'){
            this.status = 'success';
            this.token = response;

            // OBJETO USUARIO IDENTIFICADO 
            this._userService.signup(this.user).subscribe(
              response=>{
                  this.identity = response;

                  // Persistir datos de usuario identificado
                  // console.log(this.token);
                  console.log(this.user);
                  localStorage.setItem('token', this.token);
                  localStorage.setItem('identity', JSON.stringify(this.user));
                  
                  // Redireccion a inicio
                  this._router.navigate(['inicio']);

              },
              error=>{
                this.status = 'error';
                console.log(<any>error);
              }
            );
          }else{
            this.status='error';
          }
        },
        error=>{
          this.status = 'error';
          console.log(<any>error);
        }
      );
  }

  logout(){
    this._route.params.subscribe(params=>{
      let logout = +params['sure'];

      // console.log("estoy en logout");

      if(logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.identity=null;
        this.token=null;

        // Redireccion a inicio
        this._router.navigate(['inicio']);

      }

    });
  }
}
