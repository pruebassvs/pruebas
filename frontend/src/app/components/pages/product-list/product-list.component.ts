import { Component , OnInit } from '@angular/core';
import { Product } from '../../../types/types';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CartService } from '../../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth-service/auth.service';
import { BrandType } from '../../../types/types';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
products:Product[]=[]
brands: BrandType[] = [];
quantity = 1;
isLogged=false;
isAdmin = false
filters = {
  brand: '',
  min_price: '',
  max_price: '',
  has_stock: true
};
isFiltersVisible = false;


constructor(private productService: ProductService, private cartService:CartService, private authService:AuthService) {

}
ngOnInit(): void {
 
  this.loadProducts()
  this.loadBrands()
  
  this.authService.isLogged$.subscribe({
    next: (value) => (this.isLogged = value),
    error: (error) => console.error(error),
    
  })
  this.authService.isAdmin$.subscribe(
    {
      next: (value) => (this.isAdmin = value),
      error: (error) => console.error(error),
    }
  )
  
}
loadProducts(){ 
  this.productService.getProducts().subscribe({
  next: (prods) => (this.products = prods),
  error: (error) => console.error(error),
  
});
}
loadBrands(){
  this.productService.getBrands().subscribe(
    {
      next: (value) => (this.brands = value),
      error: (error) => console.error(error),
    }
  )
}
toggleFilters() {
  this.isFiltersVisible = !this.isFiltersVisible;
}

ApplyFilters():void {
  this.productService.getProducts(this.filters).subscribe(
    {
      next: (prods) => (this.products = prods),
      error: (error) => console.error(error),
    }
  );
}
resetFilters():void {
  this.filters = {
    brand: '',
    min_price: '',
    max_price: '',
    has_stock: true
  };
  this.productService.getProducts().subscribe({
    next: (prods) => (this.products = prods),
    error: (error) => console.error(error),
    
  });
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