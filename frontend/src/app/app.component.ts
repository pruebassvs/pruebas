import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CookieConsentComponent } from './components/component/cookie-consent/cookie-consent.component';
import { LoaderComponent } from './components/component/loader/loader.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CookieConsentComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}