import { Component, OnInit } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { Cart, PurchaseConfirmationResponse} from '../../../types/types';
import { HttpErrorResponse } from '@angular/common/http';
import { PurchaseComponent } from '../../component/purchase/purchase.component';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CartItemComponent, RouterLink, PurchaseComponent],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css'
})
export class CartDetailComponent implements OnInit {
   cart:Cart= {} as Cart 
   total:number=0
   purchase: PurchaseConfirmationResponse = {} as PurchaseConfirmationResponse;
   purchaseConfirmed:boolean=false
   confirmedTotal:number=0

  constructor(private cartService:CartService, private PurchaseService:PurchaseService) {}

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
  
  confirmPurchase() {
    const totalconf= this.total 
    this.PurchaseService.confirmPurchase().subscribe({
      next: (response) => {
        console.log('Compra realizada:', response);
        alert(
          `Compra realizada `
        );
        this.purchase = response;
        this.purchaseConfirmed = true;
        this.confirmedTotal=totalconf
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && error.error.error) {
          alert(error.error.error );
        } else {
          console.error('Error processing the purchase:', error);
          alert(
             'An error occurred while processing the purchase, please try again.'
          );
        }
      },
    });
  }
}