import { Component } from '@angular/core';
import { faFacebook, faTwitter, faInstagram, faGgCircle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
  faGgCircle = faGgCircle; 
}
