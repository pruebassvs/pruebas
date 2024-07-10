import { Component, ElementRef, ViewChild } from '@angular/core';
import { CarouselComponent } from '../../component/carousel/carousel.component';
import { CollectionsComponent } from '../../component/collections/collections.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CarouselComponent, CollectionsComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  isModalOpen = true;
  isAsideOpen = true;

  closeAside() {
    this.isAsideOpen = false;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
