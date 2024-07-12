import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth-service.service';
import { NewUser} from '../../../types/types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password1: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            ],
          ],
        password2: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            ],
          ],
        identification_number: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{6,10}$') 
          ],
        ],

          
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{8,15}$') 
          ],
        ],
        adress: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
      }, 
      { validators: this.notEqualPasswordValidator() }
    );
  }


  get email() {
    return this.form.get('email');
  }

  get password1() {
    return this.form.get('password1');
  }

  get password2() {
    return this.form.get('password2');
  }
  get identification_number() {
    return this.form.get('identification_number');
  }
  get phone() {
    return this.form.get('phone');
  }
  get adress() {
    return this.form.get('adress');
  }

  notEqualPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pass1 = control.get('password1');
      const pass2 = control.get('password2');

      return pass1 && pass2 && pass1.value !== pass2.value
        ? { notEqualPassword: true }
        : null;
    };
  }

  onRegister(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const newUser:NewUser = {
        username: this.form.value.email,
        email: this.form.value.email,
        password: this.form.value.password1,
        identification_number: this.form.value.identification_number,
        phone: this.form.value.phone,
        adress:this.form.value.adress,
      };

      this.authService.register(newUser).subscribe({
        next: (res) => {
          if (res.user) {
            Swal.fire({
              title: "User registered",
              text: "Please Log in",
              color: '#ffffff',
              imageUrl: "https://img.freepik.com/foto-gratis/ilustracion-calzado-deportivo-sobre-fondo-azul-generado-ia_188544-19603.jpg?w=1380&t=st=1720619846~exp=1720620446~hmac=c3c9abe9bd869c4c34ba10f563ad4725250fe2a24c598df070a98b49adff834d",
              imageWidth: 300,
              imageHeight: 150,
              imageAlt: "Custom image",
              background: '#000',
              showConfirmButton: true,
              confirmButtonColor: '#000',
              
            });
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          Swal.fire({
            title: "Error registering user",
            text: "Please try again",
            color: '#ffffff',
            imageUrl: "https://img.freepik.com/foto-gratis/ilustracion-calzado-deportivo-sobre-fondo-azul-generado-ia_188544-19603.jpg?w=1380&t=st=1720619846~exp=1720620446~hmac=c3c9abe9bd869c4c34ba10f563ad4725250fe2a24c598df070a98b49adff834d",
            imageWidth: 300,
            imageHeight: 150,
            imageAlt: "Custom image",
            background: '#000',
            showConfirmButton: true,
            confirmButtonColor: '#000',
            
          });
          console.error(error);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}