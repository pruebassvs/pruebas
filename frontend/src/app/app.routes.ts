import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { NotFoundComponent } from './components/component/not-found/not-found.component';
import { ProductListComponent } from './components/pages/product-list/product-list.component';
import { ProductDetailComponent } from './components/pages/product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path:"home", component:LandingPageComponent},
    {path:"login", component:LoginPageComponent},
    {path:"register", component: RegisterPageComponent},
    {path:"products", component: ProductListComponent},
    { path: 'products/:id', component: ProductDetailComponent },
    { path: '**', component: NotFoundComponent },
];
