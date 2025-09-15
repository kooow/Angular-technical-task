import { TestBed } from "@angular/core/testing";
import { CartService } from "../app/features/cart/services/cart.service";
import { provideZonelessChangeDetection } from "@angular/core";
import { Product } from "../app/features/products/models/product.model";

describe('CartService', () => {
    let cartService: CartService;
    let testProducts: Product[] = [
        { id: '1', name: 'Product 1', img: 'image-url', price: 10, availableAmount: 5, minOrderAmount: 1 },
        { id: '2', name: 'Product 2', img: 'img-url', price: 1, availableAmount: 10, minOrderAmount: 5 }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
        localStorage.clear();
        cartService = TestBed.inject(CartService);
    });

    it('should create the service', () => {
        expect(cartService).toBeTruthy();
        expect(cartService.shoppingCart().items.length).toBe(0);
        expect(cartService.shoppingCart().totalPrice).toBe(0);
    });

    it('should add item when not found', () => {
        let products = testProducts.map(p => ({ ...p, amount: 1 }));
        cartService.addItem(products[0]);
        expect(cartService.shoppingCart().items.length).toBe(1);
        expect(cartService.shoppingCart().totalPrice).toBe(1 * products[0].price);
    });

    it('should update item when found', () => {
        let products = testProducts.map(p => ({ ...p, amount: 1 }));
        cartService.addItem(products[0]);
        cartService.addItem(products[0]);
        expect(cartService.shoppingCart().items.length).toBe(1);
        expect(cartService.shoppingCart().totalPrice).toBe(2 * products[0].price);
    });

    it('should skip remove item if not found', () => {
        let products = testProducts.map(p => ({ ...p, amount: 1 }));
        cartService.addItem(products[0]);
        expect(cartService.shoppingCart().items.length).toBe(1);
        cartService.removeItem('unknow id');
        expect(cartService.shoppingCart().items.length).toBe(1);
    });

    it('should remove cart item and recalculate totalPrice if found', () => {
        let products = testProducts.map(p => ({ ...p, amount: 1 }));
        products[1].amount = 5;

        cartService.addItem(products[0]);
        cartService.addItem(products[1]);

        cartService.removeItem(products[0].id);

        expect(cartService.shoppingCart().items.length).toBe(1);
        expect(cartService.shoppingCart().totalPrice).toBe(5 * products[1].price);
    });

});