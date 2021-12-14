import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './local-storage.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { async } from '@firebase/util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$:Observable<User>
  public user:any; 
  private isAndroid=false;

  constructor(private authfirebase:AngularFireAuth, private storage:LocalStorageService, 
    private platform:Platform, private afs:AngularFirestore) { 
      this.isAndroid = platform.is("android");
      this.loadSession();
      if(!this.isAndroid)
      GoogleAuth.init(); //lee la config clientid dem meta de index.html
    }

  public isLogged():boolean{
    if(this.user){
      return true;
    }else{
      return false;
    } 
  }
  /**
   * Método para entrar mediante una cuenta de Google
   */
  public async loginGoogle(){
    let user:User = await GoogleAuth.signIn();
    this.user=user;
    await this.keepSession();
  }
  /**
   * Método para cargar una sesión de usuario
   */
  public async loadSession(){
    let user= await this.storage.getItem('user');
    if(user){
      user=JSON.parse(user);
      this.user=user;
    }
  }
  /**
   * Método para cerrar una sesión de usuario
   */
  public async logout(){
    await GoogleAuth.signOut();
    await this.storage.removeItem('user');
    this.user=null;
  }
  /**
   * Método para mantener una sesión de usuario
   */
  public async keepSession(){
    await this.storage.setItem('user', JSON.stringify(this.user));
  }

  /**
   * Método del servicio que registra a un usuario en la base de datos
   * @param userdata 
   * @returns 
   */
  public registerUser (userdata: {email:any; password:any}):Promise<Boolean>{
    return new Promise(async (resolve, reject)=>{
      return this.authfirebase.createUserWithEmailAndPassword(userdata.email, userdata.password).then(async user =>{
        if (user!=null && user.user != null){
          this.user = {
            displayName: user.user?.displayName,
            email: user.user?.email,
            photoURL: user.user?.photoURL,
            uid: user.user?.uid
          };
          await this.keepSession();
          resolve(true);
        }else{
          reject(false);
          this.user= null;
        }
      })
      .catch(
        error=>{
          console.error(error);
        }       
      );
    })
  }
  /**
   * Método que inicia sesión para los usuarios registrados mediante email
   * @param userdata 
   * @returns 
   */
  public loginEmailUser (userdata: {email:any; password:any}):Promise<Boolean>{
    return new Promise(async (resolve, reject)=>{
      return this.authfirebase.signInWithEmailAndPassword(userdata.email, userdata.password).then(async user =>{
        if (user!=null && user.user != null){
          this.user = {
            displayName: user.user?.displayName,
            email: user.user?.email,
            photoURL: user.user?.photoURL,
            uid: user.user?.uid
          };
          await this.keepSession();
          resolve(true);
        }else{
          reject(false);
          this.user= null;
        }
      })
      .catch(
        error=>{
          console.error(error);
        }       
      );
    })
  }

  //////////////////////Métodos no implementados para verificación por mail y reseteo de contraseña

  public async sendVerificationEmail():Promise<void>{
    try {
      return ( await this.authfirebase.currentUser).sendEmailVerification();
    } catch (error) {
      console.log(error);
    }
  }

  public async resetPassword(email: string):Promise<void>{
    try {
      return this.authfirebase.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

}
