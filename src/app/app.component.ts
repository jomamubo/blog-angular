import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { global } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'Blog de Angular';
  public identity: any;
  public token: any;
  public url;
  public categories: any;

  constructor(
    public _userService: UserService,
    private _categoryService: CategoryService

  ){
    this.loadUser();
    this.url=global.url;
  }

  ngOnInit(){
    // console.log("aplicacion cargada correctamente");
    this.getCategories();
  }

  ngDoCheck(){
    this.loadUser(); 
  }


  loadUser(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();

    // console.log('loadUser, this.token = ' + this.token + " this.identity = " + this.identity);
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status=='success'){
          this.categories = response.categories;
          // console.log(this.categories);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
