import { CommonModule } from '@angular/common';
import { Component, effect, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../cart/services/cart.service';
import { BuyableProduct } from '../models/buyable.product.model';
import { PRODUCT_JSON_URL, ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  providers: [
    { provide: PRODUCT_JSON_URL, useValue: ProductService.JSON_URL }
  ],
  styleUrls: ['./products.css'],
})
export class Products {
  buyableProducts: WritableSignal<BuyableProduct[]> = signal([]);

  constructor(private productService: ProductService, private cartService: CartService) {
    effect(() => {
       this.fetchProductFromService();
    });
  }

  fetchProductFromService(): void {
    let currentProducts = this.productService.products();
    let onlyProducts = Array.from(currentProducts.values());
    let buyableProducts = onlyProducts.map(p =>  ({ ...p, amount: 0 }));
    this.buyableProducts.set(buyableProducts);
  }

  async addToCart(buyableProduct: BuyableProduct) {
    this.productService.modifyAvailableAmount(buyableProduct.id, -1 * buyableProduct.amount);
    this.cartService.addItem(buyableProduct);

    buyableProduct.availableAmount -= buyableProduct.amount;
    buyableProduct.amount = 0;
  }

  isAmountValid(productId: string, amount: number): boolean {
    return this.productService.isAmountValid(productId, amount);
  }
}


