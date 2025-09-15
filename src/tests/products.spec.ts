import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from '../app/features/cart/services/cart.service';
import { Products } from '../app/features/products/components/products';
import { Product } from '../app/features/products/models/product.model';
import { ProductService } from '../app/features/products/services/product.service';
import { CartItem } from '../app/features/cart/models/cartitem.models';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  let productsMap: Map<string, Product> = new Map<string, Product>([
    ["1", { id: '1', name: 'Product 1', img: 'image-url', price: 10, availableAmount: 50, minOrderAmount: 5 }],
    ["2", { id: '2', name: 'Product 2', img: 'image-url', price: 100, availableAmount: 10, minOrderAmount: 1 }]
  ]);

  beforeEach(async () => {
    const productService = jasmine.createSpyObj('ProductService', ['modifyAvailableAmount', 'isAmountValid', 'products']);
    productService.isAmountValid.and.returnValue(false);
    productService.products.and.returnValue(productsMap);

    const cartService = jasmine.createSpyObj('CartService', ['addItem', 'removeItem']);
    
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ProductService, useValue: productService },
        { provide: CartService, useValue: cartService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with list from ProductService', async () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
    expect(component.buyableProducts().length).toBe(2);
  });

  it('addToCart function should modify amount values', async () => {
    var firstProduct = component.buyableProducts()[0];
    firstProduct.amount = 5;
    await component.addToCart(firstProduct);
    expect(component.buyableProducts()[0].availableAmount).toBe(50 - 5);
    expect(component.buyableProducts()[0].amount).toBe(0);
  });

});