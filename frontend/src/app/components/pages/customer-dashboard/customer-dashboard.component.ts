import { Component } from '@angular/core';
import { PurchaseHistoryComponent } from '../../component/purchase-history/purchase-history.component';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [PurchaseHistoryComponent, RouterLink, RouterOutlet],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent {

}
