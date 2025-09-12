import { Routes } from '@angular/router';
import { Home } from  './home/home';
import { NotFound } from './not-found/not-found';
import { App } from './app';

export const routes: Routes = [
  { path: '', component: Home,       title: `${App.TITLE} | Home` },
  { path: '**', component: NotFound, title: `${App.TITLE} | Not found` }
];
