import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  
})
export class HeaderComponent {
  isMenuOpen = false;
  isBannerVisible = true;
  isModalOpen = true;
  isAsideOpen = true;

  closeBanner() {
    this.isBannerVisible = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  closeAside() {
    this.isAsideOpen = false;
  }
}
