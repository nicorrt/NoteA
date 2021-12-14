import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { IonToggle } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('mitoogle',{static:false}) mitoogle:IonToggle;
  public image:any;

  constructor(private traductor:TranslateService, private storage:LocalStorageService, private authS:AuthService,
    private route:Router) {

  }
  /**
   * Método para cambiar el idioma de las etiquetas de la aplicación
   * @param event 
   */
  public async cambiaIdioma(event){
    if(event&&event.detail&&event.detail.checked){
     await this.storage.setItem('lang',{lang:'es'});
     await this.traductor.use('en');
    }else{
      await this.storage.setItem('lang',{lang:'es'});
      this.traductor.use('es');
    }
  }
  /**
   * Método que inicializa la tab a un idioma por defecto, inutilizado para que se mantenga en un idioma u otro
   */
  ionViewDidEnter(){
   /**const lang= this.traductor.getDefaultLang();
   if (lang=='es') {
     this.mitoogle.checked=false;
   } else {
      this.mitoogle.checked=true;
   }*/
  }

  public async hazFoto(){
    let options:ImageOptions={
      resultType:CameraResultType.Uri,
      allowEditing:false,
      quality:90,
      source:CameraSource.Camera
    }
    let result:Photo = await Camera.getPhoto(options);
    this.image=result.webPath;
  }

        /**
     * Método cierra sesión al usuario conectado
     */
         public async logout(){
          await this.authS.logout();
          this.route.navigate(['login'])
        }

}
