import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(  private router: Router,
                private fb: FormBuilder,
                private authService: AuthService ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [ Validators.required, Validators.minLength(6) ]]
    });
  }


  loginUsuario() {

    if ( this.loginForm.invalid ) { return; }

    Swal.fire({
      title: 'Espere por favor',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { email, password } = this.loginForm.value;

    console.log(this.loginForm.value);
    
    this.authService.loginUsuario( email, password )
      .then( credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      }).
      catch( err => { 
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      });
  }

}
