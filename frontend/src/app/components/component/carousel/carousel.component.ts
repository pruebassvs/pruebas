import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @ViewChild('container') container!: ElementRef;
  products = [
    {
      id: 1,
      name: 'Sports',
      imageUrl: 'https://img.freepik.com/fotos-premium/zapato-colorido-palabra-aire_900775-1466.jpg?size=626&ext=jpg'
    },
    {
      id: 2,
      name: 'Casual',
      imageUrl: 'https://img.freepik.com/fotos-premium/zapato-colorido-palabra-aire_900775-1466.jpg?size=626&ext=jpg'
    },
    {
      id: 3,
      name: 'Crazy',
      imageUrl: 'https://img.freepik.com/fotos-premium/zapato-colorido-palabra-aire_900775-1466.jpg?size=626&ext=jpg'
    },
    {
      id: 4,
      name: 'Fashion',
      imageUrl: 'https://img.freepik.com/fotos-premium/zapato-colorido-palabra-aire_900775-1466.jpg?size=626&ext=jpg'
    },
    {
      id: 5,
      name: 'Old-Style',
      imageUrl: 'https://img.freepik.com/fotos-premium/zapato-colorido-palabra-aire_900775-1466.jpg?size=626&ext=jpg'
    },
    {
      id: 6,
      name: 'Cool',
      imageUrl: 'https://img.freepik.com/fotos-premium/zapato-colorido-palabra-aire_900775-1466.jpg?size=626&ext=jpg'
    },

  ];
  slideLeft() {
    this.container.nativeElement.scrollLeft -= 250; // Ajusta el valor según el ancho de tus imágenes
  }

  slideRight() {
    this.container.nativeElement.scrollLeft += 250; // Ajusta el valor según el ancho de tus imágenes
  }
}
