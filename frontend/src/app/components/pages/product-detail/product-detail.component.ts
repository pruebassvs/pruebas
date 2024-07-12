import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ProductService } from '../../../services/auth-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../types/types';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{

product : Product = {} as Product
constructor(private productService: ProductService, private route: ActivatedRoute,){}

ngOnInit(): void {
  this.getProductId();
} 

getProductId() {
  const productId = this.route.snapshot.paramMap.get('id');
  console.log('Product ID:', productId);
  if (productId) {
    this.productService.getProductById (Number(productId)).subscribe({
      next: (prod) => (this.product = prod),
      error: (error) => {
        console.error('Error retrieving the product:', error);
        
      }
    });
  } else {
    console.error('The ID in the URL is undefined or invalid');
  }
}

}
