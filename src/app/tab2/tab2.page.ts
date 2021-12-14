import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { CommonsService } from '../services/commons.service';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public formNota:FormGroup;


  constructor(private fb:FormBuilder, private noteS:NoteService, private utils:CommonsService, private authS: AuthService,
    private route:Router) {
    this.formNota=this.fb.group({
      title:["",Validators.required],
      description:[""]
    });
  }

  ionViewDidEnter(){

  }
      /**
     * Método cierra sesión al usuario conectado
     */
       public async logout(){
        await this.authS.logout();
        this.route.navigate(['login'])
      }

  public async addNote(){
    let newNote:Note={
      title:this.formNota.get("title").value,
      description:this.formNota.get("description").value
    }
      await this.utils.showLoading();
      try{
      let id=await this.noteS.addNote(newNote);
      //Si el primero es nulo, no se ejecuta el segundo, ahorra un IF
      this.utils.closeLoading();
      await this.utils.showToast("Nota agregada correctamente","success");
      this.formNota.reset();
      }catch (err){
        console.log(err);
        this.utils.closeLoading();
        await this.utils.showToast("Error al agregar Nota", "failed");
      }
  }

}


