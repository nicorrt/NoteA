import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/model/Note';
import { CommonsService } from 'src/app/services/commons.service';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() note:Note;
  public formNota:FormGroup;
  public isAndroid:boolean;


  constructor(public modalController:ModalController, private fb:FormBuilder, 
     private utils:CommonsService, private noteS:NoteService, private platform:Platform) {
      this.isAndroid=platform.is("android");
     }

   ngOnInit() {

    console.log(this.note);
    this.formNota=this.fb.group({
      title:["",Validators.required],
      description:["",Validators.required]
    });
  }

  closeModal(){
    this.modalController.dismiss();
  }
/** 
  public editNote(){
    this.note = this.saveNote();
    this.noteS.putNote(this.note,this.key);
    console.log(this.note);
    this.closeModal();
  }

  saveNote() {
    const saveNote = {
    title: this.formNota.get('title')?.value,
    description: this.formNota.get('description')?.value,
    };
    return saveNote;
    }*/

  public async listen(){
    if(await SpeechRecognition.available()){
      SpeechRecognition.start({
        language: "es-ES",
        maxResults: 2,
        prompt: "Guarda tu descripción de la nota",
        partialResults: true,
        popup: false,
      }).then(async (data) => {
        let titulo = this.formNota.get("title").value;
        this.formNota.setValue({
          title: titulo,
          description: data.matches[0].slice(0)
        });

      }).catch(err => {
        console.error(err);
      })
    }else{

    }
  }
    
  public async editNote(note:Note){
    this.note = note;
    this.note.title=this.formNota.get('title').value;
    this.note.description=this.formNota.get('description').value;
    await this.noteS.editNote(this.note);
    await this.utils.showToast("Se ha editado la nota correctamente", "success");
    this.closeModal();
  }

}
