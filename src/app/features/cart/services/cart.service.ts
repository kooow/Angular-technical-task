import { Injectable, signal, WritableSignal } from "@angular/core";
import { ShoppingCart } from "../models/shopping.cart.model";
import { CartItem } from "../models/cartitem.models";
import { BuyableProduct } from "../../products/models/buyable.product.model";

@Injectable({
    providedIn: 'root', // Provided via Angular's DI tree
})
export class CartService {

    private readonly SHOPPING_CART_KEY: string = 'shoppingCart';

    shoppingCart: WritableSignal<ShoppingCart> = signal<ShoppingCart>(this.loadFromLocalStorage());

    constructor() {
    }

    private isLocalStorageAvailable(): boolean {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    private loadFromLocalStorage(): ShoppingCart {
        if (this.isLocalStorageAvailable()) {
            const shoppingCart = localStorage.getItem(this.SHOPPING_CART_KEY);
            return shoppingCart ? JSON.parse(shoppingCart) as ShoppingCart : { items: [], totalPrice: 0 };
        }
        return { items: [], totalPrice: 0 };
    }

    private saveToLocalStorage(): void {
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem(this.SHOPPING_CART_KEY, JSON.stringify(this.shoppingCart()));
        }
    }

    public addItem(buyableProduct: BuyableProduct) {

        this.shoppingCart.update((currentCart) => {

            const cartItem = currentCart.items.find((i) => i.id === buyableProduct.id);
            if (cartItem) {
                cartItem.amount += buyableProduct.amount;
            }
            else {
                let newCartItem = { ...buyableProduct } as CartItem;
                currentCart.items = [...currentCart.items, newCartItem];
            }

            currentCart.totalPrice += (buyableProduct.price * buyableProduct.amount);
            currentCart.totalPrice.toFixed(2);
            return currentCart;
        });
        this.saveToLocalStorage();

    }

    public removeItem(productId: string) {

        this.shoppingCart.update((currentCart) => {
            let updatedItems: CartItem[] = currentCart.items;

            const cartItem = currentCart.items.find((i) => i.id === productId);
            if (!cartItem) { // if not exists, do nothing
                return currentCart;
            }

            let searchedIndex = updatedItems.indexOf(cartItem);
            if (searchedIndex != -1) {
                updatedItems.splice(searchedIndex, 1);
            }

            currentCart.items = [...updatedItems];
            currentCart.totalPrice -= (cartItem.price * cartItem.amount);
            currentCart.totalPrice.toFixed(2);
            return currentCart;
        });
        this.saveToLocalStorage();
    }
}