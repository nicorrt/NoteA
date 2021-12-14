import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  public htmlLoading:HTMLIonLoadingElement;
  private loading:Boolean;

  constructor(public alertController: AlertController, public toastController:ToastController, 
    public loadingController: LoadingController) {
      this.loading=false;
     }
     /**
      * Método que muestra un toast customizado
      * @param message 
      * @param color 
      */
    public async showToast(message:string, color:string){
      const t = await this.toastController.create({
        message: message,
        duration: 3000,
        color:color
      });
      t.present();
    }
    /**
     * Método que muestra un loading
     */
    public async showLoading(){
      if(this.loading){
        this.htmlLoading.dismiss();
      }else{
        this.htmlLoading = await this.loadingController.create({
          message:""
        });
      }
      await this.htmlLoading.present();
      this.loading=true;
    }
    /**
     * Método que cierra el loading
     */
    public async closeLoading(){
      await this.htmlLoading.dismiss();
      this.loading=false;
    }

}
