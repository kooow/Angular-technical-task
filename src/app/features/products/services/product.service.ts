import { Inject, Injectable, InjectionToken, signal, OnInit, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

export const PRODUCT_JSON_URL = new InjectionToken<string>('jsonUrl', {
  providedIn: 'root',
  factory: () => ProductService.JSON_URL
});

@Injectable({
  providedIn: 'root', // Provided via Angular's DI tree
})
export class ProductService {

  static JSON_URL = 'assets/products.json';

  public products: WritableSignal<Map<string, Product>> = signal(new Map<string, Product>());

  constructor(private httpClient: HttpClient,
    @Inject(PRODUCT_JSON_URL) private jsonUrl: string) {
    this.#getProducts();
  }

  #getProducts(): void {
    this.httpClient.get<Product[]>(this.jsonUrl, { cache: 'force-cache' }).subscribe(productsFromJson => {
      const productsMap = new Map(productsFromJson.map((obj) => [obj.id, obj]));
      this.products.set(productsMap);
    });
  }

  public modifyAvailableAmount(productId: string, plusAmount: number): void {
    let searchedProduct = this.products().get(productId);
    if (!searchedProduct) {
      return;
    }
    searchedProduct = { ...searchedProduct, availableAmount: searchedProduct.availableAmount + plusAmount };
    this.products().set(productId, searchedProduct);
  }

  isAmountValid(productId: string, amount: number): boolean {
    let productMap = this.products.asReadonly()();
    const product = productMap.get(productId) ?? null;
    return !!product
      && amount > 0
      && amount >= product.minOrderAmount
      && amount <= product.availableAmount;
  }
}