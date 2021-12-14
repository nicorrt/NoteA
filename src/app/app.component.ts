import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './services/local-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  private langsAvalable=['es','en'];
  constructor(private traductor:TranslateService,
    private storage:LocalStorageService, private platForm:Platform) {

      /**
       * Método para poder volver hacia atrás desde el botón del móvil
       */
      this.platForm.backButton.subscribeWithPriority(10, () => {
        App.exitApp();
            });


      (async()=>{
        let lang = await storage.getItem("lang");
        if (lang==null) {
          lang=this.traductor.getBrowserLang(); 
        }else{
          lang=lang.lang;
        }
    //const lang=window.navigator.language.split("-")[0];//Detecta el lenguaje del navegador
    if(this.langsAvalable.indexOf(lang)>-1){
      traductor.setDefaultLang(lang);
    }else{
      traductor.setDefaultLang('en');
    }
  })();
  }
}
