import { Routes } from '@angular/router';
import { Home } from  './home/home';
import { NotFound } from './not-found/not-found';
import { App } from './app';
import { Products } from './features/products/components/products';

export const routes: Routes = [
  { path: '', component: Home,               title: `${App.TITLE} | Home` },
  { path: 'products', component: Products,   title: `${App.TITLE} | Products` },
  { path: '**', component: NotFound,         title: `${App.TITLE} | Not found` }
];
