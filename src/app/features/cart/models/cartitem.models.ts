import { BuyableProduct } from "../../products/models/buyable.product.model";
import { Product } from "../../products/models/product.model";

export interface CartItem extends Omit<BuyableProduct, 'availableAmount' | 'minOrderAmount'> {
}