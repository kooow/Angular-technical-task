import { CartItem } from "./cartitem.models";

export interface ShoppingCart {
    items: CartItem[];
    totalPrice: number;
}