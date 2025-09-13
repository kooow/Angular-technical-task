import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../products/services/product.service';
import { CartItem } from '../models/cartitem.models';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {

  constructor(public cartService: CartService, private productService: ProductService) {
  }

  public async removeItem(cartItem: CartItem) {
    this.cartService.removeItem(cartItem.id);
    this.productService.modifyAvailableAmount(cartItem.id, cartItem.amount);
  }
}