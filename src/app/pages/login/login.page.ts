import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userinfo:User;
  public userdata:any;
  public logForm: FormGroup | any;
  


  constructor(private platform:Platform, private authS:AuthService, private router:Router, private formBuilder:FormBuilder) {
      this.logForm = this.formBuilder.group({
        'email': ['',[Validators.email, Validators.required]],
        'password': ['',[Validators.required, Validators.minLength(4)]]
      });
   }

  ngOnInit() {
  }
  /**
   * Comprueba si el usuario esta registras y lo envia a una nueva pantalla
   */
  ionViewWillEnter(){
    if(this.authS.isLogged){
      this.router.navigate(['/private/tabs/tab1']);
    }
  }
  
  public async singinGoogle(){
    try {
      await this.authS.loginGoogle();
      this.router.navigate(['private/tabs/tab1']);
    } catch (error) {
      console.log(error);
    }
    
  }

  onSubmit(){
    this.userdata=this.saveUserdata();
    this.authS.loginEmailUser(this.userdata).then(data=>{
      if(data){
        this.router.navigate(['private/tabs/tab1']);
      }
    }).catch(error =>{
      console.log(error);
    }   
    );
  }

  public saveUserdata(){
    const saveUserdata = {
      email: this.logForm.get('email').value,
      password: this.logForm.get('password').value,
    };
    return saveUserdata;
  }

}
