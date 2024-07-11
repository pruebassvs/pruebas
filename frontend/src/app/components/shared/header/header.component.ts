import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginPageComponent } from '../../pages/login-page/login-page.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  
})
export class HeaderComponent {
  isMenuOpen = false;
  isBannerVisible = true;


  closeBanner() {
    this.isBannerVisible = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
 

}
