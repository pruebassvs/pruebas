import { Component, OnInit } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { Cart, PurchaseConfirmationResponse, PaymentTypes } from '../../../types/types';
import { HttpErrorResponse } from '@angular/common/http';
import { PurchaseComponent } from '../../component/purchase/purchase.component';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { tap, of } from 'rxjs';
import { catchError } from 'rxjs';
import { StripeService } from '../../../services/stripe/stripe.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CartItemComponent, RouterLink, PurchaseComponent, FormsModule, CommonModule],
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {
  cart: Cart = {} as Cart;
  total: number = 0;
  purchase: PurchaseConfirmationResponse = {} as PurchaseConfirmationResponse;
  purchaseConfirmed: boolean = false;
  confirmedTotal: number = 0;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  PaymentMethodTypes: PaymentTypes[] = [];
  Payment_method_id!: number;
  PaymentMode!: string;
  PaymentSelected: PaymentTypes | null = null;

  constructor(
    private cartService: CartService,
    private purchaseService: PurchaseService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    // Obtén los tipos de pago disponibles
    this.purchaseService.getPaymentMethodTypes().subscribe({
      next: (payments) => {
        this.PaymentMethodTypes = payments;
      },
      error: (error) => console.error(error)
    });

    // Inicializa Stripe
    this.stripeService.initializeStripe().subscribe({
      next: () => {
        console.log('Stripe initialized successfully');
      },
      error: (error) => console.error('Error initializing Stripe:', error)
    });

    // Obtén el carrito y el total
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


  updatePaymentMethod() {
    if (this.PaymentSelected) {
      this.Payment_method_id = this.PaymentSelected.id;
      this.PaymentMode = this.PaymentSelected.description; 
    } else {
      this.Payment_method_id = 0; 
      this.PaymentMode = 'no anda'; 
    }
    console.log('Selected Payment Method:', this.PaymentSelected);
    console.log('Payment Mode:', this.PaymentMode);
    console.log('Payment Method ID:', this.Payment_method_id);
  }
  deleteItem(item_id: number) {
    if (item_id) {
      if (confirm('Are you sure you want to delete this item?')){
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

  confirmPurchase(event: Event) {
    event.preventDefault(); 
    console.log(this.PaymentMode)
    console.log(this.PaymentMethodTypes)
    console.log(this.Payment_method_id)

    if (this.PaymentMode === 'Stripe') {
      this.stripeService.createPaymentMethod().subscribe({
        next: (paymentMethod) => {
          if (!paymentMethod || !paymentMethod.id) {
            alert('Error creating payment method. Please try again.');
            return;
          }

         
          this.processPurchase(this.Payment_method_id);
        },
        error: (error) => {
          console.error('Error creating payment method:', error);
          alert('Error creating payment method. Please try again.');
        }
      });
    } else if (this.PaymentMode === 'Cash') {
   
      this.processPurchase(this.Payment_method_id);
    } else {
      alert('Payment method not supported.');
    }
  }

  private processPurchase(paymentMethodId: number): void {
    this.purchaseService.confirmPurchase(paymentMethodId).pipe(
      tap(response => {
        console.log('Purchase completed:', response);
        alert('Purchase completed successfully.');
        this.purchase = response;
        this.purchaseConfirmed = true;
        this.confirmedTotal = this.total;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && error.error.error) {
          alert(error.error.error);
        } else {
          console.error('Error processing the purchase:', error);
          alert('An error occurred while processing the purchase, please try again.');
        }
        return of(null); 
      })
    ).subscribe();
  }
}
