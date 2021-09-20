import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions'

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSuscription: Subscription;

  constructor(  public auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private store: Store<AppState> ) {};

  initAuthListener() {

    this.auth.authState.subscribe( fuser => {
      if ( fuser ) {
        console.log( 'Existe el usuario' );
        
        this.userSuscription =  this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser: Usuario) => {
            console.log({firestoreUser});
            // const tempUser = new Usuario( firestoreUser.uid, firestoreUser.nombre, firestoreUser.email); 
            const user = Usuario.fromFirebae( firestoreUser ); 
            
            this.store.dispatch( authActions.setUser({ user }) );
          });
      } else {

        this.userSuscription.unsubscribe();
        
        this.store.dispatch( authActions.unSetUser() );
        console.log( 'No existe el usuario' );

        this
        
      }

      
    })
  }

  crearUsuario( nombre: string, email: string, password: string) {

    // console.log ({nombre, correo, password});
    return this.auth.createUserWithEmailAndPassword( email, password )
    .then( ({ user }) => {

      const newUser = new Usuario( user.uid, nombre, user.email );
      
      return this.firestore.doc(`${ user.uid }/usuario`)
      .set({ ...newUser});
      
    });
     
  }

  loginUsuario( email: string, password: string) {

    // console.log ({email, password});
    return this.auth.signInWithEmailAndPassword( email, password );
     
  }
  logout() {

    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }
}
