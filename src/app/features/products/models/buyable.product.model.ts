import { Product } from "./product.model";

export interface BuyableProduct extends Product {
    amount: number;
}