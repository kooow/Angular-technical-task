import { Routes } from '@angular/router';
import { Home } from  './home/home';
import { NotFound } from './not-found/not-found';
import { App } from './app';
import { Products } from './features/products/components/products';
import { Cart } from './features/cart/components/cart';

export const routes: Routes = [
  { path: '', component: Home,             title: `${App.TITLE} | Home` },
  { path: 'products', component: Products, title: `${App.TITLE} | Products` },
  { path: 'cart', component: Cart,         title: `${App.TITLE} | Shopping Cart`},
  { path: '**', component: NotFound,       title: `${App.TITLE} | Not found` }
];
