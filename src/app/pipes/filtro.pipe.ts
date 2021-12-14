import { Pipe, PipeTransform } from '@angular/core';
import { Note } from '../model/Note';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {
  /**
   * Método que devuelve las notas en el buscador que tengan los mismos carácteres
   * @param notes 
   * @param texto 
   * @returns 
   */
  transform(notes: Note[], texto:string): Note[]{
    if (texto.length==0){
      return notes;
    }else{
      return notes.filter(note=>{
        return note.title.toLocaleLowerCase().includes(texto.toLocaleLowerCase())|| 
        note.description.toLocaleLowerCase().includes(texto.toLocaleLowerCase());
      })
    }
  }

}
