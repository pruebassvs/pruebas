import { Component, OnInit } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { Cart, PurchaseConfirmationResponse} from '../../../types/types';
import { HttpErrorResponse } from '@angular/common/http';
import { PurchaseComponent } from '../../component/purchase/purchase.component';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { stripePublicKey } from '../../../utils/utils';
import { tap, of, Observable, from, switchMap } from 'rxjs';
import { catchError } from 'rxjs';
import { StripeService } from '../../../services/stripe/stripe.service';


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
   stripe: Stripe | null = null;
   elements: StripeElements | null = null;
   cardElement: StripeCardElement | null = null;

  constructor(private cartService:CartService, private purchaseService:PurchaseService, private stripeService: StripeService) {}

  ngOnInit(): void {
    this.stripeService.initializeStripe().subscribe({
      next: () => {
        console.log('Stripe initialized successfully');
      },
      error: (error) => console.error('Error initializing Stripe:', error)
    });
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
  
  confirmPurchase(event: Event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    this.stripeService.createPaymentMethod().subscribe({
      next: (paymentMethod) => {
        if (!paymentMethod) {
          alert('Error creating payment method. Please try again.');
          return;
        }

        const paymentMethodId = paymentMethod.id; // Obtén el ID del método de pago
        this.purchaseService.confirmPurchase(paymentMethodId).pipe(
          tap(response => {
            console.log('Compra realizada:', response);
            alert('Compra realizada con éxito.');
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
            return of(null); // Retorna un observable vacío en caso de error
          })
        ).subscribe(); // Ejecuta la suscripción para procesar la compra
      },
      error: (error) => {
        console.error('Error creating payment method:', error);
        alert('Error creating payment method. Please try again.');
      }
    });
  }
}