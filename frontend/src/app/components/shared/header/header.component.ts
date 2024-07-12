import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoutComponent } from '../../component/logout/logout.component';
import { AuthService } from '../../../services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoutComponent],
  templateUrl: './header.component.html',
  
})
export class HeaderComponent implements OnInit{
  isMenuOpen = false;
  isBannerVisible = true;
  isLogged=false;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
      this.authService.isLogged$.subscribe(
        value=>{this.isLogged=value}
      )
  }
  closeBanner() {
    this.isBannerVisible = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu() {
    this.isMenuOpen = false;
  }
}
