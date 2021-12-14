import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ToastController } from '@ionic/angular';
import { Note } from '../model/Note';
import { NoteService } from '../services/note.service';
import { ModalController } from '@ionic/angular';
//Alert
import { AlertController } from '@ionic/angular';
//Pagina Modal
import { ModalPage } from '../pages/modal/modal.page';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonsService } from '../services/commons.service';
//Servicio lectura
import { TextToSpeech } from '@capacitor-community/text-to-speech';
//Servicion escucha
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite:IonInfiniteScroll;
  public notas:Note[]=[];
  public searchNote: string="";

  constructor(private ns:NoteService, private utils:CommonsService,
    private modalController:ModalController, public alertController: AlertController,
    private authS:AuthService, private router:Router) {

    }

  async ionViewDidEnter(){
    await this.cargaNotas();
  }
  /**
   * Este método se usa para pedir los permisos necesarios para la escritura por voz de la nota
   */
   async ngOnInit(){
    //await this.cargaNotas();
    let hasPermission=await SpeechRecognition.hasPermission();
    if(!hasPermission.permission){
      SpeechRecognition.requestPermission();
    }
  }

  /**
   * Método que carga todas las notas al inicio de la sesión
   * @param event 
   */
  public async cargaNotas(event?){ 
    if(this.infinite){
      this.infinite.disabled=false;
    }
    if(!event){
       await this.utils.showLoading();
      //mostrar loading
    }
    this.notas=[]; //Cada vez que entra resetea el Array vacío
    try {
      this.notas = await this.ns.getNotesbyPage(true).toPromise(); //Aqui se llama al otro getNotesByPage
    } catch (err) {
      console.log(err);
      await this.utils.showToast("Error cargando datos", "danger");
      //notifica el error al usuario
    }finally{
      if(event){
        event.target.complete();
      }else{
        await this.utils.closeLoading();
      }
    }
  }
  /**
   * Método que borra la nota
   * @param nota 
   */
  public async borra(nota:Note){
    //let header=this.translate.instant('ALERT');
    const alert = await this.alertController.create({
      header: 'Alerta', 
      subHeader: 'Borrando ',
      message: '¿Estás seguro de querer borrar la nota?',
      buttons: [ {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: async () => {
          await this.utils.closeLoading();
        }
      }, {
        text: 'Si',
        handler: async () => {
          await this.ns.remove(nota.key);
          let i = this.notas.indexOf(nota,0);
          if(i>-1){
            this.notas.splice(i,1);
            await this.utils.showToast("La nota ha sido borrada correctamente", "success");
          }
          await this.utils.closeLoading();
        }
      }]
    });
    await alert.present();
  }

    /**
     * Método que abre un modal para editar nota, llevandose la informacion de la nota
     * @param note 
     * @returns 
     */
    async openModal(note:Note){
      const modal = await this.modalController.create({
        component: ModalPage,
        componentProps: {'note':note},
        cssClass: 'my-custom-class' //está en el global.scss
      });
      console.log(note);
      return await modal.present();
    }
    /**
     * Método que carga las notas en la página de 10 en 10
     * @param $event 
     */
    public async cargaInfinita($event){
      let nuevasNotas=await this.ns.getNotesbyPage().toPromise();
      if(nuevasNotas.length<10){
        $event.target.disabled=true;
      }
      this.notas = this.notas.concat(nuevasNotas);
      $event.target.complete();
    }
    /**
     * Método cierra sesión al usuario conectado
     */
    public async logout(){
      await this.authS.logout();
      this.router.navigate(['login'])
    }
    /**
     * Método para buscar la nota en la lista
     * @param event 
     */
    public async searchInNote(event){
      this.searchNote=event.detail.value;
    }
    /**
     * Método que reproduce por audio la descripcion de la nota seleccionada
     * @param note 
     */
    public async speakNote(note:Note){
      await TextToSpeech.speak({
        text: note.description,
        lang: 'es-ES',
        rate: 1.0,

      });
    }

}
