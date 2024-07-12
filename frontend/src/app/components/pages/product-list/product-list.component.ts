import { Component , OnInit } from '@angular/core';
import { Product } from '../../../types/types';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/auth-service/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
products:Product[]=[]

constructor(private productService: ProductService) {

}
ngOnInit(): void {
  this.productService.getProducts().subscribe({
    next: (prods) => (this.products = prods),
    error: (error) => console.error(error),
    
  });
}

}