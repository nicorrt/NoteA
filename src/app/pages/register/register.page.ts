import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public regForm: FormGroup | any;
  public userData: any;
  public userinfo: User;

  constructor(private authservice:AuthService, private formBuilder:FormBuilder, private router:Router) { 
    this.regForm = this.formBuilder.group({
      'email': ['', [Validators.email, Validators.required]],
      'password': ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
  }
  /**
   * registra al usuario con el usuario temporal y lo registra en la base de datos
   */
  onSubmit(){
    this.userData = this.saveUserdata();
    this.authservice.registerUser(this.userData).then(data=>{
      if(data){
        this.router.navigate(['private/tabs/tab1']);
      }
    }).catch(error=>{
      console.log(error);
    })
  }

  public backLogin(){
    this.router.navigate(['login'])
  }
  /**
   * Guarda los datos del nuevo usario de forma temporal
   * @returns 
   */
  public saveUserdata(){
    const saveUserdata = {
      email: this.regForm.get('email').value,
      password: this.regForm.get('password').value,
    };
    return saveUserdata;
  }


}
