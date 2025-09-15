import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cart } from '../app/features/cart/components/cart';
import { Product } from '../app/features/products/models/product.model';
import { ProductService } from '../app/features/products/services/product.service';
import { CartService } from '../app/features/cart/services/cart.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { CartItem } from '../app/features/cart/models/cartitem.models';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;

  let productsMap: Map<string, Product> = new Map<string, Product>([
    ["1", { id: '1', name: 'Product 1', img: 'image-url', price: 10, availableAmount: 50, minOrderAmount: 5 }],
    ["2", { id: '2', name: 'Product 2', img: 'image-url', price: 100, availableAmount: 10, minOrderAmount: 1 }]
  ]);

  let cartItems: CartItem[] = [
    { id: '1', name: 'Product 1', amount: 2, img: 'image-url', price: 20 },
  ];

  beforeEach(async () => {

    const productService = jasmine.createSpyObj('ProductService', ['modifyAvailableAmount', 'isAmountValid', 'products']);
    productService.isAmountValid.and.returnValue(false);
    productService.products.and.returnValue(productsMap);

    const cartService = jasmine.createSpyObj('CartService', ['addItem', 'removeItem', 'shoppingCart']);
    cartService.shoppingCart.and.returnValue({ items: cartItems, totalPrice: 20 });

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ProductService, useValue: productService },
        { provide: CartService, useValue: cartService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    var shoppingCart = component.cartService.shoppingCart();
    expect(shoppingCart.items.length).toBe(1);
    expect(shoppingCart.totalPrice).toBe(20);

    var cartHtmlElement:HTMLElement = fixture.nativeElement;
    const ulElements = cartHtmlElement.querySelector('div.items');
    expect(ulElements).not.toBeNull();
  });

  it('should call remove function from CartService', async () => {
    var shoppingCart = component.cartService.shoppingCart();
    expect(shoppingCart.items.length).toBe(1);
    var firstCartItem = shoppingCart.items[0];
    expect(firstCartItem).not.toBeNull();
    await component.removeItem(firstCartItem);
    expect(component.cartService.removeItem).toHaveBeenCalled();
  });

});
