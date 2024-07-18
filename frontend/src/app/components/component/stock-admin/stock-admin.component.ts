import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../../types/types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stock-admin.component.html',
  styleUrl: './stock-admin.component.css'
})
export class StockAdminComponent implements OnInit {

  products: Product[] = [];
  constructor(private productService : ProductService){}

  ngOnInit(): void {
    this.loadProducts();
}

loadProducts(): void {
  
  this.productService.getProducts().subscribe({
    next: (products) => {
      this.products = products;
    },
    error: (err) => {
      console.error('Error fetching products:', err);
    }
  });
}

updateStock(product: Product): void {
  if (product.stock === 0) {
    alert('Stock cannot be zero. Please enter a valid value.');
    return;
  }
  this.productService.patchProductStock(product.id, product.stock).subscribe({
    next: (updatedProduct) => {
      console.log('Product stock updated successfully:', updatedProduct);
      alert('Product stock updated successfully, New Stock: '+ product.stock)
    },
    error: (err) => {
      console.error('Error updating product stock:', err);
    }
  });
}
}
