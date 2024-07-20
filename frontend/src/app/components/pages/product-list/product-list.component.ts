import { Component , OnInit } from '@angular/core';
import { Product } from '../../../types/types';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CartService } from '../../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth-service/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
products:Product[]=[]
quantity = 1;
isLogged=false;
isAdmin = false

constructor(private productService: ProductService, private cartService:CartService, private authService:AuthService) {

}
ngOnInit(): void {
  this.productService.getProducts().subscribe({
    next: (prods) => (this.products = prods),
    error: (error) => console.error(error),
    
  });
  this.authService.isLogged$.subscribe(
    value=>{this.isLogged=value}
  )
  this.authService.isAdmin$.subscribe(
    value=>{this.isAdmin=value}
  ) 
}

addItemCart(product_id?: number, quantity?:number): void {
  if (product_id !== undefined) {
    this.cartService.addItem(product_id, this.quantity).subscribe({
      next: (res) => {
        alert('Item Added.');
        console.log(res, product_id, this.quantity);
      },
      error: (error: HttpErrorResponse) => {
        if (error) {
          alert(error.error.error );
        } else {
          console.error('Error Adding product:', error);
        }
      },
    });
  }
}
}