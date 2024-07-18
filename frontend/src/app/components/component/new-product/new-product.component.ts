import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { NewProduct} from '../../../types/types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  newProduct: NewProduct = {
    stock: 0,
    image: "",
    detail: "",
    price:0,
    model: 1,
    brand: 1,
    size: 1,
    color: 1
};

constructor(private productService: ProductService) {}

addProduct(): void {
  this.productService.addProduct(this.newProduct).subscribe({
    next: (addedProduct) => {
      console.log('Product added successfully:', addedProduct);
      alert('Product added successfully!');
      this.resetForm();
    },
    error: (err) => {
      console.error('Error adding product:', err);
      alert('Error adding product. Please try again later.');
    }
  });
}

resetForm(): void {
  this.newProduct = {
    stock: 0,
    image: "",
    detail: "",
    price:0,
    model: 1,
    brand: 1,
    size: 1,
    color: 1
  };
}
}