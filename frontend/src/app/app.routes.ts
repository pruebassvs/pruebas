import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { NotFoundComponent } from './components/component/not-found/not-found.component';
import { ProductListComponent } from './components/pages/product-list/product-list.component';
import { ProductDetailComponent } from './components/pages/product-detail/product-detail.component';
import { CartDetailComponent } from './components/pages/cart-detail/cart-detail.component';
import { CustomerDashboardComponent } from './components/pages/customer-dashboard/customer-dashboard.component';
import { PurchaseHistoryComponent } from './components/component/purchase-history/purchase-history.component';
import { UserUpdateComponent } from './components/component/user-update/user-update.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { DeliveriesComponent } from './components/component/deliveries/deliveries.component';
import { StockAdminComponent } from './components/component/stock-admin/stock-admin.component';
import { NewProductComponent } from './components/component/new-product/new-product.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path:"home", component:LandingPageComponent},
    {path:"login", component:LoginPageComponent},
    {path:"register", component: RegisterPageComponent},
    {path:"user", component: CustomerDashboardComponent, children: [
        { path: 'purchase-history', component: PurchaseHistoryComponent },
        { path: 'user-update', component: UserUpdateComponent},
      ]},
      {path:"admin", component: AdminDashboardComponent, children: [
        { path: 'deliveries', component: DeliveriesComponent },
        { path: 'stock-admin', component: StockAdminComponent},
        { path: 'new-product', component: NewProductComponent},
      ]},
    {path:"products", component: ProductListComponent},
    {path:"cart", component: CartDetailComponent},
    {path:"contact-page", component: ContactPageComponent},
    { path: 'products/:id', component: ProductDetailComponent },
    { path: '**', component: NotFoundComponent },
];
