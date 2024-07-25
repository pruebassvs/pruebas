import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'; 
import { AuthService } from '../../../services/auth-service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-password-reset-confirm',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset-confirm.component.html',
  styleUrl: './password-reset-confirm.component.css'
})
export class PasswordResetConfirmComponent implements OnInit {

  form!: FormGroup;
  uid: string | null = null;
  token: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      new_password: ['',[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        ],],
      confirm_password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        ],]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }
  get new_password() {
    return this.form.get('new_password');
  }
  get confirm_password() {
    return this.form.get('confirm_password');
  }

  onSubmit(event:Event): void {
    if (this.form.valid && this.uid && this.token) {
      const { new_password, confirm_password } = this.form.value;
      this.authService.confirmPasswordReset(this.uid, this.token, new_password, confirm_password).subscribe({
        next: (res) => {
          console.log(res.message ) ;
          alert('Password has been reset successfully.')
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('There was an error resetting the password.')
        }
      });
    }
  }
}
      
      
   