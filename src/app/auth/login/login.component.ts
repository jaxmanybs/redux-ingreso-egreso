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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(  private router: Router,
                private fb: FormBuilder,
                private store: Store<AppState>,
                private authService: AuthService ) { }


  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [ Validators.required, Validators.minLength(6) ]]
    });

    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui => {
                                this.cargando = ui.isLoading;
                                console.log('Cargando subs');
                              });
  }

  ngOnDestroy() {    
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {

    if ( this.loginForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { email, password } = this.loginForm.value;

    // console.log(this.loginForm.value);
    
    this.authService.loginUsuario( email, password )
      .then( credenciales => {
        // console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      }).
      catch( err => { 
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      });
  }

}
