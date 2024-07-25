import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'; 
import { AuthService } from '../../../services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  
  form!: FormGroup;
 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  get email() {
    return this.form.get('email');
  }


  onSubmit(event:Event): void {
    event.preventDefault()
    if (this.form.valid) {
      const email = this.form.value.email;
      this.authService.requestPasswordReset(email).subscribe({
        next: (res) => {

          alert('If an account with that email exists, a reset link has been sent.')
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          alert('There was an error sending the reset link.')
        }
      });
    }
  }
}