import { TestBed } from "@angular/core/testing";
import { Product } from "../app/features/products/models/product.model";
import { ProductService } from "../app/features/products/services/product.service";
import { HttpClient } from "@angular/common/http";
import { asyncData } from "./async-observable-helpers";
import { provideZonelessChangeDetection } from '@angular/core';

describe('ProductService', () => {
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let productService: ProductService;
    let testProducts: Product[] = [
        { id: '1', name: 'Product 1', img: 'image-url', price: 10, availableAmount: 5, minOrderAmount: 1 },
    ];

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: HttpClient, useValue: httpClientSpy },
                provideZonelessChangeDetection()
            ]
        })
    });

    it('should create with empty list', async () => {
        httpClientSpy.get.and.returnValue(asyncData([]));
        productService = TestBed.inject(ProductService);
        expect(productService).toBeTruthy();
    });

    it('should fetch products after create', function (done) {
        httpClientSpy.get.and.returnValue(asyncData(testProducts));

        productService = TestBed.inject(ProductService);

        setTimeout(function () {
            expect(productService.products().size).toBe(1);
            done();
        }, 50);
    });

    it('should modify the availableAmount property', function (done) {
        httpClientSpy.get.and.returnValue(asyncData(testProducts));

        productService = TestBed.inject(ProductService);

        setTimeout(function () {
            expect(productService.products().size).toBe(1);
            productService.modifyAvailableAmount(testProducts[0].id, 10);
            var productList = Array.from(productService.products().values());
            expect(productList[0].availableAmount).toBe(15);
            productService.modifyAvailableAmount(testProducts[0].id, -10);
            var productList = Array.from(productService.products().values());
            expect(productList[0].availableAmount).toBe(5);

            done();
        }, 50);
    });

    it('should isAmountValid is false', function (done) {
        httpClientSpy.get.and.returnValue(asyncData(testProducts));
        productService = TestBed.inject(ProductService);

        setTimeout(function () {
            expect(productService.products().size).toBe(1);
            // when not found by product id
            expect(productService.isAmountValid('unknown id', 5)).toBe(false);
            // when amount is lower than minimum
            expect(productService.isAmountValid(testProducts[0].id, 0)).toBe(false);
            // when amount is greater than available
            expect(productService.isAmountValid(testProducts[0].id, 6)).toBe(false);
            done();
        }, 50);
    });

    it('should isAmountValid is true', function (done) {
        httpClientSpy.get.and.returnValue(asyncData(testProducts));
        productService = TestBed.inject(ProductService);

        setTimeout(function () {
            expect(productService.products().size).toBe(1);
            // when amount is greater than minimum
            expect(productService.isAmountValid(testProducts[0].id, 1)).toBe(true);
            expect(productService.isAmountValid(testProducts[0].id, 2)).toBe(true);
            // when amount is lower than available
            expect(productService.isAmountValid(testProducts[0].id, 4)).toBe(true);
            expect(productService.isAmountValid(testProducts[0].id, 5)).toBe(true);
            done();
        }, 50);
    });

});