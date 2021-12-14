import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Data } from '@angular/router';
import { async } from '@firebase/util';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { resourceLimits } from 'worker_threads';
import { Note } from'../model/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private myCollection:AngularFirestoreCollection;
  private last:any=null;
  constructor(private db:AngularFirestore) {
    this.myCollection=db.collection<any>(environment.firebaseConfig.todoCollection);
   }

   //Añadir nota
   public addNote(note:Note):Promise<string>{
    return new Promise(async (resolve,reject)=>{
      try{
        let response:DocumentReference<firebase.default.firestore.DocumentData> =
        await this.myCollection.add({
          title:note.title,
          description:note.description
        });
        resolve(response.id);
      }catch(err){
        reject(err);
      }
    })
   }
  

   public getNotes():Observable<Note[]>{

    return new Observable((observer)=>{
      let result:Note[]=[];

      this.myCollection.get().subscribe(
        (data:firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>)=>{
         data.docs.forEach((d:firebase.default.firestore.DocumentData)=>{
           let tmp=d.data(); //devuelve el objeto almacenado -> la nota con title
           let id=d.id; //devuelve la key del objeto
           result.push({'key':id,...tmp});
           //operador spread -> 'title':tmb.title, 'description':tmp.description
        })
        observer.next(result); // este es el return del observable de devolvemos
        observer.complete();
       })//final del subscribe, final del hilo
    }); //Final del return observable
  }
  /**
   * Mirar el infiniteScroll
   * getNotesbyPage
   * getNotesbyPage
   * getNotesbyPage page = 1, criteria = undefined
   * @param page 
   * @param criteria 
   */
  public getNotesbyPage(all?):Observable<Note[]>{
    if(all){
      this.last=null;
    }
    console.log(this.last)
    return new Observable((observer)=>{
      let result:Note[]=[];
      let query=null;
      if(this.last){
        query=this.db.collection<any>(environment.firebaseConfig.todoCollection,
          ref => ref.limit(10).startAfter(this.last));
      }else{
        query=this.db.collection<any>(environment.firebaseConfig.todoCollection,
          ref => ref.limit(10));
      }
      
      query.get()
      .subscribe(
        (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) =>{
          data.docs.forEach((d:firebase.default.firestore.DocumentData)=>{
            this.last=d;
            let tmp = d.data(); //devuelve el objeto almacenado -> la nota con titulo y descripción
            let id = d.id; //devuelve la key del objeto
            result.push({'key': id,...tmp});
          })
          observer.next(result); //Este es el return del observable que devolvemos
          observer.complete();
        }); //final del subscribe
    });//final del return observable
  }

  /**
   * Método que obtiene una nota
   * @param id 
   * @returns una promesa de una nota
   */
  public getNote(id:string):Promise<Note>{

    return new Promise(async(resolve, reject)=>{
      let note:Note=null;
      try {
        let result:firebase.default.firestore.DocumentData=await this.myCollection.doc(id).get();
        note=result.data;
        note={
          id:result.id,
          ...result.data()
        }
        resolve(note);
      } catch (error) {
        reject(error);
      }
    })
  }  
  /**
   * Método que borra una nota de firebase
   * @param id 
   * @returns Promise
   */
  public remove(id:string):Promise<void>{
   return this.myCollection.doc(id).delete();
  }
  /**
   * Método que edita una nota
   * @param note 
   */
  public async editNote(note:Note):Promise<void>{
    try {
      let data:Partial<firebase.default.firestore.DocumentData>={
        title:note.title,
        description:note.description
      };
      await this.myCollection.doc(note.key).update(data);
    } catch (error) {
      console.error(error);
    }
  }
}
