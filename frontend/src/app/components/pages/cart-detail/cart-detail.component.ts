import { Component, OnInit } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { Cart, RemoveItemRequest } from '../../../types/types';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CartItemComponent, RouterLink],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css'
})
export class CartDetailComponent implements OnInit {
   cart:Cart= {} as Cart 
   total:number=0
  constructor(private cartService:CartService) {}

  ngOnInit(): void {
    this.cartService.cartSubject$.subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (error) => console.error(error),
    });
    this.cartService.total$.subscribe({
      next: (total) => {
        this.total = total;
      },
      error: (error) => console.error(error)
    });
  }

  
  deleteItem(item_id: number) {
    if (item_id) {
      this.cartService.deleteItem(item_id).subscribe({
        next: (res) => {
          alert('Item deleted');
          console.log(res);
        },
        error: (error) => {
          console.error('Error deleting product: ', error);
          alert('Error deleting product, please try again');
        },
      });
    } else {
      console.error('The item ID is undefined');
    }
  }
  
}