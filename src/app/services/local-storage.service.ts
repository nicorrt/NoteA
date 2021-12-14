import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Wrapper que recibe objetos, guardará la información en localStorage
   * @param key 
   * @param object
   * @returns Promesa 
   */
  public async setItem(key:string,value:any):Promise<boolean>{
    let result:boolean = false;
    try{
      await Storage.set({
        key:key,
        value:JSON.stringify(value) //el valor es String, hay que tener una funcion de JSON a String y alreves
      })
    }catch(err){
      console.log(err);
    }
    return Promise.resolve(result);
  }

  /**
   * 
   * @param key 
   * @returns 
   */
  public async getItem(key:string):Promise<any>{
    let value=null;
    try{
      value= await Storage.get({key:key});
      value=value.value;
      if (value!=null) {
        value=JSON.parse(value);
      } 
    }catch(err){
      console.log(err);
    }
    return Promise.resolve(value);
  }

  public async removeItem(key:string):Promise<boolean>{
    let result=false;
    try {
      await Storage.remove({key:key});
      result = true;
    } catch (err) {
      console.log(err);
    }
    return Promise.resolve(result);
  }

  /**public async editItem(key:string):Promise<any>{
    let value=null;
    try {
      
    } catch (error) {
      console.log(error);
    }
  }*/
}
