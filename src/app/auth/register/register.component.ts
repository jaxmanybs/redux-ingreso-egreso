import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(  private fb: FormBuilder,
                private authService:AuthService,
                private store: Store<AppState>,
                private router: Router ) { }

  ngOnInit() {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required ],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['', [ Validators.required, Validators.minLength(6) ]]
    });


    this.uiSubscription = this.store.select( 'ui' )
                              .subscribe( ui => {
                                this.cargando = ui.isLoading;
                                console.log('Cargando subs');
                              });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {

    if ( this.registroForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { nombre, correo, password } = this.registroForm.value;
    
    this.authService.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        console.log(credenciales);
        this.store.dispatch( ui.stopLoading() );
        // Swal.close();
        this.router.navigate(['/']);
      }).
      catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      });
    
  }

}
